import { stripe_payment } from "../../../constants";
import { supabase, supabase_admin_secret } from "../../../lib/supabaseClient";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    if (getData.email && getData.password) {
      const login = await supabase_admin_secret.auth.signIn({
        email: getData?.email,
        password: getData?.password,
      });

      if (login.error) {
        res.status(400).send({ status: false, message: login.error.message });
      } else {
        let subs = false;
        const getSubscribed = await supabase
          .from("subscribers")
          .select("*")
          .eq("email", login.data.user.email);
        if (getSubscribed?.data && getSubscribed?.data?.length > 0) {
          subs = true;
        }

        let userData = await supabase
          .from("users")
          .select("* ,user_city(*), subscription_id(*) , plan_id(*) ")
          .eq("user_email", login.data.user.email)
          .eq("is_deleted", 0);
        // .eq("is_blocked", 0);
        if (userData?.data && userData?.data?.length > 0) {
          if (userData?.data[0]?.is_blocked == 0) {
            if (userData?.data[0].role_type == "Admin") {
              res.status(400).send({
                status: false,
                message: "No user found",
              });
            } else {
              let obj = {
                auth_token: login.data.access_token,
                refresh_token: login.data.refresh_token,
                ...userData.data[0],
                subs,
              };
              const userAuthData = await supabase_admin_secret.auth.api.getUser(login.data.access_token);
              if (userData?.data[0]?.stripe_account_id) {
                let StripeAccount = await stripe_payment.accounts.retrieve(
                  userData?.data[0]?.stripe_account_id
                );
                if (StripeAccount) {
                  obj.accounts = StripeAccount?.external_accounts?.data;
                } else {
                  obj.accounts = [];
                }
              } else {
                obj.accounts = [];
              }

              login.data.loggedInUser = obj;
              res.setHeader(
                "Set-Cookie",
                serialize("user_token", userData?.data[0]?.id, { path: "/" })
              );
              res.status(200).send({
                status: true,
                message: "Login Successfull",
                data: login.data,
                userAuthData
              });
            }
          } else {
            res.status(400).send({
              status: false,
              message: "Your account has been blocked by Admin",
              // data: login.data,
            });
          }
        } else {
          res.status(400).send({
            status: false,
            message: "Invalid Credentials",
            // data: login.data,
          });
        }
      }
    } else {
      res
        .status(400)
        .send({ status: false, message: "Email or Password required" });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
