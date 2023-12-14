import _ from "lodash";
import {
  BASE_URL,
  IMAGE_BASE_URL,
  stripe_payment,
} from "../../../../constants";
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
        if (getData?.items && getData?.items?.length > 0) {
          let arr = [];
          getData?.items?.map((e) => {
            arr.push({
              price_data: {
                currency: "usd",
                product_data: {
                  name: e?.title,
                },
                unit_amount: Math.floor(e?.price * 100 || 100),
              },
              quantity: e?.unit || 1,
            });
          });
          let obj = {
            success_url: `${BASE_URL}/checkout?mode=checkout&success=true`,
            cancel_url: `${BASE_URL}/checkout?mode=checkout&success=false`,
            line_items: arr,
            mode: "payment",
            metadata: {
              buyer_id: getData?.user_id,
              organizationID: getData?.organization_id,
              checkout_type: "purchasing",
            },
          };
          console.log(getUser?.data[0]);
          if (getUser?.data[0]?.stripe_customer_id) {
            obj.customer = getUser?.data[0]?.stripe_customer_id;
          } else {
            obj.customer_email = getUser?.data[0]?.user_email;
          }
          const session = await stripe_payment.checkout.sessions.create(obj);
          if (session) {
            res.status(200).send({
              status: true,
              message: "Session Created.",
              data: { url: session?.url },
            });
          } else {
            res.status(400).send({
              status: false,
              message: "Session error.",
            });
          }
        } else {
          res.status(400).send({
            status: false,
            message: "There should be 1 item required.",
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: getUser?.error?.message,
        });
      }
    } catch (error) {
      console.log({ error });
      res.status(400).send({
        status: false,
        message: error?.message,
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
