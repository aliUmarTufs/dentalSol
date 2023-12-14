import _ from "lodash";
import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      let ids;
      const getData = req.body;
      let getSlotsData;
      switch (getData?.item_type) {
        case "products":
          getSlotsData = await supabase
            .from("featured_slots_avail")
            .select("* , slot_id!inner (*)")
            .eq("item_type", getData?.item_type)
            .eq("user_id", getData?.user_id);
          break;
        case "courses":
          getSlotsData = await supabase
            .from("featured_slots_avail")
            .select("* , slot_id!inner (*)")
            .eq("item_type", getData?.item_type)
            .eq("user_id", getData?.user_id);
          break;
        case "services":
          getSlotsData = await supabase
            .from("featured_slots_avail")
            .select("* , slot_id!inner (*)")
            .eq("item_type", getData?.item_type)
            .eq("user_id", getData?.user_id);
          break;

        case "articles":
          getSlotsData = await supabase
            .from("featured_slots_avail")
            .select("* , slot_id!inner (*)")
            .eq("item_type", getData?.item_type)
            .eq("user_id", getData?.user_id);
          break;

        default:
          break;
      }
      if (getSlotsData?.data) {
        if (getSlotsData?.data?.length > 0) {
          let itemDetail;
          for (let index = 0; index < getSlotsData?.data.length; index++) {
            switch (getSlotsData?.data[index]?.item_type) {
              case "products":
                itemDetail = await supabase
                  .from("products")
                  .select("*")
                  .eq("id", getSlotsData?.data[index]?.item_id);
                break;
              case "courses":
                itemDetail = await supabase
                  .from("courses")
                  .select("*")
                  .eq("id", getSlotsData?.data[index]?.item_id);
                break;

              case "services":
                itemDetail = await supabase
                  .from("directory_companies")
                  .select("*")
                  .eq("id", getSlotsData?.data[index]?.item_id);
                break;

              case "articles":
                itemDetail = await supabase
                  .from("articles")
                  .select("*")
                  .eq("id", getSlotsData?.data[index]?.item_id);
                break;

              default:
                break;
            }
            if (itemDetail?.data && itemDetail?.data?.length > 0) {
              getSlotsData.data[index].itemDetail = itemDetail?.data[0];
            }
          }

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
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
