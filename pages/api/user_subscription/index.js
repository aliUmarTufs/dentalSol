import _ from "lodash";
import { supabase } from "../../../lib/supabaseClient";
import { prisma } from "../../../lib/prismaClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    try {
      await prisma.$transaction(async (tx) => {
        let responseObj = {
          services: null,
          categories: {
            course: [],
            product: null,
          },
          categoriesCount: 0,
          categoryPrice: 0,
        };
        let r = [];
        if (getData?.user_id) {
          let userServices = await prisma.users.findUnique({
            where: { id: getData?.user_id },
            include: {
              services_assigned: {
                include: {
                  services_list: true,
                },
              },
            },
          });
          if (userServices) {
            responseObj.services = userServices;
          }

          let getUserCategories =
            await prisma.vendor_subcategory_assigned.findMany({
              include: {
                vendor_categories_assinged: true,
              },
            });

          let groupByCat = _.groupBy(getUserCategories, (e) => {
            return e?.vendor_categories_assinged?.category_type;
          });

          for (const key in groupByCat) {
            switch (key) {
              case "course":
                if (groupByCat?.course && groupByCat?.course?.length > 0) {
                  let parent_cat_id = _.map(
                    groupByCat?.course,
                    "vendor_categories_assinged.parent_category_id"
                  );
                  parent_cat_id = _.uniq(parent_cat_id);
                  console.log({ parent_cat_id });

                  if (parent_cat_id && parent_cat_id?.length > 0) {
                    let getParentCat = await prisma.course_categories.findMany({
                      where: { id: { in: parent_cat_id } },
                    });

                    if (getParentCat) {
                      getParentCat;
                      let subCatArray = [];
                      for (let i = 0; i < getParentCat.length; i++) {
                        const element = getParentCat[i]?.id;
                        let sub_cat_id = _.filter(groupByCat?.course, (e) => {
                          return (
                            e?.vendor_categories_assinged?.parent_category_id ==
                            element
                          );
                        });
                        if (sub_cat_id && sub_cat_id?.length > 0) {
                          let map_subcategory = _.map(
                            sub_cat_id,
                            "sub_category_id"
                          );
                          if (map_subcategory && map_subcategory?.length > 0) {
                            let getSubCategoryItem =
                              await prisma.course_category_filters.findMany({
                                where: { id: { in: map_subcategory } },
                              });
                            if (getSubCategoryItem) {
                              responseObj.categoriesCount =
                                responseObj?.categoriesCount +
                                getSubCategoryItem?.length;
                              subCatArray.push({
                                category_name: getParentCat[i]?.id,
                                category_id: getParentCat[i]?.id,
                                selected_subcategory: getSubCategoryItem,
                              });
                            }
                          }
                        }
                      }
                      responseObj.categories.course = subCatArray;
                    }
                  }
                }
                break;

              case "product":
                if (groupByCat?.product && groupByCat?.product?.length > 0) {
                  let parent_cat_id = _.map(
                    groupByCat?.product,
                    "vendor_categories_assinged.parent_category_id"
                  );
                  parent_cat_id = _.uniq(parent_cat_id);

                  if (parent_cat_id && parent_cat_id?.length > 0) {
                    let getParentCat =
                      await prisma.product_parent_categories.findMany({
                        where: { id: { in: parent_cat_id } },
                      });

                    if (getParentCat) {
                      let subCatArray = [];
                      for (let i = 0; i < getParentCat.length; i++) {
                        const element = getParentCat[i]?.id;
                        let sub_cat_id = _.filter(groupByCat?.product, (e) => {
                          return (
                            e?.vendor_categories_assinged?.parent_category_id ==
                            element
                          );
                        });
                        if (sub_cat_id && sub_cat_id?.length > 0) {
                          let map_subcategory = _.map(
                            sub_cat_id,
                            "sub_category_id"
                          );
                          if (map_subcategory && map_subcategory?.length > 0) {
                            let getSubCategoryItem =
                              await prisma.product_category.findMany({
                                where: { id: { in: map_subcategory } },
                              });
                            if (getSubCategoryItem) {
                              responseObj.categoriesCount =
                                responseObj?.categoriesCount +
                                getSubCategoryItem?.length;
                              subCatArray.push({
                                category_name: getParentCat[i]?.id,
                                category_id: getParentCat[i]?.id,
                                selected_subcategory: getSubCategoryItem,
                              });
                            }
                          }
                        }
                      }
                      responseObj.categories.product = subCatArray;
                    }
                  }
                }
                break;

              case "services":
                if (groupByCat?.services && groupByCat?.services?.length > 0) {
                  let parent_cat_id = _.map(
                    groupByCat?.services,
                    "vendor_categories_assinged.parent_category_id"
                  );
                  parent_cat_id = _.uniq(parent_cat_id);

                  if (parent_cat_id && parent_cat_id?.length > 0) {
                    let getParentCat =
                      await prisma.directory_frontend_categories.findMany({
                        where: { id: { in: parent_cat_id } },
                      });

                    if (getParentCat) {
                      let subCatArray = [];
                      for (let i = 0; i < getParentCat.length; i++) {
                        const element = getParentCat[i]?.id;
                        let sub_cat_id = _.filter(groupByCat?.services, (e) => {
                          return (
                            e?.vendor_categories_assinged?.parent_category_id ==
                            element
                          );
                        });
                        if (sub_cat_id && sub_cat_id?.length > 0) {
                          let map_subcategory = _.map(
                            sub_cat_id,
                            "sub_category_id"
                          );
                          if (map_subcategory && map_subcategory?.length > 0) {
                            let getSubCategoryItem =
                              await prisma.directory_subcategory.findMany({
                                where: { id: { in: map_subcategory } },
                              });
                            if (getSubCategoryItem) {
                              responseObj.categoriesCount =
                                responseObj?.categoriesCount +
                                getSubCategoryItem?.length;
                              subCatArray.push({
                                category_name: getParentCat[i]?.id,
                                category_id: getParentCat[i]?.id,
                                selected_subcategory: getSubCategoryItem,
                              });
                            }
                          }
                        }
                      }
                      responseObj.categories.services = subCatArray;
                    }
                  }
                }
                break;

              default:
                break;
            }
          }

          BigInt.prototype.toJSON = function () {
            return this.toString();
          };

          res.status(200).send({
            status: true,
            message: "Data Found",
            data: responseObj,
          });
        } else {
          res
            .status(400)
            .send({ status: false, message: "User is required", data: {} });
        }
      });
    } catch (error) {
      res.status(400).send({ message: error?.message });
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
