import _ from "lodash";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    let categoryDetail;
    let limit = 10;
    let list;
    if (getData?.type && getData?.category) {
      switch (getData?.type) {
        case "course":
          list = await supabase
            .from("courses")
            .select("*")
            .eq("category", getData?.category)
            .range(getData?.offset, getData?.offset + limit);

          break;
        case "products":
          categoryDetail = await supabase
            .from("product_category")
            .select("*")
            .eq("parent_category", getData?.category);
          if (categoryDetail?.data && categoryDetail?.data?.length > 0) {
            let ids = _.map(categoryDetail?.data, "id");
            list = await supabase
              .from("products")
              .select("*")
              .in("category", ids)
              .range(getData?.offset, getData?.offset + limit);
          }

          break;

        case "service":
          categoryDetail = await supabase
            .from("directory_frontend_categories")
            .select("*")
            .eq("name", getData?.category);
          if (categoryDetail?.data && categoryDetail?.data?.length > 0) {
            let ids = _.map(categoryDetail?.data, "id");
            list = await supabase
              .from("directory_companies")
              .select("*")
              .in("category", ids)
              .range(getData?.offset, getData?.offset + limit);
          }

          break;

        case "articles":
          categoryDetail = await supabase
            .from("article_categories")
            .select("*")
            .eq("label", getData?.category);
          if (categoryDetail?.data && categoryDetail?.data?.length > 0) {
            let ids = _.map(categoryDetail?.data, "id");
            list = await supabase
              .from("articles")
              .select("*")
              .in("category_id", ids)
              .range(getData?.offset, getData?.offset + limit);
          }

          break;

        default:
          break;
      }
      if (list?.data) {
        if (list?.data?.length > 0) {
          res
            .status(200)
            .send({ status: true, message: "List Found", data: list?.data });
        } else {
          res
            .status(200)
            .send({ status: true, message: "List Found", data: [] });
        }
      } else {
        res.status(400).send({
          status: false,
          message: `Error Occured - ${list?.error?.message}`,
          data: [],
        });
      }
    } else {
      res.status(400).send({
        status: false,
        message: `Type must be required`,
        data: [],
      });
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
