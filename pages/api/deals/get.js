import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    // if (data?.organization_id) {
    let getDeals = await supabase.from("deals").select("*");
    if (getDeals.data && getDeals.data.length > 0) {
      res.status(200).send({
        status: true,
        message: "Deals found",
        data: getDeals.data,
      });
    } else {
      res.status(200).send({
        status: true,
        message: "No Deals Found",
        data: getDeals.data,
      });
    }
    // } else {
    //   res
    //     .status(400)
    //     .send({ status: false, message: "Organization Id is required." });
    // }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
