import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    if (getData?.date) {
      let checkIfAllExpire = await supabase
        .from("deals")
        .select("*")
        .eq("is_expire", 0)
        .lt("expiry_data", getData?.date);
      if (checkIfAllExpire?.data && checkIfAllExpire?.data?.length > 0) {
        let updateSupabase = await supabase
          .from("deals")
          .update({ is_expire: 1 })
          .lt("expiry_data", getData?.date);

        if (updateSupabase?.data) {
          res.status(200).send({
            status: true,
            message: "Data is Update",
            data: updateSupabase?.data,
          });
        } else {
          res.status(400).send({
            status: false,
            message: `Error Occured ${updateSupabase?.error?.message}`,
          });
        }
      } else {
        res.status(201).send({
          status: true,
          message: "All Data is update",
          data: checkIfAllExpire?.data,
        });
      }
    } else {
      res.status(400).send({
        status: false,
        message: "Date is required.",
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
