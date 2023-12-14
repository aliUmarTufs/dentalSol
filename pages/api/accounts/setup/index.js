import _ from "lodash";
import { stripe_payment } from "../../../../constants";
import { supabase } from "../../../../lib/supabaseClient";
export default async function handler(req, res) {
  if (req.method === "POST") {
    let data = req.body;
    if (data?.user_id) {
      try {
        let message;
        let StripeAccount;
        let getUser = await supabase
          .from("users")
          .select("*")
          .eq("id", data?.user_id);
        if (getUser?.data && getUser?.data?.length > 0) {
          if (getUser?.data[0]?.stripe_account_id) {
            StripeAccount = await stripe_payment.accounts.retrieve(
              getUser?.data[0]?.stripe_account_id
            );
            if (
              StripeAccount &&
              StripeAccount?.external_accounts?.data &&
              StripeAccount?.external_accounts?.data?.length > 0
            ) {
              message = "Account Setup Successfully";
            } else {
              message = "Account Update Successfully";
            }
          }

          let updateUser = await supabase
            .from("users")
            .update({
              account_setup: 1,
            })
            .eq("id", data?.user_id);
          if (updateUser?.data && updateUser?.data?.length > 0) {
            getUser = await supabase
              .from("users")
              .select("* ,user_city(*), subscription_id(*) , plan_id(*) ")
              .eq("id", data?.user_id);
            if (getUser?.data && getUser?.data?.length > 0) {
              if (StripeAccount) {
                getUser.data[0].accounts =
                  StripeAccount?.external_accounts?.data;
              } else {
                getUser.data[0].accounts = [];
              }

              res.status(200).send({
                status: true,
                message: message,
                data: getUser?.data[0],
              });
            } else {
              res.status(400).send({
                status: false,
                message: `Error Occured ${getUser?.error?.message}`,
              });
            }
          } else {
            res.status(400).send({
              status: false,
              message: `Error Occured ${updateUser?.error?.message}`,
            });
          }
        } else {
          res.status(400).send({ status: false, message: "No User Found" });
        }
      } catch (err) {
        res.status(400).send({ status: false, message: err?.message });
      }
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
