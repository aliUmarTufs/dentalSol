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
          let userDetail;
          if (getData?.user_id) {
            userDetail = await supabase
              .from("users")
              .select("*")
              .eq("id", getData?.user_id);
            if (userDetail?.data && userDetail?.data?.length > 0) {
              let bookSlot = await supabase
                .from("featured_slots_avail")
                .insert({
                  user_id: getData?.user_id,
                  slot_id: getData?.slot_id,
                  item_id: getData?.item_id,
                  item_type: getData?.item_type,
                });
              if (bookSlot?.data && bookSlot?.data?.length > 0) {
                let updateItems;
                let updateBookSlot = await supabase
                  .from("featured_slots")
                  .update({
                    slot_status: "is_booked",
                  })
                  .eq("id", getData?.slot_id);

                if (updateBookSlot?.data) {
                  res.status(200).send({
                    status: true,
                    message: "Item Featured Successfully",
                    data: bookSlot?.data,
                  });
                } else {
                  res.status(400).send({
                    status: false,
                    message: "Error Occured",
                  });
                }
              } else {
                res.status(400).send({
                  status: false,
                  message: "Error Occured",
                });
              }
            } else {
              res.status(400).send({
                status: false,
                message: "User Error occured",
              });
            }
          } else {
            res.status(400).send({
              status: false,
              message: "User Error occured",
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
