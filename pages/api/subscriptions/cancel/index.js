import _ from "lodash";
import { BASE_URL, stripe_payment } from "../../../../constants";
import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const getData = req.body;
      let getUser = await supabase
        .from("users")
        .select("*")
        .eq("id", getData?.user_id);
      if (getUser?.data && getUser?.data?.length > 0) {
        if (getUser?.data[0]?.stripe_subscription_id) {
          const subscription = await stripe_payment.subscriptions.update(
            getUser?.data[0]?.stripe_subscription_id,
            { cancel_at_period_end: true }
          );
          if (subscription) {
            let update = await supabase
              .from("users")
              .update({
                subscription_id: null,
                plan_id: null,
                plan_type: null,
                stripe_subscription_id: null,
              })
              .eq("id", getData?.user_id);
            if (update?.data && update?.data?.length > 0) {
              let getUserData = await await supabase
                .from("users")
                .select("* ,user_city(*), subscription_id(*) , plan_id(*) ")
                .eq("id", getData?.user_id);
              if (getUserData?.data && getUserData?.data?.length > 0) {
                if (getUserData?.data[0]?.stripe_account_id) {
                  let StripeAccount = await stripe_payment.accounts.retrieve(
                    getUserData?.data[0]?.stripe_account_id
                  );
                  if (StripeAccount) {
                    getUserData.data[0].accounts =
                      StripeAccount?.external_accounts?.data;
                  } else {
                    getUserData.data[0].accounts = [];
                  }
                } else {
                  getUserData.data[0].accounts = [];
                }
                res.status(200).send({
                  status: true,
                  message: "Subscription Canceled",
                  data: { subscription, user: getUserData?.data[0] },
                });
              } else {
                res.status(400).send({
                  status: false,
                  message: "Error",
                });
              }
            } else {
              res.status(400).send({
                status: false,
                message: "Error",
              });
            }
          } else {
            res.status(400).send({
              status: false,
              message: "Error",
            });
          }
        } else {
          res.status(400).send({
            status: false,
            message: "Plan is already cancelled",
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: getUser?.error?.message,
        });
      }
    } catch (error) {
      res.status(400).send({
        status: false,
        message: error?.message,
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
