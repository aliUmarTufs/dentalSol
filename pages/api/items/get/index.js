import _ from "lodash";
import { supabase } from "../../../../lib/supabaseClient";
import { prisma } from "../../../../lib/prismaClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    if (getData?.entity_type && getData?.user_id) {
      try {
        let obj = {
          category: null,
          organizations: null,
          city: null,
          teachers: null,
          course_mode: null,
          categoryList: null,
        };
        let details;
        switch (getData?.entity_type) {
          case "courses":
            details = await prisma.users.findUnique({
              where: {
                id: getData?.user_id,
              },
              include: {
                vendor_categories_assinged: {
                  include: {
                    vendor_categories: true,
                  },
                },
              },
            });
            obj.categoryList = details?.vendor_categories_assinged;

            details = await supabase.from("course_categories").select("*");
            obj.category = details?.data;

            details = await supabase
              .from("course_category_filters")
              .select("*");
            obj.filters = details?.data;

            details = await supabase
              .from("organizations")
              .select("*")
              .eq("organization_user", getData?.user_id)
              .eq("organization_type", "course_provider");
            obj.organizations = details?.data;
            details = await supabase.from("cities").select("*");
            obj.city = details?.data;
            details = await supabase.from("users").select("*");
            // .neq("id", getData?.user_id);
            obj.teachers = details?.data;
            details = await supabase.from("courses_mode").select("*");
            obj.course_mode = details?.data;

            break;
          case "products":
            details = await prisma.users.findUnique({
              where: {
                id: getData?.user_id,
              },
              include: {
                vendor_categories_assinged: {
                  include: {
                    vendor_categories: true,
                  },
                },
              },
            });
            console.log({ details });
            obj.categoryList = details?.vendor_categories_assinged;

            details = await supabase.from("product_category").select("*");
            obj.category = details?.data;
            details = await supabase
              .from("organizations")
              .select("*")
              .eq("organization_user", getData?.user_id)
              .eq("organization_type", "product_provider");
            obj.organizations = details?.data;

            break;
          case "services":
            details = await prisma.users.findUnique({
              where: {
                id: getData?.user_id,
              },
              include: {
                vendor_categories_assinged: {
                  include: {
                    vendor_categories: true,
                  },
                },
              },
            });
            obj.categoryList = details?.vendor_categories_assinged;

            details = await supabase
              .from("directory_frontend_categories")
              .select("*");
            obj.category = details?.data;
            details = await supabase
              .from("organizations")
              .select("*")
              .eq("organization_user", getData?.user_id)
              .eq("organization_type", "service_provider");
            obj.organizations = details?.data;

            break;

          case "articles":
            details = await prisma.users.findUnique({
              where: {
                id: getData?.user_id,
              },
              include: {
                vendor_categories_assinged: {
                  include: {
                    vendor_categories: true,
                  },
                },
              },
            });
            obj.categoryList = details?.vendor_categories_assinged;

            details = await supabase.from("article_categories").select("*");
            obj.category = details?.data;

            details = await supabase
              .from("article_category_filters")
              .select("*");
            obj.filters = details?.data;

            details = await supabase
              .from("organizations")
              .select("*")
              .eq("organization_user", getData?.user_id);
            obj.organizations = details?.data;

            break;

          default:
            break;
        }
        if (obj) {
          res.status(200).send({
            status: true,
            message: "Data Found",
            data: obj,
          });
        } else {
          res.status(400).send({
            status: false,
            message: "Error Occured",
          });
        }
      } catch (error) {
        res.status(400).send({
          status: false,
          message: error?.stack,
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
