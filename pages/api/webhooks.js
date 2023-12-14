// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { algoliaClient, algoliaClientAdmin } from "../../lib/algoliaClient";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  const courses = await supabase
    .from("courses")
    .select("* , cities (name, country )")
    .eq("price_mode", "Onsite");
  // let updateAlgoliaObjects = algoliaClientAdmin.initIndex("courses");
  // let courseData = courses.data;
  // if (courseData) {
  //   courseData.map(async (e) => {
  //     e.objectID = e.id;
  //     if (e.cities) {
  //       e.country = e.cities.country;
  //       e.city = e.cities.name;
  //     }
  //     if(e.price_mode == "Onsite")
  //     {
  //       e.price_mode = "Live"
  //     }
  //   });
  // }

  // const courses = await supabase
  //   .from("courses")
  //   .update({ course_mode: "Paid" })
  //   .neq("Price" , "0" );
  res.send({
    data: courseData,
  });
}
