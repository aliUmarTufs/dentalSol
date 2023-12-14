import _ from "lodash";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const getData = req.query;
    if (getData?.entity_type) {
      let itemDetails;
      switch (getData?.entity_type) {
        case "courses":
          itemDetails = await supabase
            .from("courses")
            .select("*")
            .eq("id", getData?.id);

          break;
        case "products":
          itemDetails = await supabase
            .from("products")
            .select("*")
            .eq("id", getData?.id);

          break;
        case "services":
          itemDetails = await supabase
            .from("directory_companies")
            .select("*")
            .eq("id", getData?.id);
          break;
        case "articles":
          itemDelete = await supabase
            .from("articles")
            .select("*")
            .eq("id", getData?.id);
          break;

        default:
          break;
      }
      if (itemDetails && itemDetails?.data) {
        res.status(200).send({
          status: true,
          message: "Data Found",
          data: itemDetails?.data[0],
        });
      } else {
        res.status(400).send({
          status: false,
          message: "Error Occured",
        });
      }
    } else {
      res.status(400).send({
        status: false,
        message: "Type required",
      });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}
