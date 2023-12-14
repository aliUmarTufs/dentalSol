import _ from "lodash";
import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let getData = req.body;
    if (getData?.deal_id) {
      let obj = {
        is_approved: getData?.approval,
      };
      let updateDeal = await supabase
        .from("deals")
        .update(obj)
        .eq("id", getData?.deal_id);
      if (updateDeal?.data && updateDeal?.data?.length > 0) {
        res.status(200).send({
          status: true,
          message: "Request Submitted Successfully",
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
