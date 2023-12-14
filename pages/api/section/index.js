import { supabase } from "../../../lib/supabaseClient";
import _ from "lodash";
import { algoliaClientAdmin } from "../../../lib/algoliaClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      let ids;
      const query = req.query;
      let obj = {
        section: null,
      };
      let getSectionDetails = await supabase
        .from("hero_section")
        .select("*")
        .eq("type", query?.type);
      if (getSectionDetails?.data && getSectionDetails?.data?.length > 0) {
        obj.section = getSectionDetails?.data[0];
      }

      res.status(200).send({
        status: true,
        message: "Data found",
        data: obj,
      });
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
