import { supabase } from "../../../../lib/supabaseClient";
import _ from "lodash";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    if (getData?.organization_id && getData?.item_id) {
      if (getData?.type == "services" && getData?.deal_type == "free_item") {
        res.status(400).send({
          status: false,
          message: "This item can not be created free.",
        });
      } else {
        let obj = {
          expiry_data: getData?.expiry_data,
          location: getData?.location,
          net_savings: getData?.net_savings,
          coupon_code: getData?.coupon_code,
          item_id: getData?.item_id,
          type: getData?.type,
          deal_type: getData?.deal_type,
          quantity: getData?.quantity,
          item_quantity: getData?.item_quantity,
          free_quantity: getData?.free_quantity,
          free_item_id: getData.free_item_id,
          organization_id: getData?.organization_id,
          tag_line: getData?.tag_line,
          country: getData?.country,
          by_admin: getData?.isAdmin,
        };
        if (getData?.isAdmin && getData?.isAdmin == 1) {
          obj.is_approved = true;
        }
        let checkExistingDeal = await supabase
          .from("deals")
          .select("*")
          .eq("is_expire", 0)
          .eq("item_id", getData?.item_id);
        if (checkExistingDeal?.data && checkExistingDeal?.data?.length > 0) {
          res.status(400).send({
            status: false,
            message: "Deal Already created against this item.",
            data: checkExistingDeal?.data,
          });
        } else {
          let createDeal = await supabase.from("deals").insert(obj);
          if (createDeal?.data && createDeal?.data?.length > 0) {
            res.status(200).send({
              status: true,
              message: "Deal Created",
              data: createDeal?.data,
            });
          } else {
            res.status(400).send({
              status: true,
              message: "Error Occured",
            });
          }
        }
      }
    } else {
      res.status(400).send({
        status: true,
        message: "Organization or Item id required.",
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
