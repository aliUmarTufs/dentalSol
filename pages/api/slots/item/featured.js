import _ from "lodash";
import { supabase } from "../../../../lib/supabaseClient";
import { BASE_URL, stripe_payment } from "../../../../constants";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const getData = req.body;

      let getSlotsData = await supabase
        .from("featured_slots")
        .select("*")
        .eq("id", getData?.slot_id);
      if (getSlotsData?.data) {
        if (getSlotsData?.data?.length > 0) {
          let itemDetail;
          if (getData?.item && getData?.item_id) {
            switch (getData?.item) {
              case "products":
                itemDetail = await supabase
                  .from("products")
                  .select("*")
                  .eq("id", getData?.item_id);
                break;
              case "courses":
                itemDetail = await supabase
                  .from("courses")
                  .select("*")
                  .eq("id", getData?.item_id);
                break;
              case "services":
                itemDetail = await supabase
                  .from("directory_companies")
                  .select("*")
                  .eq("id", getData?.item_id);
                break;

              case "articles":
                itemDetail = await supabase
                  .from("articles")
                  .select("*")
                  .eq("id", getData?.item_id);
                break;

              default:
                break;
            }
            if (itemDetail?.data && itemDetail?.data?.length > 0) {
              let userDetail;
              if (getData?.user_id) {
                userDetail = await supabase
                  .from("users")
                  .select("*")
                  .eq("id", getData?.user_id);
              }
              let obj = {
                success_url: `${BASE_URL}/dashboard/get-featured/${getData?.item}/${getData?.item_id}?mode=featuredItem&success=true&slot=${getData?.slot_id}`,
                cancel_url: `${BASE_URL}/dashboard/get-featured/${getData?.item}/${getData?.item_id}?mode=featuredItem&success=false&slot=${getData?.slot_id}`,
                line_items: [
                  {
                    price_data: {
                      currency: "usd",
                      product_data: {
                        name: getSlotsData?.data[0]?.slot_name,
                      },
                      unit_amount:
                        getSlotsData?.data[0]?.slot_price * 100 || 100,
                    },
                    quantity: 1,
                  },
                ],
                mode: "payment",
              };
              if (userDetail?.data) {
                if (userDetail?.data[0]?.stripe_customer_id) {
                  obj.customer = userDetail?.data[0]?.stripe_customer_id;
                } else {
                  obj.customer_email = userDetail?.data[0]?.user_email;
                }
              }
              const session = await stripe_payment.checkout.sessions.create(
                obj
              );

              res.status(200).send({
                status: true,
                message: "Payment Route Created",
                data: session,
              });
            } else {
              res.status(400).send({
                status: false,
                message: "Item Not Matched With Type",
              });
            }
          } else {
            res.status(400).send({
              status: false,
              message: "Item Required",
            });
          }
        } else {
          res.status(400).send({
            status: false,
            message: "No Slot Found",
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: "Error occured",
        });
      }
    } catch (error) {
      res.status(400).send({
        status: false,
        message: error.message,
      });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}
