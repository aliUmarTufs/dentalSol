import { supabase } from "../../../lib/supabaseClient";
import _ from "lodash";
import { algoliaClientAdmin } from "../../../lib/algoliaClient";
import moment from "moment";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      let ids;
      let featuredItem = false;
      let obj = {
        relatedArticles: [],
        relatedCourses: [],
        relatedProducts: [],
        relatedServices: [],
      };
      let featuredItemList = await supabase
        .from("featured_slots_avail")
        .select("* , slot_id(*)")
        .eq("is_expire", 0);
      let featuredExpired = [];
      let featuredSlotId = [];
      featuredItemList?.data?.map((e) => {
        var now = moment();
        const diff = now.diff(moment(e?.created_at), "hours");
        if (diff > e?.slot_id?.slot_hours) {
          featuredExpired.push(e?.id);
          featuredSlotId.push(e?.slot_id?.id);
        }
      });

      let updateExpiredItem = await supabase
        .from("featured_slots_avail")
        .update({ is_expire: 1 })
        .in("id", featuredExpired);
      if (updateExpiredItem?.data && updateExpiredItem?.data?.length > 0) {
        let updateSlotData = await supabase
          .from("featured_slots")
          .update({
            slot_status: "is_empty",
          })
          .in("id", featuredSlotId);
      }

      featuredItemList = await supabase
        .from("featured_slots_avail")
        .select("* , slot_id(*)")
        .eq("is_expire", 0);

      let featuredCourses = _.filter(featuredItemList?.data, (item) => {
        return item?.item_type == "courses";
      });
      let featuredProducts = _.filter(featuredItemList?.data, (item) => {
        return item?.item_type == "products";
      });
      let featuredService = _.filter(featuredItemList?.data, (item) => {
        return item?.item_type == "services";
      });
      let featuredArticles = _.filter(featuredItemList?.data, (item) => {
        return item?.item_type == "articles";
      });

      let relatedArticles;
      if (featuredArticles && featuredArticles?.length > 0) {
        let filterIds = _.map(featuredArticles, "item_id");
        relatedArticles = await supabase
          .from("articles")
          .select(
            "* ,  article_categories ( label , image , type ),organization_id(*) , user_id(*) "
          )
          .in("id", filterIds)
          .order("category", { ascending: false })
          .limit(10);
        featuredItem = true;
      } else {
        relatedArticles = await supabase
          .from("articles")
          .select(
            "* ,  article_categories ( label , image , type ) , organization_id(*) ,user_id(*)"
          )
          .order("category", { ascending: false })
          .limit(10);
        featuredItem = false;
      }

      // const relatedArticles = await supabase
      //   .from("articles")
      //   .select(
      //     "* ,  article_categories!inner ( label , image , type ) , notable_figures!inner(*)"
      //   )
      //   .order("category", { ascending: false })
      //   .limit(10);
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

          if (featuredArticles && featuredArticles?.length > 0) {
            let featuredItemD = _.filter(featuredArticles, (item) => {
              return item?.item_id == e?.id;
            });
            if (featuredItemD && featuredItemD?.length > 0) {
              e.featured_item = true;
              e.featuredDetail = featuredItemD[0];
              e.featuredSlot = featuredItemD[0]?.slot_id;
              e.featuredSlotPosition = featuredItemD[0]?.slot_id?.slot_position;
            } else {
              e.featured_item = false;
            }
          }
        });
        obj.relatedArticles = _.sortBy(relatedArticles.data, (e) => {
          return e?.featuredSlotPosition;
        });
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
        featuredItem = true;
      } else {
        relatedCourse = await supabase
          .from("courses")
          .select("* , organizations (name)")
          .order("created_at", { ascending: false })
          .limit(10);
        featuredItem = false;
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
              e.featuredSlot = featuredItemD[0]?.slot_id;
              e.featuredSlotPosition = featuredItemD[0]?.slot_id?.slot_position;
            } else {
              e.featured_item = false;
            }
          }
        });

        obj.relatedCourses = _.sortBy(relatedCourse?.data, (e) => {
          return e?.featuredSlotPosition;
        });
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
              e.featuredSlot = featuredItemD[0]?.slot_id;
              e.featuredSlotPosition = featuredItemD[0]?.slot_id?.slot_position;
            } else {
              e.featured_item = false;
            }
          }
        });

        obj.relatedProducts = _.sortBy(product?.data, (e) => {
          return e?.featuredSlotPosition;
        });
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

        let dealsItem = await supabase
          .from("deals")
          .select("*")
          .eq("is_expire", 0)
          .in("item_id", ids);

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

          if (featuredService && featuredService?.length > 0) {
            let featuredItemD = _.filter(featuredService, (item) => {
              return item?.item_id == e?.id;
            });
            if (featuredItemD && featuredItemD?.length > 0) {
              e.featured_item = true;
              e.featuredDetail = featuredItemD[0];
              e.featuredSlot = featuredItemD[0]?.slot_id;
              e.featuredSlotPosition = featuredItemD[0]?.slot_id?.slot_position;
            } else {
              e.featured_item = false;
            }
          }
        });
        obj.relatedServices = _.sortBy(related_directory.data, (e) => {
          return e?.featuredSlotPosition;
        });
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
