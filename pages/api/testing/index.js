import { supabase, supabase_admin_secret } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  // let courses = await supabase
  //   .from("courses")
  //   .select("* , cities(name , country) ");
  // let reviews = await supabase.from("average_rating_course").select("*");
  // if (courses.data && courses.data.length > 0) {
  //   let arr = [];
  //   courses.data.map((e) => {
  //     let reviewFind = reviews.data.find((data) => data.related_id == e.id);
  //     if (reviewFind) {
  //       e.rating = reviewFind.av;
  //     } else {
  //       e.rating = 0;
  //     }
  //     e.objectID = e.id;
  //     e.city = e?.cities?.name;
  //   });
  // }
  // const d = await supabase_admin_secret.auth.api.resetPasswordForEmail(
  //   "abctest@yopmail.com",
  //   {
  //     redirectTo: "http://localhost:3000/reset-password",
  //   }
  // );
  // let articleData = await supabase
  //           .from("articles")
  //           .select(
  //             "* , notable_figures(*) , article_categories(*) , article_category_filters(*)  "
  //           )
  // .eq("id", articleInsertdata.id);
  const lettec = await supabase.from("areas_of_interest").select("*");

  res.send({
    data: lettec,
  });
}
