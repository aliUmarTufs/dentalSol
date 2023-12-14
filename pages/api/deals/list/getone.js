import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    if (data?.deal_id) {
      let dealData = await supabase
        .from("deals")
        .select("* , organizations(*)")
        .eq("id", data?.deal_id);
      if (dealData?.data && dealData?.data?.length > 0) {
        res.status(200).send({
          status: true,
          message: "Deal Found",
          data: dealData?.data[0],
        });
      } else {
        res.status(400).send({
          status: false,
          message: "No deal Found",
        });
      }
    } else {
      res.status(400).send({
        status: false,
        message: "Deal required",
      });
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
