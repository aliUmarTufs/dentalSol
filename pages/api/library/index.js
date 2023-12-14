import { supabase } from "../../../lib/supabaseClient";
import _ from "lodash";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
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
      const details = await supabase
        .from("articles")
        .select(
          "* ,  article_categories ( label , image , type ), notable_figures(*) , users(*) ,organizations(*) ,  category_filter_id(*) "
        )
        .eq("id", req.query.id);
      if (details.data && details.data.length > 0) {
        // Check if item is a deal
        let checkDeal = await supabase
          .from("deals")
          .select("*")
          .eq("item_id", req?.query?.id);
        if (checkDeal?.data && checkDeal?.data?.length > 0) {
          obj.details = {
            ...details?.data[0],
            is_deal: true,
            dealDetail: checkDeal?.data[0],
          };
        } else {
          obj.details = {
            ...details?.data[0],
            is_deal: false,
            dealDetail: {},
          };
        }
      }
      // obj.details = details.data[0];
      let articles = await supabase
        .from("articles")
        .select(
          "* ,  article_categories!inner ( label , image , type ), notable_figures!inner(*)"
        )
        .eq(
          "article_categories.label",
          details.data[0].article_categories.label
        )
        .limit(10);

      if (articles?.data && articles?.data?.length < 1) {
        articles = await supabase
          .from("articles")
          .select(
            "* ,  article_categories!inner ( label , image , type ), notable_figures!inner(*) , organization_id(*)"
          )
          .limit(10);
        obj.relatedArticles.is_related = true;
      }

      if (articles.data && articles.data.length > 0) {
        ids = _.map(articles.data, "id");

        let getRatings = await supabase
          .from("reviews")
          .select("*")
          .in("related_id", ids);
        articles.data.map((e) => {
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
        obj.relatedArticles.data = articles.data;
      }

      let courses = await supabase
        .from("courses")
        .select("* , organizations (name)")
        .eq("category", details.data[0].article_categories.label)
        .not("id", "in", `(${req.query.id})`)
        .order("created_at", { ascending: false })
        .limit(10);
      if (courses?.data && courses?.data?.length < 1) {
        courses = await supabase
          .from("courses")
          .select("* , organizations (name)")
          .order("created_at", { ascending: false })
          .limit(10);
        obj.relatedCourses.is_related = true;
      }

      if (courses.data && courses.data.length > 0) {
        ids = _.map(courses.data, "id");
        let getRatings = await supabase
          .from("reviews")
          .select("*")
          .in("related_id", ids);
        courses.data.map((e) => {
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
        obj.relatedCourses.data = courses.data;
      }

      let related_directory = await supabase
        .from("directory_companies")
        .select("* , company(*) , directory_frontend_categories!inner(*) ")
        .eq(
          "directory_frontend_categories.name",
          details.data[0].article_categories.label
        )
        .limit(6);

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
        });
        obj.relatedServices.data = related_directory.data;
      }

      let product = await supabase
        .from("products")
        .select(
          "* ,  product_category!inner  (id, name , parent_category) , organizations!inner  (id, name)"
        )
        .eq(
          "product_category.parent_category",
          details.data[0].article_categories.label
        )
        .order("created_at", { ascending: false })
        .limit(10);
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
        });
        obj.relatedProducts.data = product.data;
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
