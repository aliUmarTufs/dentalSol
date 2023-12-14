import { supabase } from "../../../lib/supabaseClient";
import _ from "lodash";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      let ids;
      const getData = req.body;
      let getSlotsData;
      if (getData?.slot_id) {
        getSlotsData = await supabase
          .from("featured_slots")
          .select("*")
          .eq("slot_status", "is_empty")
          .eq("id", getData?.slot_id);
      } else {
        getSlotsData = await supabase
          .from("featured_slots")
          .select("*")
          .eq("slot_status", "is_empty")
          .eq("slot_type", getData?.slot_type);
      }

      if (getSlotsData?.data) {
        if (getSlotsData?.data?.length > 0) {
          res.status(200).send({
            status: true,
            message: "Data found",
            data: getSlotsData?.data,
          });
        } else {
          res.status(200).send({
            status: true,
            message: "No Data found",
            data: getSlotsData?.data,
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
