import { BASE_URL, stripe_payment } from "../../../constants";
import { supabase, supabase_admin_secret } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getBody = req.body;
    if (getBody?.email) {
      let checkUser = await supabase
        .from("users")
        .select("* ,user_city(*), subscription_id(*) , plan_id(*) ")
        .eq("user_email", getBody?.email);
      if (checkUser?.data && checkUser?.data?.length > 0) {
        if (checkUser?.data[0]?.stripe_account_id) {
          let StripeAccount = await stripe_payment.accounts.retrieve(
            checkUser?.data[0]?.stripe_account_id
          );
          if (StripeAccount) {
            checkUser.data[0].accounts = StripeAccount?.external_accounts?.data;
          } else {
            checkUser.data[0].accounts = [];
          }
        } else {
          checkUser.data[0].accounts = [];
        }
        res.status(200).send({
          status: true,
          message: "User Found.",
          data: checkUser?.data[0],
        });
      } else {
        res.status(400).send({
          status: false,
          message: "No user found against this email.",
        });
      }
    } else {
      res.status(400).send({ status: false, message: "Email required" });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
