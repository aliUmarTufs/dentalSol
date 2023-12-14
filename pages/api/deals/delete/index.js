import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let getData = req.body;
    if (getData?.deal_id) {
      let deleteUserDeal = await supabase
        .from("avail_deal_users")
        .delete()
        .eq("deal_id", getData?.deal_id);
      if (deleteUserDeal?.data) {
        let deleteData = await supabase
          .from("deals")
          .delete()
          .eq("id", getData?.deal_id);
        if (deleteData?.data && deleteData?.data?.length > 0) {
          res.status(200).send({
            status: true,
            message: "Deal deleted successfully",
            data: deleteData?.data[0],
          });
        } else {
          res.status(400).send({
            status: false,
            message: `Error Occured ${deleteData?.error?.message}`,
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: `Error Occured ${deleteUserDeal?.error?.message}`,
        });
      }
    } else {
      res.status(400).send({
        status: false,
        message: `Deal is required`,
      });
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
