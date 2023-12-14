import { supabase } from "../../../lib/supabaseClient";
import _ from "lodash";
import { stripe_payment } from "../../../constants";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const event = req.body;
      const obj = event.data.object;
      let errorStack = [];
      let metadata;
      let message;
      console.log({ obj });
      switch (event.type) {
        case "checkout.session.completed":
          metadata = obj?.metadata;
          if (metadata) {
            // let finSubscription = await supabase
            //   .from("subscriptions")
            //   .select("*")
            //   .eq("id", metadata?.subscription_id);

            if (metadata?.checkout_type == "vendor_subscription") {
              let getUser = await supabase
                .from("users")
                .select("*")
                .eq("id", metadata?.user_id);
              if (getUser?.data && getUser?.data?.length > 0) {
                if (getUser?.data[0]?.stripe_subscription_id) {
                  await stripe_payment.subscriptions.update(
                    getUser?.data[0]?.stripe_subscription_id,
                    { cancel_at_period_end: true }
                  );
                }
                let update = await supabase
                  .from("users")
                  .update({
                    subscription_id: metadata?.subscription_id,
                    plan_id: metadata?.plan_id,
                    plan_type: metadata?.plan_type,
                    stripe_subscription_id: obj?.subscription,
                    stripe_customer_id: obj?.customer,
                  })
                  .eq("id", metadata?.user_id);
                if (update && update?.data) {
                  console.log(update?.data, "User update");
                  message = "User Subscription Update";

                  let subscribeUser = await supabase
                    .from("subscription_buyers")
                    .insert({
                      user_id: metadata?.user_id,
                      subscription_id: metadata?.subscription_id,
                      plan_id: metadata?.plan_id,
                      type: metadata?.plan_type,
                      stripe_subscription_id: obj?.subscription,
                    });
                  if (subscribeUser?.data && subscribeUser?.data?.length > 0) {
                    console.log(
                      subscribeUser?.data,
                      "subscription_buyers added"
                    );
                  } else {
                    errorStack.push(subscribeUser?.error?.message);
                  }
                }
              }
            }

            if (metadata?.checkout_type == "purchasing") {
              let charge = null;
              if (metadata?.organizationID) {
                let findVendor = await supabase
                  .from("organizations")
                  .select("*")
                  .eq("id", metadata?.organizationID);
                if (findVendor?.data && findVendor?.data?.length > 0) {
                  if (findVendor?.data[0]?.organization_user) {
                    let vendorDetail = await supabase
                      .from("users")
                      .select("*")
                      .eq("id", findVendor?.data[0]?.organization_user);
                    if (vendorDetail?.data && vendorDetail?.data?.length > 0) {
                      if (
                        vendorDetail?.data[0]?.account_setup == 1 &&
                        vendorDetail?.data[0]?.stripe_account_id
                      ) {
                        const paymentIntent =
                          await stripe_payment.paymentIntents.retrieve(
                            obj.payment_intent
                          );
                        // while (!_.isNull(charge)) {
                        //   const paymentIntent =
                        //     await stripe_payment.paymentIntents.retrieve(
                        //       obj.payment_intent
                        //     );
                        //   console.log("While Loop Running");
                        //   if (paymentIntent) {
                        //     if (
                        //       paymentIntent?.metadata &&
                        //       paymentIntent?.metadata?.charge_id
                        //     ) {
                        //       charge = paymentIntent?.metadata?.charge_id;
                        //     }
                        //   }
                        // }

                        if (paymentIntent && paymentIntent?.latest_charge) {
                          if (vendorDetail?.data[0]?.stripe_account_id) {
                            let totalDeduction =
                              obj.amount_total - (obj.amount_total * 5) / 100;
                            let feesCalculations =
                              totalDeduction - (obj.amount_total * 0.029 + 30);
                            let transferAmount =
                              await stripe_payment.transfers.create({
                                amount: feesCalculations,
                                currency: "cad",
                                destination:
                                  vendorDetail?.data[0]?.stripe_account_id,
                                source_transaction:
                                  paymentIntent?.latest_charge,
                              });
                            if (transferAmount) {
                              message = "Transfer Successfull";
                            }
                          } else {
                            message = "No Stripe ID connected";
                          }
                        } else {
                          message = "Transfer Not held because of charge";
                        }
                      }
                    }
                  } else {
                    message = "No user registered with this organization";
                  }
                } else {
                  message = "No Organization Found";
                }
              } else {
                message = "No Organization is linked";
              }
            }
          }

          break;

        // case "charge.succeeded":
        //   let paymentIntentID = obj.payment_intent;
        //   let updatepaymentIntent = await stripe_payment.paymentIntents.update(
        //     paymentIntentID,
        //     {
        //       metadata: { charge_id: obj.id },
        //     }
        //   );
        //   if (updatepaymentIntent) {
        //     message = "Payment Intent Updated";
        //   }
        //   break;
        default:
          break;
      }

      return res
        .status(200)
        .send({ status: true, message: message, data: obj });
    } catch (error) {
      res.status(400).send({ message: error?.message });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
