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

      let featuredItemList = await supabase
        .from("featured")
        .select("*")
        .eq("is_featured", 1);
      let featuredCourses = _.filter(featuredItemList?.data, (item) => {
        return item?.type == "courses";
      });
      let featuredProducts = _.filter(featuredItemList?.data, (item) => {
        return item?.type == "products";
      });
      let featuredService = _.filter(featuredItemList?.data, (item) => {
        return item?.type == "services";
      });

      const relatedArticles = await supabase
        .from("articles")
        .select(
          "* ,  article_categories!inner ( label , image , type ) , notable_figures!inner(*)"
        )
        .order("category", { ascending: false })
        .limit(10);
      if (relatedArticles.data) {
        ids = _.map(relatedArticles.data, "id");

        let getRatings = await supabase
          .from("reviews")
          .select("*")
          .in("related_id", ids);

        relatedArticles.data.map((e) => {
          if (getRatings.data && getRatings.data.length > 0) {
            let avg = 0;
            let count = 0;
            let findRating = _.filter(getRatings.data, (item) => {
              if (item.related_id == e.id) {
                avg += item.stars;
                count += 1;
              }
            });

            e.rating = avg / count;
          } else {
            e.rating = 0;
          }
        });
        obj.relatedArticles = relatedArticles.data;
      }

      let relatedCourse;
      if (featuredCourses && featuredCourses?.length > 0) {
        let filterIds = _.map(featuredCourses, "item_id");
        relatedCourse = await supabase
          .from("courses")
          .select("* , organizations (name)")
          .in("id", filterIds)
          .order("created_at", { ascending: false })
          .limit(10);
        // relatedCourse = await supabase
        //   .from("courses")
        //   .select("* , organizations (name)")
        //   .in("id", filterIds)
        //   .order("title", { ascending: true })
        //   .limit(10);
      } else {
        relatedCourse = await supabase
          .from("courses")
          .select("* , organizations (name)")
          .order("created_at", { ascending: false })
          .limit(10);
      }

      if (relatedCourse.data) {
        ids = _.map(relatedCourse.data, "id");
        let getRatings = await supabase
          .from("reviews")
          .select("*")
          .in("related_id", ids);
        let dealsItem = await supabase
          .from("deals")
          .select("*")
          .eq("is_expire", 0)
          .in("item_id", ids);
        relatedCourse.data.map((e) => {
          if (getRatings.data && getRatings.data.length > 0) {
            let avg = 0;
            let count = 0;
            let findRating = _.filter(getRatings.data, (item) => {
              if (item.related_id == e.id) {
                avg += item.stars;
                count += 1;
              }
            });
            e.rating = avg / count;
          } else {
            e.rating = 0;
          }

          if (dealsItem.data && dealsItem?.data?.length > 0) {
            let findDeal = _.filter(dealsItem.data, (i) => {
              return i.item_id == e.id;
            });
            if (findDeal && findDeal?.length > 0) {
              e.is_deal = true;
              e.dealDetail = findDeal[0];
            } else {
              e.is_deal = false;
            }
          }

          if (featuredCourses && featuredCourses?.length > 0) {
            let featuredItemD = _.filter(featuredCourses, (item) => {
              return item?.item_id == e?.id;
            });
            if (featuredItemD && featuredItemD?.length > 0) {
              e.featured_item = true;
              e.featuredDetail = featuredItemD[0];
            } else {
              e.featured_item = false;
            }
          }
        });

        obj.relatedCourses = relatedCourse.data;
      }

      let product;
      if (featuredProducts && featuredProducts?.length > 0) {
        let filterIds = _.map(featuredProducts, "item_id");

        product = await supabase
          .from("products")
          .select(
            "* ,  product_category!inner  (id, name , parent_category) , organizations!inner  (id, name)"
          )
          .in("id", filterIds)
          .order("created_at", { ascending: false })
          .limit(10);
      } else {
        product = await supabase
          .from("products")
          .select(
            "* ,  product_category!inner  (id, name , parent_category) , organizations!inner  (id, name)"
          )
          .order("created_at", { ascending: false })
          .limit(10);
      }

      if (product.data && product.data.length > 0) {
        ids = _.map(product.data, "id");
        let getRatings = await supabase
          .from("reviews")
          .select("*")
          .in("related_id", ids);
        let dealsItem = await supabase
          .from("deals")
          .select("*")
          .eq("is_expire", 0)
          .in("item_id", ids);
        product.data.map((e) => {
          if (getRatings.data && getRatings.data.length > 0) {
            let avg = 0;
            let count = 0;
            let findRating = _.filter(getRatings.data, (item) => {
              if (item.related_id == e.id) {
                avg += item.stars;
                count += 1;
              }
            });

            e.rating = avg / count;
          } else {
            e.rating = 0;
          }
          if (dealsItem.data && dealsItem?.data?.length > 0) {
            let findDeal = _.filter(dealsItem.data, (i) => {
              return i.item_id == e.id;
            });
            if (findDeal && findDeal?.length > 0) {
              e.is_deal = true;
              e.dealDetail = findDeal[0];
            } else {
              e.is_deal = false;
            }
          }
          if (featuredProducts && featuredProducts?.length > 0) {
            let featuredItemD = _.filter(featuredProducts, (item) => {
              return item?.item_id == e?.id;
            });
            if (featuredItemD && featuredItemD?.length > 0) {
              e.featured_item = true;
              e.featuredDetail = featuredItemD[0];
            } else {
              e.featured_item = false;
            }
          }
        });
        obj.relatedProducts = product.data;
      }

      let related_directory;
      if (featuredService && featuredService?.length > 0) {
        let filterIds = _.map(featuredService, "item_id");
        related_directory = await supabase
          .from("directory_companies")
          .select("* , company(*) , directory_frontend_categories!inner(*) ")
          .in("id", filterIds)
          .limit(10);
      } else {
        related_directory = await supabase
          .from("directory_companies")
          .select("* , company(*) , directory_frontend_categories!inner(*) ")
          .limit(10);
      }

      if (related_directory.data) {
        ids = _.map(related_directory.data, "id");

        let getRatings = await supabase
          .from("reviews")
          .select("*")
          .in("related_id", ids);

        related_directory.data.map((e) => {
          if (getRatings.data && getRatings.data.length > 0) {
            let avg = 0;
            let count = 0;
            let findRating = _.filter(getRatings.data, (item) => {
              if (item.related_id == e.id) {
                avg += item.stars;
                count += 1;
              }
            });

            e.rating = avg / count;
          } else {
            e.rating = 0;
          }

          if (featuredService && featuredService?.length > 0) {
            let featuredItemD = _.filter(featuredService, (item) => {
              return item?.item_id == e?.id;
            });
            if (featuredItemD && featuredItemD?.length > 0) {
              e.featured_item = true;
              e.featuredDetail = featuredItemD[0];
            } else {
              e.featured_item = false;
            }
          }
        });
        obj.relatedServices = related_directory.data;
      }

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
