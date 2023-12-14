import _ from "lodash";
import { BASE_URL, stripe_payment } from "../../../constants";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let data = req.body;
    if (data?.email) {
      try {
        let getUser = await supabase
          .from("users")
          .select("*")
          .eq("user_email", data?.email);
        if (getUser?.data && getUser?.data?.length > 0) {
          if (!getUser?.data[0]?.stripe_account_id) {
            let createStripeAccount = await stripe_payment.accounts.create({
              type: "express",
              email: data?.email,
              business_type: "individual",
              capabilities: {
                transfers: { requested: true },
              },
              settings: { payouts: { schedule: { interval: "daily" } } },
            });

            if (createStripeAccount) {
              let updateUser = await supabase
                .from("users")
                .update({
                  stripe_account_id: createStripeAccount?.id,
                })
                .eq("user_email", data?.email);
              if (updateUser?.data && updateUser?.data?.length > 0) {
                let account_link = await stripe_payment.accountLinks.create({
                  account: createStripeAccount?.id,
                  refresh_url: `${BASE_URL}/dashboard/profile?type=fail`,
                  return_url: `${BASE_URL}/dashboard/profile?type=success`,
                  type: "account_onboarding",
                });
                if (account_link) {
                  res.status(200).send({
                    status: true,
                    message: "Account Created",
                    data: account_link,
                  });
                } else {
                  res
                    .status(400)
                    .send({ status: false, message: "error occured" });
                }
              } else {
                res.status(400).send({
                  status: false,
                  message: `error occured - ${updateUser?.error?.message}`,
                });
              }
            } else {
              res.status(400).send({ status: false, message: "error occured" });
            }
          } else {
            let account_link = await stripe_payment.accountLinks.create({
              account: getUser?.data[0]?.stripe_account_id,
              refresh_url: `${BASE_URL}/dashboard/profile?type=fail&mode=accountsetup`,
              return_url: `${BASE_URL}/dashboard/profile?type=success&mode=accountsetup`,
              type: "account_onboarding",
            });
            if (account_link) {
              res.status(200).send({
                status: true,
                message: "Account Created",
                data: account_link,
              });
            } else {
              res.status(400).send({ status: false, message: "error occured" });
            }
          }
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
