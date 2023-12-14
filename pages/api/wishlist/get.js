import _ from "lodash";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    let responseObj = {};
    let data = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", getData?.user_id)
      .eq("is_like", true);
    if (data.data && data?.data?.length > 0) {
      let ids = _.map(data?.data, "item_id");
      let itemData = await supabase
        .from("deals")
        .select("* , organizations(*)")
        .eq("is_expire", "0")
        .in("id", ids);
      if (itemData?.data && itemData?.data?.length > 0) {
        let itemDataids = _.map(itemData?.data, "item_id");
        data?.data?.map((d) => {
          let filterItem = itemData?.data?.filter((e) => {
            return e.id == d.item_id;
          });
          if (filterItem && filterItem?.length > 0) {
            d.itemDetails = filterItem;
          }
        });
      }
      res.status(200).send({
        status: true,
        message: " Data Found",
        data: data?.data,
      });
    } else {
      res.status(400).send({
        status: true,
        message: data?.error?.message,
      });
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
