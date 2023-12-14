import _ from "lodash";
import { supabase } from "../../../lib/supabaseClient";
import { algoliaClientAdmin } from "../../../lib/algoliaClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    let data = req.query;
    let ids;
    let obj = {
      details: null,
      relatedArticles: {
        data: [],
        is_related: false,
      },
      relatedCourses: { data: [], is_related: false },
      relatedProducts: { data: [], is_related: false },
      relatedServices: { data: [], is_related: false },
    };
    if (data?.id) {
      let directory = await supabase
        .from("directory_companies")
        .select("* , company(*) , directory_frontend_categories(*) ")
        .eq("id", data?.id);
      if (directory?.data) {
        if (directory?.data?.length > 0) {
          obj.details = directory?.data[0];

          let checkDeal = await supabase
            .from("deals")
            .select("*")
            .eq("item_id", data?.id)
            .eq("is_expire", 0);
          if (checkDeal?.data && checkDeal?.data?.length > 0) {
            let isDealAvail = false;
            let userAvailDeal = {};
            let checkIfDealAvail = await supabase
              .from("avail_deal_users")
              .select("*")
              .eq("user_id", req?.query?.user_id)
              .eq("deal_id", checkDeal?.data[0]?.id);
            if (checkIfDealAvail?.data && checkIfDealAvail?.data?.length > 0) {
              isDealAvail = true;
              userAvailDeal = checkIfDealAvail?.data[0];
            }

            let algoliaAdmin = algoliaClientAdmin.initIndex("deals");
            const checkFavFromAlgolia = await algoliaAdmin.getObject(
              checkDeal?.data[0]?.id
            );
            let is_fav;
            if (checkFavFromAlgolia && checkFavFromAlgolia?.favUsers) {
              if (req?.query?.user_id) {
                if (
                  checkFavFromAlgolia?.favUsers?.includes(req?.query?.user_id)
                ) {
                  is_fav = true;
                } else {
                  is_fav = false;
                }
              } else {
                is_fav = false;
              }
            } else {
              is_fav = false;
            }
            obj.details = {
              ...directory?.data[0],
              is_deal: true,
              dealDetail: checkDeal?.data[0],
              is_fav,
              isDealAvail,
              userAvailDeal,
            };
          } else {
            obj.details = {
              ...directory?.data[0],
              is_deal: false,
              dealDetail: {},
            };
          }
        }

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

        let related_directory;
        // if (featuredService && featuredService?.length > 0) {
        //   let filterIds = _.map(featuredService, "item_id");
        //   related_directory = await supabase
        //     .from("directory_companies")
        //     .select("* , company(*) , directory_frontend_categories!inner(*) ")
        //     .in("id", filterIds)
        //     .not("id", "in", `(${data?.id})`)
        //     .limit(6);
        // } else {
        related_directory = await supabase
          .from("directory_companies")
          .select("* , company(*) , directory_frontend_categories!inner(*) ")
          .eq(
            "directory_frontend_categories.name",
            directory?.data[0]?.directory_frontend_categories?.name
          )
          .not("id", "in", `(${data?.id})`)
          .limit(6);
        // }

        if (related_directory?.data && related_directory?.data?.length < 1) {
          related_directory = await supabase
            .from("directory_companies")
            .select("* , company(*) , directory_frontend_categories!inner(*) ")
            .limit(6);
          obj.relatedServices.is_related = true;
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
          obj.relatedServices.data = related_directory.data;
        }

        let relatedArticles = await supabase
          .from("articles")
          .select(
            "* ,  article_categories!inner ( label , image , type ) , notable_figures!inner(*) , organization_id(*)"
          )
          .eq("article_categories.label", directory.data[0].category?.name)
          .limit(10);
        if (relatedArticles?.data && relatedArticles?.data?.length < 1) {
          relatedArticles = await supabase
            .from("articles")
            .select(
              "* ,  article_categories!inner ( label , image , type ) , notable_figures!inner(*)"
            )
            .limit(10);
          obj.relatedArticles.is_related = true;
        }

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
          obj.relatedArticles.data = relatedArticles.data;
        }

        let relatedCourse;
        // if (featuredCourses && featuredCourses?.length > 0) {
        //   let filterIds = _.map(featuredCourses, "item_id");
        //   relatedCourse = await supabase
        //     .from("courses")
        //     .select("* , organizations (name)")
        //     .in("id", filterIds)
        //     .order("created_at", { ascending: false })
        //     .limit(10);
        // } else {
        relatedCourse = await supabase
          .from("courses")
          .select("* , organizations (name)")
          .eq("category", directory?.data[0]?.category?.name)
          .order("created_at", { ascending: false })
          .limit(10);
        // }

        if (relatedCourse?.data && relatedCourse?.data?.length < 1) {
          relatedCourse = await supabase
            .from("courses")
            .select("* , organizations (name)")
            .order("created_at", { ascending: false })
            .limit(10);

          obj.relatedCourses.is_related = true;
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

          obj.relatedCourses.data = relatedCourse.data;
        }

        let product;
        // if (featuredProducts && featuredProducts?.length > 0) {
        //   let filterIds = _.map(featuredProducts, "item_id");

        //   product = await supabase
        //     .from("products")
        //     .select(
        //       "* ,  product_category!inner  (id, name , parent_category) , organizations!inner  (id, name)"
        //     )
        //     .in("id", filterIds)
        //     .order("created_at", { ascending: false })
        //     .limit(10);
        // } else {
        product = await supabase
          .from("products")
          .select(
            "* ,  product_category!inner  (id, name , parent_category) , organizations!inner  (id, name)"
          )
          .eq(
            "product_category.parent_category",
            directory?.data[0]?.category?.name
          )
          .order("created_at", { ascending: false })
          .limit(10);
        // }

        if (product?.data && product?.data?.length < 1) {
          product = await supabase
            .from("products")
            .select(
              "* ,  product_category!inner  (id, name , parent_category) , organizations!inner  (id, name)"
            )
            .order("created_at", { ascending: false })
            .limit(10);
          obj.relatedProducts.is_related = true;
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
          obj.relatedProducts.data = product.data;
        }

        const isSubmittedReview = await supabase
          .from("reviews")
          .select("*")
          .eq("related_id", req?.query?.id);
        obj.reviews = isSubmittedReview?.data;

        res.status(200).send({
          status: true,
          message: "Service found",
          data: obj,
        });
      } else {
        res.status(400).send({
          status: false,
          message: `Error Occured - ${directory?.error?.message}`,
        });
      }
    } else {
      res.status(400).send({
        status: false,
        message: "Error Occured - Services is required.",
      });
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only GET requests allowed" });
  }
}
