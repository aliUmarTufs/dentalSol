import { supabase } from "../../../lib/supabaseClient";
import _ from "lodash";
import { algoliaClientAdmin } from "../../../lib/algoliaClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      let ids;
      let obj = {
        relatedArticles: [],
        relatedCourses: [],
        relatedProducts: [],
        relatedServices: [],
      };

      
      let getSectionDetails = await supabase
        .from("hero_section")
        .select("*")
        .eq("type", "home");
      if (getSectionDetails?.data && getSectionDetails?.data?.length > 0) {
        obj.section = getSectionDetails?.data[0];
      }

      let getIntroVideo = await supabase
        .from("introductory_videos")
        .select("*");
      if (getIntroVideo?.data && getIntroVideo?.data?.length > 0) {
        obj.intro = getIntroVideo?.data[0];
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
