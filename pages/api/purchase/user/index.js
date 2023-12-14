import _ from "lodash";
import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const getData = req.body;
      if (getData?.user_id) {
        let getUser = await supabase
          .from("users")
          .select("*")
          .eq("id", getData?.user_id);
        if (getUser?.data && getUser?.data?.length > 0) {
          let getPurchases = await supabase
            .from("purchases")
            .select("* , buyer_id(*) , organization_id(*)")
            .eq("buyer_id", getData?.user_id)
            .order("created_at", { ascending: false });
          if (getPurchases?.data) {
            res.status(200).send({
              status: true,
              message: "Data Found",
              data: getPurchases?.data,
            });
          } else {
            res.status(400).send({
              status: false,
              message: getUser?.error?.message,
            });
          }
        } else {
          res.status(400).send({
            status: false,
            message: getUser?.error?.message,
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: "Items are required",
        });
      }
    } catch (error) {
      res.status(400).send({
        status: false,
        message: error?.message,
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
