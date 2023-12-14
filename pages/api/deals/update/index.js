import _ from "lodash";
import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let getData = req.body;
    if (getData?.deal_id) {
      let obj = {
        expiry_data: getData?.expiry_data,
        location: getData?.location,
        net_savings: getData?.net_savings,
        coupon_code: getData?.coupon_code,
        quantity: getData?.quantity,
        item_quantity: getData?.item_quantity,
        free_quantity: getData?.free_quantity,
        tag_line: getData?.tag_line,
        country: getData?.country,
      };
      let updateDeal = await supabase
        .from("deals")
        .update(obj)
        .eq("id", getData?.deal_id);
      if (updateDeal?.data && updateDeal?.data?.length > 0) {
        res.status(200).send({
          status: true,
          message: " Deal Updated Successfully",
          data: updateDeal?.data[0],
        });
      } else {
        res.status(400).send({
          status: false,
          message: `Error Occured ${updateDeal?.error?.message}`,
        });
      }
    } else {
      res.status(200).send({
        status: false,
        message: `Deal is required`,
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
