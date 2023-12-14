import { algoliaClient, algoliaClientAdmin } from "../../lib/algoliaClient";
import _ from "lodash";
import { supabase } from "../../lib/supabaseClient";
const { createClient } = require("@supabase/supabase-js");
const algoliasearch = require("algoliasearch");
// const supabase = createClient(
//   "https://thqoivzegkzbttgdugai.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocW9pdnplZ2t6YnR0Z2R1Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjcyOTgyNTgsImV4cCI6MTk4Mjg3NDI1OH0.xB-GJIPo_xKNVflI2dFrf2ja-Nh_2_QHX1qKShh1Raw"
// );
const client = algoliasearch("NJ5RODKRID", "55517d6972098beac255eedf991d2a45");

export default async function handler(req, res) {
  const bodyData = req.body;
  let arr = [];
  let indices;
  indices = await client.listIndices();
  let indicesItem = indices.items;

  let resObj = {
    obj: null,
  };
  let index = algoliaClientAdmin.initIndex(bodyData.table);
  switch (bodyData.table) {
    case "directory_companies":
      let DirectoryIndex = algoliaClientAdmin.initIndex("directory_companies");
      let dealsServiceAlgolia = algoliaClientAdmin.initIndex("deals");
      let updateServiceDeals;
      switch (bodyData.type) {
        case "INSERT":
          let direcotry = await supabase
            .from("directory_companies")
            .select("* , company(*) , directory_frontend_categories(*) ")
            .eq("id", bodyData.record.id);
          bodyData.record.objectID = bodyData.record.id;
          if (direcotry.data && direcotry?.data?.length > 0) {
            bodyData.record.company_name = direcotry?.data[0]?.company_name;
            // bodyData.record.company_name = direcotry?.data[0]?.company?.name;
            bodyData.record.company_id = direcotry?.data[0]?.company?.id;

            bodyData.record.category_id =
              direcotry?.data[0]?.directory_frontend_categories?.id;
            bodyData.record.category_name =
              direcotry?.data[0]?.directory_frontend_categories?.name;

            bodyData.record.company = direcotry?.data[0]?.company;
            delete bodyData.record.category;
            // delete bodyData.record.company;
          }

          let saveObject = await DirectoryIndex.saveObject(bodyData.record, {
            autoGenerateObjectIDIfNotExist: true,
          });
          if (saveObject) {
            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "Services",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - SERVICE");
            }
            console.log("DIRECTORY INSERT", saveObject);
          }
          // .then((result) => {
          //   console.log("DIRECTORY INSERT", result);
          // });
          break;

        case "UPDATE":
          let direcotryUpdate = await supabase
            .from("directory_companies")
            .select("* , company(*) , directory_frontend_categories(*) ")
            .eq("id", bodyData.record.id);

          bodyData.record.objectID = bodyData.record.id;
          if (direcotryUpdate.data && direcotryUpdate?.data?.length > 0) {
            bodyData.record.company_name =
              direcotryUpdate?.data[0]?.company_name;
            bodyData.record.company_id = direcotryUpdate?.data[0]?.company?.id;

            bodyData.record.category_id =
              direcotryUpdate?.data[0]?.directory_frontend_categories?.id;
            bodyData.record.category_name =
              direcotryUpdate?.data[0]?.directory_frontend_categories?.name;

            bodyData.record.company = direcotryUpdate?.data[0]?.company;

            delete bodyData.record.category;
            // delete bodyData.record.company;
          }
          const updateDiretoryIndex = await DirectoryIndex.partialUpdateObject(
            bodyData.record
          );
          if (updateDiretoryIndex) {
            console.log("DIRECTORY UPDATE  ", updateDiretoryIndex);
            let checkIfServiceDeal = await supabase
              .from("deals")
              .select("*")
              .eq("item_id", bodyData.record.id)
              .eq("is_expire", 0);
            if (
              checkIfServiceDeal?.data &&
              checkIfServiceDeal?.data?.length > 0
            ) {
              updateServiceDeals =
                await dealsServiceAlgolia.partialUpdateObject({
                  objectID: checkIfServiceDeal?.data[0]?.id,
                  itemDetail: bodyData.record,
                });
              if (updateServiceDeals) {
                console.log("SERVICE DEALS UPDATED", updateServiceDeals);
              }
            }

            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "Services",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - SERVICE");
            }
          }

          break;

        case "DELETE":
          DirectoryIndex.deleteObject(bodyData.old_record.id).then(
            async (updateDiretoryIndex) => {
              console.log("DIRECTORY DELETE ", updateDiretoryIndex);
              let checkIfServiceDeal = await supabase
                .from("deals")
                .select("*")
                .eq("item_id", bodyData?.old_record?.id)
                .eq("is_expire", 0);
              if (
                checkIfServiceDeal?.data &&
                checkIfServiceDeal?.data?.length > 0
              ) {
                let checkIfServiceDealDelete = await supabase
                  .from("deals")
                  .delete()
                  .eq("item_id", bodyData?.old_record?.id);
                if (checkIfServiceDealDelete?.data) {
                  console.log(
                    "SERVICE DEALS LIST DELETED",
                    checkIfServiceDealDelete?.data
                  );
                } else {
                  console.log(
                    "SERVICE DEALS LIST DELETED - ERROR",
                    checkIfServiceDealDelete?.error?.message
                  );
                }

                updateServiceDeals = await dealsServiceAlgolia.deleteObject(
                  checkIfServiceDeal?.data[0]?.id
                );
                if (updateServiceDeals) {
                  console.log("SERVICE DEALS DELETED", updateServiceDeals);
                }
              }

              let successObject = await supabase.from("algolia_data").insert({
                meta_key: bodyData?.type,
                meta_value: JSON.stringify(bodyData?.old_record),
                item_id: bodyData?.old_record?.id,
                type: "Services",
              });
              if (successObject?.data) {
                console.log("SUCCESS CREATED - SERVICE");
              }
            }
          );
          break;

        default:
          break;
      }

      break;

    case "products":
      let ProductIndex = algoliaClientAdmin.initIndex("products");
      let dealsProductAlgolia = algoliaClientAdmin.initIndex("deals");
      let updateProductDeals;
      switch (bodyData.type) {
        case "INSERT":
          let products = await supabase
            .from("products")
            .select("* , product_category(*) , organizations(*)")
            .eq("id", bodyData.record.id);
          bodyData.record.objectID = bodyData.record.id;
          if (products.data) {
            bodyData.record.category = products?.data[0]?.product_category;
            bodyData.record.organization = products?.data[0]?.organizations;
          }

          let saveObject = await ProductIndex.saveObject(bodyData.record, {
            autoGenerateObjectIDIfNotExist: true,
          });
          // .then((updateDiretoryIndex) => {
          //   console.log("PRODUCTS INSERT", updateDiretoryIndex);
          // });
          if (saveObject) {
            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.old_record),
              item_id: bodyData?.record?.id,
              type: "Products",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - PRODUCTS");
            }
            console.log("PRODUCTS INSERT", updateDiretoryIndex);
          }

          console.log({ saveObject });
          break;

        case "UPDATE":
          let productsUpdate = await supabase
            .from("products")
            .select("* , product_category(*) , organizations(*)")
            .eq("id", bodyData.record.id);
          bodyData.record.objectID = bodyData.record.id;
          if (productsUpdate.data) {
            bodyData.record.category =
              productsUpdate?.data[0]?.product_category;
            bodyData.record.organization =
              productsUpdate?.data[0]?.organizations;
          }
          const updateProductIndex = await ProductIndex.partialUpdateObject(
            bodyData.record
          );
          if (updateProductIndex) {
            console.log("Product Updated", updateProductIndex);
            let checkIfProductDeal = await supabase
              .from("deals")
              .select("*")
              .eq("item_id", bodyData?.record?.id)
              .eq("is_expire", 0);
            if (
              checkIfProductDeal?.data &&
              checkIfProductDeal?.data?.length > 0
            ) {
              updateProductDeals =
                await dealsProductAlgolia.partialUpdateObject({
                  objectID: checkIfProductDeal?.data[0]?.id,
                  itemDetail: bodyData.record,
                });
              if (updateProductDeals) {
                console.log("PRODUCT DEALS UPDATED", updateProductDeals);
              }
            }

            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "Products",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - PRODUCTS");
            }
          }

          break;

        case "DELETE":
          ProductIndex.deleteObject(bodyData.old_record.id).then(
            async (result) => {
              let successObject = await supabase.from("algolia_data").insert({
                meta_key: bodyData?.type,
                meta_value: JSON.stringify(bodyData?.old_record),
                item_id: bodyData?.old_record?.id,
                type: "Products",
              });
              if (successObject?.data) {
                console.log("SUCCESS CREATED - PRODUCTS");
              }

              let checkIfProductDeal = await supabase
                .from("deals")
                .select("*")
                .eq("item_id", bodyData?.old_record?.id)
                .eq("is_expire", 0);
              if (
                checkIfProductDeal?.data &&
                checkIfProductDeal?.data?.length > 0
              ) {
                let checkIfProductDealDelete = await supabase
                  .from("deals")
                  .delete()
                  .eq("item_id", bodyData?.old_record?.id);
                if (checkIfProductDealDelete?.data) {
                  console.log(
                    "PRODUCT DEALS LIST DELETED",
                    checkIfProductDealDelete?.data
                  );
                } else {
                  console.log(
                    "PRODUCT DEALS LIST DELETED - ERROR",
                    checkIfProductDealDelete?.error?.message
                  );
                }

                updateProductDeals = await dealsProductAlgolia.deleteObject(
                  checkIfProductDeal?.data[0].id
                );
                if (updateProductDeals) {
                  console.log("PRODUCT DEALS DELETED", updateProductDeals);
                }
              }
            }
          );
          break;

        default:
          break;
      }

      break;

    case "courses":
      console.log("Courses000-Print" , bodyData);
      let courseIndex = algoliaClientAdmin.initIndex("ce_courses");
      let dealsAlgolia = algoliaClientAdmin.initIndex("deals");
      let updateCourseDeals;
      switch (bodyData.type) {
        case "INSERT":
          // const rating = await revi;
          bodyData.record.objectID = bodyData.record.id;
          let getCourse = await supabase
            .from("courses")
            .select("* ,  organization(*)")
            .eq("id", bodyData.record.id);

          if (getCourse?.data && getCourse?.data?.length > 0) {
            getCourse.data[0].objectID = bodyData.record.id;
          }
          let saveCourseData = await courseIndex.saveObject(
            getCourse?.data[0],
            {
              autoGenerateObjectIDIfNotExist: true,
            }
          );
          // .then((result) => {
          //   console.log("COURSES INSERT", result);
          // });
          if (saveCourseData) {
            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "Course",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - COURSE");
            }
          }
          break;

        case "UPDATE":
          bodyData.record.objectID = bodyData.record.id;
          let getCourseUpdate = await supabase
            .from("courses")
            .select("* ,  organization(*)")
            .eq("id", bodyData.record.id);

          if (getCourseUpdate?.data && getCourseUpdate?.data?.length > 0) {
            getCourseUpdate.data[0].objectID = bodyData.record.id;
          }
          const courseUpdateIndex = await courseIndex.partialUpdateObject(
            getCourseUpdate.data[0]
          );
          if (courseUpdateIndex) {
            console.log("COURESE UPDATED");

            let checkIfCourseDeal = await supabase
              .from("deals")
              .select("*")
              .eq("item_id", bodyData.record.id)
              .eq("is_expire", 0);
            if (
              checkIfCourseDeal?.data &&
              checkIfCourseDeal?.data?.length > 0
            ) {
              updateCourseDeals = await dealsAlgolia.partialUpdateObject({
                objectID: checkIfCourseDeal?.data[0].id,
                itemDetail: bodyData.record,
              });
              if (updateCourseDeals) {
                console.log("COURSE DEALS DELETED", updateCourseDeals);
              }
            }

            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "Course",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - COURSE");
            }
          }

          break;

        case "DELETE":
          courseIndex
            .deleteObject(bodyData.old_record.id)
            .then(async (result) => {
              console.log("COURESE DELETED");
              let checkIfCourseDeal = await supabase
                .from("deals")
                .select("*")
                .eq("item_id", bodyData.old_record.id)
                .eq("is_expire", 0);
              if (
                checkIfCourseDeal?.data &&
                checkIfCourseDeal?.data?.length > 0
              ) {
                let checkIfCourseDealDelete = await supabase
                  .from("deals")
                  .delete()
                  .eq("item_id", bodyData?.old_record?.id);
                if (checkIfCourseDealDelete?.data) {
                  console.log(
                    "COURSE DEALS LIST DELETED",
                    checkIfCourseDealDelete?.data
                  );
                } else {
                  console.log(
                    "COURSE DEALS LIST DELETED - ERROR",
                    checkIfCourseDealDelete?.error?.message
                  );
                }

                updateCourseDeals = await dealsAlgolia.deleteObject(
                  checkIfCourseDeal?.data[0].id
                );
                if (updateCourseDeals) {
                  console.log("COURSE DEALS DELETE", updateCourseDeals);
                }
              }

              let deleteFeatured = await supabase
                .from("featured")
                .select("*")
                .eq("item_id", bodyData?.old_record?.id);
              if (deleteFeatured?.data && deleteFeatured?.data?.length > 0) {
                let deleteFeaturedCourse = await supabase
                  .from("featured")
                  .delete()
                  .eq("item_id", bodyData?.old_record?.id);
                if (deleteFeaturedCourse?.data) {
                  console.log("FEATURED DELETED", deleteFeaturedCourse?.data);
                } else {
                  console.log(
                    "FEATURED DELETED - Error",
                    deleteFeaturedCourse?.error
                  );
                }
              }

              let successObject = await supabase.from("algolia_data").insert({
                meta_key: bodyData?.type,
                meta_value: JSON.stringify(bodyData?.old_record),
                item_id: bodyData?.old_record?.id,
                type: "Course",
              });
              if (successObject?.data) {
                console.log("SUCCESS CREATED - COURSE");
              }
            });
          break;

        default:
          break;
      }

      break;

    case "reviews":
      switch (bodyData.type) {
        case "INSERT":
          let data = bodyData.record;
          if (data.type == "courses") {
            let index = algoliaClient.initIndex("ce_courses");
            let getCourseDetail = await index.getObject(data.related_id);

            if (getCourseDetail) {
              let adminAlgolia = algoliaClientAdmin.initIndex("ce_courses");
              let ratingReviews = await supabase
                .from("reviews")
                .select("*")
                .eq("related_id", data.related_id);
              let avgRating = 0;
              if (ratingReviews.data && ratingReviews.data.length > 0) {
                let stars = _.map(ratingReviews.data, "stars");

                let avg = 0;
                let count = 0;
                stars.map((item) => {
                  avg += item;
                  count += 1;
                });
                avgRating = avg / count;
              }

              let partialUpdate = await adminAlgolia.partialUpdateObject({
                objectID: data.related_id,
                rating: avgRating,
              });

              if (partialUpdate) {
                let checkIfCourseIsDeal = await supabase
                  .from("deals")
                  .select("*")
                  .eq("item_id", data.related_id)
                  .eq("is_expire", 0);
                console.log(checkIfCourseIsDeal);
                if (
                  checkIfCourseIsDeal.data &&
                  checkIfCourseIsDeal?.data?.length > 0
                ) {
                  let dealIndex = algoliaClientAdmin.initIndex("deals");
                  let updateDealRating = await dealIndex.partialUpdateObject({
                    rating: avgRating,
                    objectID: checkIfCourseIsDeal?.data[0]?.id,
                  });
                  console.log({ updateDealRating }, " RATING INSERT IN DEAL");
                }
              }
              console.log({ partialUpdate }, " RATING INSERT IN DEAL");
            }
          }
          if (data.type == "products") {
            let index = algoliaClient.initIndex("products");
            let getProductDetail = await index.getObject(data.related_id);

            if (getProductDetail) {
              let adminAlgolia = algoliaClientAdmin.initIndex("products");
              let ratingReviews = await supabase
                .from("reviews")
                .select("*")
                .eq("related_id", data.related_id);
              let avgRating = 0;
              if (ratingReviews.data && ratingReviews.data.length > 0) {
                let stars = _.map(ratingReviews.data, "stars");

                let avg = 0;
                let count = 0;
                stars.map((item) => {
                  avg += item;
                  count += 1;
                });
                avgRating = avg / count;
              }

              let partialUpdate = await adminAlgolia.partialUpdateObject({
                rating: avgRating,
                objectID: data.related_id,
              });
              if (partialUpdate) {
                let checkIfCourseIsDeal = await supabase
                  .from("deals")
                  .select("*")
                  .eq("item_id", data.related_id);
                if (
                  checkIfCourseIsDeal.data &&
                  checkIfCourseIsDeal?.data?.length > 0
                ) {
                  let dealIndex = algoliaClientAdmin.initIndex("deals");
                  let updateDealRating = await dealIndex.partialUpdateObject({
                    rating: avgRating,
                    objectID: checkIfCourseIsDeal?.data[0]?.id,
                  });
                  console.log({ updateDealRating }, " RATING PRODUCT IN DEAL");
                }
              }
              console.log({ partialUpdate }, " RATING PRODUCT IN DEAL");
            }
          }
          if (data.type == "articles") {
            let index = algoliaClient.initIndex("articles");
            let getArticlesDetail = await index.getObject(data.related_id);

            if (getArticlesDetail) {
              let adminAlgolia = algoliaClientAdmin.initIndex("articles");

              let ratingUpdate;
              if (
                getArticlesDetail.rating == 0 ||
                _.isUndefined(getArticlesDetail.rating)
              ) {
                ratingUpdate = data.stars;
              } else {
                ratingUpdate = getArticlesDetail.rating + data.stars;
                ratingUpdate = ratingUpdate / 2;
              }

              let partialUpdate = await adminAlgolia.partialUpdateObject({
                rating: ratingUpdate,
                objectID: data.related_id,
              });
            }
          }
          if (data.type == "services") {
            let index = algoliaClient.initIndex("directory_companies");
            console.log("SERVICES HERE");
            let getServicesDetail = await index.getObject(data.related_id);

            if (getServicesDetail) {
              let adminAlgolia = algoliaClientAdmin.initIndex(
                "directory_companies"
              );
              let ratingReviews = await supabase
                .from("reviews")
                .select("*")
                .eq("related_id", data.related_id);
              let avgRating = 0;
              if (ratingReviews.data && ratingReviews.data.length > 0) {
                let stars = _.map(ratingReviews.data, "stars");

                let avg = 0;
                let count = 0;
                stars.map((item) => {
                  avg += item;
                  count += 1;
                });
                avgRating = avg / count;
              }

              let partialUpdate = await adminAlgolia.partialUpdateObject({
                objectID: data.related_id,
                rating: avgRating,
              });

              if (partialUpdate) {
                let checkIfServicesDealExist = await supabase
                  .from("deals")
                  .select("*")
                  .eq("item_id", data.related_id)
                  .eq("is_expire", 0);
                console.log(checkIfServicesDealExist);
                if (
                  checkIfServicesDealExist.data &&
                  checkIfServicesDealExist?.data?.length > 0
                ) {
                  let dealIndex = algoliaClientAdmin.initIndex("deals");
                  let updateDealRating = await dealIndex.partialUpdateObject({
                    rating: avgRating,
                    objectID: checkIfServicesDealExist?.data[0]?.id,
                  });
                  console.log(
                    { updateDealRating },
                    " RATING INSERT IN DEAL - Services"
                  );
                }
              }
              console.log(
                { partialUpdate },
                " RATING INSERT IN DEAL - Services"
              );
            } else {
              console.log("NO OBJECT FOUND - SERVICES");
            }
          }

          let successObject = await supabase.from("algolia_data").insert({
            meta_key: bodyData?.type,
            meta_value: JSON.stringify(bodyData?.record),
            item_id: bodyData?.record?.id,
            type: "Reviews",
          });
          if (successObject?.data) {
            console.log("SUCCESS CREATED - REVIEWS");
          }
          break;
        case "UPDATE":
          let updatedata = bodyData.record;
          if (updatedata.type == "courses") {
            let index = algoliaClient.initIndex("ce_courses");
            let getCourseDetail = await index.getObject(updatedata.related_id);

            if (getCourseDetail) {
              let adminAlgolia = algoliaClientAdmin.initIndex("ce_courses");
              let ratingReviews = await supabase
                .from("reviews")
                .select("*")
                .eq("related_id", updatedata.related_id);
              let avgRating = 0;
              if (ratingReviews.data && ratingReviews.data.length > 0) {
                let stars = _.map(ratingReviews.data, "stars");

                let avg = 0;
                let count = 0;
                stars.map((item) => {
                  avg += item;
                  count += 1;
                });
                avgRating = avg / count;
              }

              let partialUpdate = await adminAlgolia.partialUpdateObject({
                rating: avgRating,
                objectID: updatedata.related_id,
              });
              if (partialUpdate) {
                let checkIfCourseIsDeal = await supabase
                  .from("deals")
                  .select("*")
                  .eq("item_id", updatedata.related_id);
                if (
                  checkIfCourseIsDeal.data &&
                  checkIfCourseIsDeal?.data?.length > 0
                ) {
                  let dealIndex = algoliaClientAdmin.initIndex("deals");
                  let updateDealRating = await dealIndex.partialUpdateObject({
                    rating: avgRating,
                    objectID: checkIfCourseIsDeal?.data[0]?.id,
                  });
                  console.log(
                    { updateDealRating },
                    " RATING COURSE UPDATE IN DEAL"
                  );
                }
              }
              console.log({ partialUpdate }, " RATING COURSE UPDATE IN DEAL");
            }
          }
          if (updatedata.type == "products") {
            let index = algoliaClient.initIndex("products");
            let getCourseDetail = await index.getObject(updatedata.related_id);

            if (getCourseDetail) {
              let adminAlgolia = algoliaClientAdmin.initIndex("products");
              let ratingReviews = await supabase
                .from("reviews")
                .select("*")
                .eq("related_id", updatedata.related_id);
              let avgRating = 0;
              if (ratingReviews.data && ratingReviews.data.length > 0) {
                let stars = _.map(ratingReviews.data, "stars");
                let avg = 0;
                let count = 0;
                stars.map((item) => {
                  avg += item;
                  count += 1;
                });
                avgRating = avg / count;
              }

              let partialUpdate = await adminAlgolia.partialUpdateObject({
                rating: avgRating,
                objectID: updatedata.related_id,
              });
              if (partialUpdate) {
                let checkIfCourseIsDeal = await supabase
                  .from("deals")
                  .select("*")
                  .eq("item_id", updatedata.related_id);
                if (
                  checkIfCourseIsDeal.data &&
                  checkIfCourseIsDeal?.data?.length > 0
                ) {
                  let dealIndex = algoliaClientAdmin.initIndex("deals");
                  let updateDealRating = await dealIndex.partialUpdateObject({
                    rating: avgRating,
                    objectID: checkIfCourseIsDeal?.data[0]?.id,
                  });
                  console.log(
                    { updateDealRating },
                    " RATING PRODUCT UPDATE IN DEAL"
                  );
                }
              }
              console.log({ partialUpdate }, " RATING PRODUCT UPDATE IN DEAL");
            }
          }
          if (updatedata.type == "articles") {
            let index = algoliaClient.initIndex("articles");
            let getCourseDetail = await index.getObject(updatedata.related_id);

            if (getCourseDetail) {
              let adminAlgolia = algoliaClientAdmin.initIndex("articles");
              let ratingReviews = await supabase
                .from("reviews")
                .select("*")
                .eq("related_id", updatedata.related_id);
              let avgRating = 0;
              if (ratingReviews.data && ratingReviews.data.length > 0) {
                let stars = _.map(ratingReviews.data, "stars");
                let avg = 0;
                let count = 0;
                stars.map((item) => {
                  avg += item;
                  count += 1;
                });
                avgRating = avg / count;
              }

              let partialUpdate = await adminAlgolia.partialUpdateObject({
                rating: avgRating,
                objectID: updatedata.related_id,
              });
            }
          }
          if (updatedata.type == "services") {
            let index = algoliaClient.initIndex("directory_companies");
            let getCourseDetail = await index.getObject(updatedata.related_id);

            if (getCourseDetail) {
              let adminAlgolia = algoliaClientAdmin.initIndex(
                "directory_companies"
              );
              let ratingReviews = await supabase
                .from("reviews")
                .select("*")
                .eq("related_id", updatedata.related_id);
              let avgRating = 0;
              if (ratingReviews.data && ratingReviews.data.length > 0) {
                let stars = _.map(ratingReviews.data, "stars");

                let avg = 0;
                let count = 0;
                stars.map((item) => {
                  avg += item;
                  count += 1;
                });
                avgRating = avg / count;
              }

              let partialUpdate = await adminAlgolia.partialUpdateObject({
                rating: avgRating,
                objectID: updatedata.related_id,
              });
              if (partialUpdate) {
                let checkIfCourseIsDeal = await supabase
                  .from("deals")
                  .select("*")
                  .eq("item_id", updatedata.related_id);
                if (
                  checkIfCourseIsDeal.data &&
                  checkIfCourseIsDeal?.data?.length > 0
                ) {
                  let dealIndex = algoliaClientAdmin.initIndex("deals");
                  let updateDealRating = await dealIndex.partialUpdateObject({
                    rating: avgRating,
                    objectID: checkIfCourseIsDeal?.data[0]?.id,
                  });
                  console.log(
                    { updateDealRating },
                    " RATING SERVICE UPDATE IN DEAL"
                  );
                }
              }
              console.log({ partialUpdate }, " RATING SERVICE UPDATE IN DEAL");
            }
          }
          let successUpdateObject = await supabase.from("algolia_data").insert({
            meta_key: bodyData?.type,
            meta_value: JSON.stringify(bodyData?.record),
            item_id: bodyData?.record?.id,
            type: "Reviews",
          });
          if (successUpdateObject?.data) {
            console.log("SUCCESS CREATED - REVIEWS");
          }

          break;
        default:
          break;
      }
      break;
    case "articles":
      switch (bodyData.type) {
        case "INSERT":
          let articleInsertdata = bodyData.record;
          let articleData = await supabase
            .from("articles")
            .select(
              "* , notable_figures(*),users(*) , article_categories(*) , article_category_filters(*) , organizations(*)  "
            )
            .eq("id", articleInsertdata.id);
          if (articleData.data) {
            let d = articleData.data.map((e) => {
              e.authorUser = e?.users;
              e.article_categories = e?.article_categories;
              e.category = e?.article_categories;
              e.author = e?.notable_figures;
              e.objectID = e?.id;
            });

            let articleIndex = algoliaClientAdmin.initIndex("articles");
            let dataToSend = await articleIndex.saveObject(
              articleData?.data[0],
              {
                autoGenerateObjectIDIfNotExist: true,
              }
            );
            if (dataToSend) {
              console.log("ARTICLES ADDED SUCCESSFULLY", dataToSend);

              let successObject = await supabase.from("algolia_data").insert({
                meta_key: bodyData?.type,
                meta_value: JSON.stringify(bodyData?.record),
                item_id: bodyData?.record?.id,
                type: "ARTICLES",
              });
              if (successObject?.data) {
                console.log("SUCCESS CREATED - ARTICLES");
              }
            }
          }

          break;
        case "UPDATE":
          let articlesUpdateData = bodyData.record;
          let articleUpdateData = await supabase
            .from("articles")
            .select(
              "* , notable_figures(*) ,users(*), article_categories(*) , article_category_filters(*)  "
            )
            .eq("id", articlesUpdateData?.id);
          if (articleUpdateData?.data) {
            let d = articleUpdateData?.data?.map((e) => {
              e.article_categories = e?.article_categories;
              e.category = e?.article_categories;
              e.author = e?.notable_figures;
              e.authorUser = e?.users;
              e.objectID = e?.id;
            });

            let articleIndex = algoliaClientAdmin.initIndex("articles");
            let dataToSend = await articleIndex.partialUpdateObject(
              articleUpdateData?.data[0]
            );
            if (dataToSend) {
              console.log("ARTICLES UPDATED SUCCESSFULLY", dataToSend);

              let successObject = await supabase.from("algolia_data").insert({
                meta_key: bodyData?.type,
                meta_value: JSON.stringify(bodyData?.record),
                item_id: bodyData?.record?.id,
                type: "ARTICLES",
              });
              if (successObject?.data) {
                console.log("SUCCESS CREATED - ARTICLES");
              }
            }
          }
          break;
        case "DELETE":
          let articlesDeleteData = bodyData.old_record;
          let articleIndex = algoliaClientAdmin.initIndex("articles");
          const deleteArticle = await articleIndex.deleteObject(
            bodyData.old_record.id
          );
          if (deleteArticle) {
            console.log("ARTICLES DELETED SUCCESSFULLY");

            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.old_record),
              item_id: bodyData?.old_record?.id,
              type: "ARTICLES",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - ARTICLES");
            }
          }
          break;
        default:
          break;
      }
      break;

    case "deals":
      console.log({bodyData});
      let dealsData;
      let adminAlgolia = algoliaClientAdmin.initIndex("deals");
      switch (bodyData.type) {
        case "INSERT":
          switch (bodyData?.record?.type) {
            case "courses":
              dealsData = await supabase
                .from("deals")
                .select("* , organizations(*)")
                .eq("type", "courses")
                .eq("is_expire", "0")
                .eq("item_id", bodyData?.record?.item_id);
              if (dealsData.data && dealsData.data.length > 0) {
                dealsData.data[0].objectID = bodyData?.record?.id;
                let coursesFind = await supabase
                  .from("courses")
                  .select("*")
                  .eq("id", bodyData?.record?.item_id);
                if (coursesFind.data && coursesFind.data.length > 0) {
                  let courseFindData = coursesFind.data;
                  dealsData.data[0].itemDetail = courseFindData[0];
                }

                let saveData = await adminAlgolia.saveObject(
                  dealsData.data[0],
                  {
                    autoGenerateObjectIDIfNotExist: true,
                  }
                );
                console.log({ saveData }, "course deal created");
                adminAlgolia = algoliaClientAdmin.initIndex("ce_courses");

                let updateCourse = await adminAlgolia.partialUpdateObject({
                  objectID: bodyData?.record?.item_id,
                  is_deal: true,
                  dealDetails: dealsData.data[0],
                });

                console.log({ updateCourse }, "course object updated");

                let successObject = await supabase.from("algolia_data").insert({
                  meta_key: bodyData?.type,
                  meta_value: JSON.stringify(bodyData?.record),
                  item_id: bodyData?.record?.id,
                  type: "DEALS_COURSE",
                });
                if (successObject?.data) {
                  console.log("SUCCESS CREATED - DEALS_COURSE");
                }
              }
              break;
            case "products":
              dealsData = await supabase
                .from("deals")
                .select("* , organizations(*)")
                .eq("type", "products")
                .eq("is_expire", "0")
                .eq("item_id", bodyData?.record?.item_id);
              if (dealsData.data && dealsData.data.length > 0) {
                dealsData.data[0].objectID = bodyData?.record?.id;
                let productsFind = await supabase
                  .from("products")
                  .select("*")
                  .eq("id", bodyData?.record?.item_id);
                if (productsFind.data && productsFind.data.length > 0) {
                  let productsFindData = productsFind.data;
                  dealsData.data[0].itemDetail = productsFindData[0];
                }

                let saveData = await adminAlgolia.saveObject(
                  dealsData.data[0],
                  {
                    autoGenerateObjectIDIfNotExist: true,
                  }
                );
                console.log({ saveData }, "products");
                adminAlgolia = algoliaClientAdmin.initIndex("products");

                let updateProcucts = await adminAlgolia.partialUpdateObject({
                  objectID: bodyData?.record?.item_id,
                  is_deal: true,
                  dealDetails: dealsData.data[0],
                });

                console.log({ updateProcucts }, "Procucts object updated");

                let successObject = await supabase.from("algolia_data").insert({
                  meta_key: bodyData?.type,
                  meta_value: JSON.stringify(bodyData?.record),
                  item_id: bodyData?.record?.id,
                  type: "DEALS_PRODUCTS",
                });
                if (successObject?.data) {
                  console.log("SUCCESS CREATED - DEALS_PRODUCTS");
                }
              }
              break;
            case "services":
              dealsData = await supabase
                .from("deals")
                .select("* , organizations(*)")
                .eq("type", "services")
                .eq("is_expire", "0")
                .eq("item_id", bodyData?.record?.item_id);
              if (dealsData.data && dealsData.data.length > 0) {
                dealsData.data[0].objectID = bodyData?.record?.id;
                let productsFind = await supabase
                  .from("directory_companies")
                  .select("* , company(*) , directory_frontend_categories(*) ")
                  .eq("id", bodyData?.record?.item_id);
                if (productsFind.data && productsFind.data.length > 0) {
                  let productsFindData = productsFind.data;
                  dealsData.data[0].itemDetail = productsFindData[0];
                }

                let saveData = await adminAlgolia.saveObject(
                  dealsData.data[0],
                  {
                    autoGenerateObjectIDIfNotExist: true,
                  }
                );
                console.log({ saveData }, "directory - deals insert");
                adminAlgolia = algoliaClientAdmin.initIndex(
                  "directory_companies"
                );

                let updateProcucts = await adminAlgolia.partialUpdateObject({
                  objectID: bodyData?.record?.item_id,
                  is_deal: true,
                  dealDetails: dealsData.data[0],
                });

                console.log(
                  { updateProcucts },
                  "Directory object updated - Deals"
                );

                let successObject = await supabase.from("algolia_data").insert({
                  meta_key: bodyData?.type,
                  meta_value: JSON.stringify(bodyData?.record),
                  item_id: bodyData?.record?.id,
                  type: "DEALS_SERVICE",
                });
                if (successObject?.data) {
                  console.log("SUCCESS CREATED - DEALS_SERVICE");
                }
              }
              break;
            default:
              break;
          }
          break;
        case "UPDATE":
          switch (bodyData?.record?.type) {
            case "courses":
              dealsData = await supabase
                .from("deals")
                .select("* , organizations(*)")
                .eq("type", "courses")
                .eq("item_id", bodyData?.record?.item_id);
              if (dealsData.data && dealsData.data.length > 0) {
                dealsData.data[0].objectID = bodyData?.record?.id;
                let coursesFind = await supabase
                  .from("courses")
                  .select("*")
                  .eq("id", bodyData?.record?.item_id);
                if (coursesFind.data && coursesFind.data.length > 0) {
                  let courseFindData = coursesFind.data;
                  dealsData.data[0].itemDetail = courseFindData[0];
                }

                let saveData = await adminAlgolia.partialUpdateObject(
                  dealsData.data[0]
                );
                if (dealsData.data[0]?.is_expire == 1) {
                  adminAlgolia = algoliaClientAdmin.initIndex("ce_courses");

                  let updateCourse = await adminAlgolia.partialUpdateObject({
                    objectID: bodyData?.record?.item_id,
                    is_deal: false,
                    dealDetails: {},
                  });

                  console.log(
                    { updateCourse },
                    "course object updated - expire"
                  );
                }

                console.log({ saveData }, "course");

                let successObject = await supabase.from("algolia_data").insert({
                  meta_key: bodyData?.type,
                  meta_value: JSON.stringify(bodyData?.record),
                  item_id: bodyData?.record?.id,
                  type: "DEALS_COURSE",
                });
                if (successObject?.data) {
                  console.log("SUCCESS CREATED - DEALS_COURSE");
                }
              }
              break;
            case "products":
              dealsData = await supabase
                .from("deals")
                .select("* , organizations(*)")
                .eq("type", "products")
                .eq("item_id", bodyData?.record?.item_id);
              if (dealsData.data && dealsData.data.length > 0) {
                dealsData.data[0].objectID = bodyData?.record?.id;
                let productsFind = await supabase
                  .from("products")
                  .select("*")
                  .eq("id", bodyData?.record?.item_id);
                if (productsFind.data && productsFind.data.length > 0) {
                  let productsFindData = productsFind.data;
                  dealsData.data[0].itemDetail = productsFindData[0];
                }

                let saveData = await adminAlgolia.partialUpdateObject(
                  dealsData.data[0]
                );
                console.log({ saveData }, "products update");

                if (dealsData.data[0]?.is_expire == 1) {
                  adminAlgolia = algoliaClientAdmin.initIndex("products");

                  let updateProducts = await adminAlgolia.partialUpdateObject({
                    objectID: bodyData?.record?.item_id,
                    is_deal: false,
                    dealDetails: {},
                  });

                  console.log(
                    { updateProducts },
                    "Products object updated - expire"
                  );
                }

                let successObject = await supabase.from("algolia_data").insert({
                  meta_key: bodyData?.type,
                  meta_value: JSON.stringify(bodyData?.record),
                  item_id: bodyData?.record?.id,
                  type: "DEALS_PRODUCTS",
                });
                if (successObject?.data) {
                  console.log("SUCCESS CREATED - DEALS_PRODUCTS");
                }
              }
              break;

            case "services":
              dealsData = await supabase
                .from("deals")
                .select("* , organizations(*)")
                .eq("type", "services")
                // .eq("is_expire", "0")
                .eq("item_id", bodyData?.record?.item_id);
              if (dealsData.data && dealsData.data.length > 0) {
                dealsData.data[0].objectID = bodyData?.record?.id;
                let productsFind = await supabase
                  .from("directory_companies")
                  .select("* , company(*) , directory_frontend_categories(*) ")
                  .eq("id", bodyData?.record?.item_id);
                if (productsFind.data && productsFind.data.length > 0) {
                  let productsFindData = productsFind.data;
                  dealsData.data[0].itemDetail = productsFindData[0];
                }

                let saveData = await adminAlgolia.partialUpdateObject(
                  dealsData.data[0]
                );
                console.log({ saveData }, "directory update - deals");

                if (dealsData.data[0]?.is_expire == 1) {
                  adminAlgolia = algoliaClientAdmin.initIndex(
                    "directory_companies"
                  );

                  let updateProducts = await adminAlgolia.partialUpdateObject({
                    objectID: bodyData?.record?.item_id,
                    is_deal: false,
                    dealDetails: {},
                  });

                  console.log(
                    { updateProducts },
                    "Directory object updated - expire"
                  );
                }

                let successObject = await supabase.from("algolia_data").insert({
                  meta_key: bodyData?.type,
                  meta_value: JSON.stringify(bodyData?.record),
                  item_id: bodyData?.record?.id,
                  type: "DEALS_SERVICE",
                });
                if (successObject?.data) {
                  console.log("SUCCESS CREATED - DEALS_SERVICE");
                }
              }
              break;
            default:
              break;
          }
          break;
        case "DELETE":
          switch (bodyData?.old_record?.type) {
            case "courses":
              let deleteCourseDealIndex = algoliaClientAdmin.initIndex("deals");
              deleteCourseDealIndex
                .deleteObject(bodyData.old_record.id)
                .then((result) => {
                  console.log("DELETE COURSE DEAL");
                });
              adminAlgolia = algoliaClientAdmin.initIndex("ce_courses");

              let updateCourse = await adminAlgolia.partialUpdateObject({
                objectID: bodyData?.old_record?.item_id,
                is_deal: false,
                dealDetails: {},
              });

              console.log({ updateCourse }, "course object updated - delete");

              let successObject = await supabase.from("algolia_data").insert({
                meta_key: bodyData?.type,
                meta_value: JSON.stringify(bodyData?.old_record),
                item_id: bodyData?.old_record?.id,
                type: "DEALS_COURSE",
              });
              if (successObject?.data) {
                console.log("SUCCESS CREATED - DEALS_COURSE");
              }

              break;
            case "products":
              let deleteProductDealIndex =
                algoliaClientAdmin.initIndex("deals");
              deleteProductDealIndex
                .deleteObject(bodyData.old_record.id)
                .then((result) => {
                  console.log("DELETE PRODUCT DEAL");
                });
              adminAlgolia = algoliaClientAdmin.initIndex("products");

              let updateProducts = await adminAlgolia.partialUpdateObject({
                objectID: bodyData?.old_record?.item_id,
                is_deal: false,
                dealDetails: {},
              });

              console.log(
                { updateProducts },
                "Products object updated - delete"
              );

              let successObjectProduct = await supabase
                .from("algolia_data")
                .insert({
                  meta_key: bodyData?.type,
                  meta_value: JSON.stringify(bodyData?.old_record),
                  item_id: bodyData?.old_record?.id,
                  type: "DEALS_PRODUCTS",
                });
              if (successObjectProduct?.data) {
                console.log("SUCCESS CREATED - DEALS_PRODUCTS");
              }
              break;

            case "services":
              let deleteServiceDeals = algoliaClientAdmin.initIndex("deals");
              deleteServiceDeals
                .deleteObject(bodyData.old_record.id)
                .then((result) => {
                  console.log("DELETE SERVICES DEAL");
                });
              adminAlgolia = algoliaClientAdmin.initIndex(
                "directory_companies"
              );

              let updateServicesAfterDelete =
                await adminAlgolia.partialUpdateObject({
                  objectID: bodyData?.old_record?.item_id,
                  is_deal: false,
                  dealDetails: {},
                });

              console.log(
                { updateServicesAfterDelete },
                "Services object - delete"
              );

              let successObjectService = await supabase
                .from("algolia_data")
                .insert({
                  meta_key: bodyData?.type,
                  meta_value: JSON.stringify(bodyData?.old_record),
                  item_id: bodyData?.old_record?.id,
                  type: "DEALS_SERVICE",
                });
              if (successObjectService?.data) {
                console.log("SUCCESS CREATED - DEALS_SERVICE");
              }
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      break;

    case "wishlist":
      let initIndex;
      switch (bodyData.type) {
        case "INSERT":
          switch (bodyData.record.type) {
            case "deals":
              initIndex = algoliaClientAdmin.initIndex("deals");
              let getUsers = await supabase
                .from("wishlist")
                .select("*")
                .eq("item_id", bodyData?.record?.item_id)
                .eq("is_like", true);
              let user_ids;
              if (getUsers?.data && getUsers?.data?.length > 0) {
                user_ids = _.map(getUsers?.data, "user_id");
                let saveWishListIndex = await initIndex.partialUpdateObject({
                  objectID: bodyData?.record?.item_id,
                  favUsers: user_ids,
                });
                if (saveWishListIndex) {
                  console.log({ saveWishListIndex }, "PARTIAL UPDATE");
                }
              }

              let successObject = await supabase.from("algolia_data").insert({
                meta_key: bodyData?.type,
                meta_value: JSON.stringify(bodyData?.record),
                item_id: bodyData?.record?.id,
                type: "WISHLIST_DEALS",
              });
              if (successObject?.data) {
                console.log("SUCCESS CREATED - WISHLIST_DEALS");
              }
              break;

            default:
              console.log("DEFAULT");
              break;
          }
          break;

        case "UPDATE":
          switch (bodyData.record.type) {
            case "deals":
              initIndex = algoliaClientAdmin.initIndex("deals");
              let getUsers = await supabase
                .from("wishlist")
                .select("*")
                .eq("is_like", true)
                .eq("item_id", bodyData?.record?.item_id);
              let user_ids;
              console.log(getUsers.data);
              if (getUsers?.data && getUsers?.data?.length > 0) {
                user_ids = _.map(getUsers?.data, "user_id");
                let saveWishListIndex = await initIndex.partialUpdateObject({
                  objectID: bodyData?.record?.item_id,
                  favUsers: user_ids,
                });
                if (saveWishListIndex) {
                  console.log({ saveWishListIndex }, "PARTIAL UPDATE - IF");
                }
              } else {
                let saveWishListIndex = await initIndex.partialUpdateObject({
                  objectID: bodyData?.record?.item_id,
                  favUsers: [],
                });
                if (saveWishListIndex) {
                  console.log({ saveWishListIndex }, "PARTIAL UPDATE - ELSE");
                }
              }
              let successObject = await supabase.from("algolia_data").insert({
                meta_key: bodyData?.type,
                meta_value: JSON.stringify(bodyData?.record),
                item_id: bodyData?.record?.id,
                type: "WISHLIST_DEALS",
              });
              if (successObject?.data) {
                console.log("SUCCESS CREATED - WISHLIST_DEALS");
              }

              break;

            default:
              console.log("DEFAULT");
              break;
          }
          break;
        default:
          break;
      }
      break;

    case "article_categories":
      let intiArticleCategories;
      intiArticleCategories =
        algoliaClientAdmin.initIndex("article_categories");
      switch (bodyData.type) {
        case "INSERT":
          if (bodyData?.record) {
            bodyData.record.objectID = bodyData?.record?.id;
            const saveArticleCategories =
              await intiArticleCategories.saveObject(bodyData.record, {
                autoGenerateObjectIDIfNotExist: true,
              });
            console.log(
              { saveArticleCategories },
              "Articles Categories Created"
            );
            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "ARTICLE_CATEGORIES",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - ARTICLE_CATEGORIES");
            }
          } else {
            console.log(
              bodyData?.record,
              "Articles Categories CREATE - Failed"
            );
          }

          break;
        case "UPDATE":
          if (bodyData?.record) {
            bodyData.record.objectID = bodyData?.record?.id;
            const updateArticleCategories =
              await intiArticleCategories.partialUpdateObject(bodyData?.record);
            console.log(
              { updateArticleCategories },
              "Articles Categories UPDATE"
            );

            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "ARTICLE_CATEGORIES",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - ARTICLE_CATEGORIES");
            }
          } else {
            console.log(
              bodyData?.record,
              "Articles Categories UPDATE - Failed"
            );
          }

          break;

        case "DELETE":
          const deleteArticleCategories =
            await intiArticleCategories.deleteObject(bodyData?.old_record?.id);
          console.log(
            { deleteArticleCategories },
            "Articles Categories UPDATE"
          );

          let successObject = await supabase.from("algolia_data").insert({
            meta_key: bodyData?.type,
            meta_value: JSON.stringify(bodyData?.old_record),
            item_id: bodyData?.old_record?.id,
            type: "ARTICLE_CATEGORIES",
          });
          if (successObject?.data) {
            console.log("SUCCESS CREATED - ARTICLE_CATEGORIES");
          }
          break;
        default:
          console.log("DEFAULT : article_categories");
          break;
      }
      break;

    case "product_parent_categories":
      let intiProductCategories;
      intiProductCategories =
        algoliaClientAdmin.initIndex("product_categories");
      switch (bodyData.type) {
        case "INSERT":
          if (bodyData?.record) {
            bodyData.record.objectID = bodyData?.record?.name;
            delete bodyData?.record?.id;
            const saveArticleCategories =
              await intiProductCategories.saveObject(bodyData.record, {
                autoGenerateObjectIDIfNotExist: true,
              });
            console.log(
              { saveArticleCategories },
              "Product Categories Created"
            );
            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "PRODUCT_CATEGORIES",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - PRODUCT_CATEGORIES");
            }
          } else {
            console.log(bodyData?.record, "Product Categories CREATE - Failed");
          }

          break;
        case "UPDATE":
          if (bodyData?.record) {
            bodyData.record.objectID = bodyData?.record?.name;
            const updateArticleCategories =
              await intiProductCategories.partialUpdateObject(bodyData?.record);
            console.log(
              { updateArticleCategories },
              "Product Categories UPDATE"
            );

            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "PRODUCT_CATEGORIES",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - PRODUCT_CATEGORIES");
            }
          } else {
            console.log(bodyData?.record, "Product Categories UPDATE - Failed");
          }

          break;

        case "DELETE":
          const deleteArticleCategories =
            await intiProductCategories.deleteObject(bodyData?.old_record?.id);
          console.log({ deleteArticleCategories }, "Product Categories UPDATE");
          let successObject = await supabase.from("algolia_data").insert({
            meta_key: bodyData?.type,
            meta_value: JSON.stringify(bodyData?.old_record),
            item_id: bodyData?.old_record?.id,
            type: "PRODUCT_CATEGORIES",
          });
          if (successObject?.data) {
            console.log("SUCCESS CREATED - PRODUCT_CATEGORIES");
          }
          break;
        default:
          console.log("DEFAULT : product_categories");
          break;
      }
      break;

    case "course_categories":
      let intiCourseCategories;
      intiCourseCategories = algoliaClientAdmin.initIndex("course_categories");
      switch (bodyData.type) {
        case "INSERT":
          if (bodyData?.record) {
            bodyData.record.objectID = bodyData?.record?.id;
            const saveArticleCategories = await intiCourseCategories.saveObject(
              bodyData.record,
              {
                autoGenerateObjectIDIfNotExist: true,
              }
            );
            console.log(
              { saveArticleCategories },
              "Product Categories Created"
            );

            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "COURSE_CATEGORIES",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - COURSE_CATEGORIES");
            }
          } else {
            console.log(bodyData?.record, "Product Categories CREATE - Failed");
          }

          break;
        case "UPDATE":
          if (bodyData?.record) {
            bodyData.record.objectID = bodyData?.record?.id;
            const updateArticleCategories =
              await intiCourseCategories.partialUpdateObject(bodyData?.record);
            console.log(
              { updateArticleCategories },
              "Product Categories UPDATE"
            );

            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "COURSE_CATEGORIES",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - COURSE_CATEGORIES");
            }
          } else {
            console.log(bodyData?.record, "Product Categories UPDATE - Failed");
          }

          break;

        case "DELETE":
          const deleteArticleCategories =
            await intiCourseCategories.deleteObject(bodyData?.old_record?.id);
          console.log({ deleteArticleCategories }, "Product Categories UPDATE");

          let successObject = await supabase.from("algolia_data").insert({
            meta_key: bodyData?.type,
            meta_value: JSON.stringify(bodyData?.old_record),
            item_id: bodyData?.old_record?.id,
            type: "COURSE_CATEGORIES",
          });
          if (successObject?.data) {
            console.log("SUCCESS CREATED - COURSE_CATEGORIES");
          }
          break;
        default:
          console.log("DEFAULT : course_categories");
          break;
      }
      break;

    case "directory_frontend_categories":
      let intiDirectoryCategories;
      intiDirectoryCategories = algoliaClientAdmin.initIndex(
        "directory_categories"
      );
      switch (bodyData.type) {
        case "INSERT":
          if (bodyData?.record) {
            bodyData.record.objectID = bodyData?.record?.id;
            bodyData.record.title = bodyData?.record?.name;
            const saveArticleCategories =
              await intiDirectoryCategories.saveObject(bodyData.record, {
                autoGenerateObjectIDIfNotExist: true,
              });
            console.log(
              { saveArticleCategories },
              "Product Categories Created"
            );
            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "SERVICE_CATEGORIES",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - SERVICE_CATEGORIES");
            }
          } else {
            console.log(bodyData?.record, "Product Categories CREATE - Failed");
          }

          break;
        case "UPDATE":
          if (bodyData?.record) {
            bodyData.record.objectID = bodyData?.record?.id;
            bodyData.record.title = bodyData?.record?.name;
            const updateArticleCategories =
              await intiDirectoryCategories.partialUpdateObject(
                bodyData?.record
              );
            console.log(
              { updateArticleCategories },
              "Product Categories UPDATE"
            );

            let successObject = await supabase.from("algolia_data").insert({
              meta_key: bodyData?.type,
              meta_value: JSON.stringify(bodyData?.record),
              item_id: bodyData?.record?.id,
              type: "SERVICE_CATEGORIES",
            });
            if (successObject?.data) {
              console.log("SUCCESS CREATED - SERVICE_CATEGORIES");
            }
          } else {
            console.log(bodyData?.record, "Product Categories UPDATE - Failed");
          }

          break;

        case "DELETE":
          const deleteArticleCategories =
            await intiDirectoryCategories.deleteObject(
              bodyData?.old_record?.id
            );
          console.log({ deleteArticleCategories }, "Product Categories UPDATE");

          let successObject = await supabase.from("algolia_data").insert({
            meta_key: bodyData?.type,
            meta_value: JSON.stringify(bodyData?.old_record),
            item_id: bodyData?.old_record?.id,
            type: "SERVICE_CATEGORIES",
          });
          if (successObject?.data) {
            console.log("SUCCESS CREATED - SERVICE_CATEGORIES");
          }
          break;
        default:
          console.log("DEFAULT : directory_categories");
          break;
      }
      break;

    case "organizations":
      let intiOrganizations;
      let itemData;
      let ids;
      let arr = [];
      let updateAlgoliaItem;
      let checkDealsItem;
      switch (bodyData.type) {
        case "UPDATE":
          if (bodyData?.record?.organization_type == "service_provider") {
            intiOrganizations = algoliaClientAdmin.initIndex(
              "directory_categories"
            );
            itemData = await supabase
              .from("directory_companies")
              .select("*")
              .eq("company", bodyData?.record?.id);
            if (itemData?.data && itemData?.data?.length > 0) {
              ids = _.map(itemData?.data, "id");

              itemData?.data?.map((e) => {
                arr.push({
                  objectID: e?.id,
                  company: bodyData?.record,
                });
              });
              updateAlgoliaItem = await intiOrganizations.partialUpdateObjects(
                arr
              );
              console.log(
                { updateAlgoliaItem },
                "UPDATE - DIRECTORY AFTER ORGANIZATION UPDATE"
              );

              checkDealsItem = await supabase
                .from("deals")
                .select("*")
                .in("item_id", ids)
                .eq("is_expire", 0);
              if (
                checkDealsItem &&
                checkDealsItem?.data &&
                checkDealsItem?.data?.length > 0
              ) {
                // ids = _.map(checkDealsItem?.data, "id");
                arr = [];
                intiOrganizations = algoliaClientAdmin.initIndex("deals");
                checkDealsItem?.data?.map((e) => {
                  arr.push({
                    objectID: e?.id,
                    organizations: bodyData?.record,
                  });
                });
                updateAlgoliaItem =
                  await intiOrganizations.partialUpdateObjects(arr);

                console.log(
                  { updateAlgoliaItem },
                  "UPDATE - SERVICES DEALS AFTER ORGANIZATION UPDATE"
                );
              }
            }
            // ids = _.map(itemData?.data, "id");
          } else if (bodyData?.record?.organization_type == "course_provider") {
            intiOrganizations = algoliaClientAdmin.initIndex("ce_courses");
            itemData = await supabase
              .from("courses")
              .select("*")
              .eq("organization", bodyData?.record?.id);

            if (itemData?.data && itemData?.data?.length > 0) {
              ids = _.map(itemData?.data, "id");

              itemData?.data?.map((e) => {
                arr.push({
                  objectID: e?.id,
                  organization_detail: bodyData?.record,
                  organization: bodyData?.record,
                });
              });
              updateAlgoliaItem = await intiOrganizations.partialUpdateObjects(
                arr
              );
              console.log(
                { updateAlgoliaItem },
                "UPDATE - COURSE AFTER ORGANIZATION UPDATE"
              );

              checkDealsItem = await supabase
                .from("deals")
                .select("*")
                .in("item_id", ids)
                .eq("is_expire", 0);
              if (
                checkDealsItem &&
                checkDealsItem?.data &&
                checkDealsItem?.data?.length > 0
              ) {
                // ids = _.map(checkDealsItem?.data, "id");
                arr = [];
                intiOrganizations = algoliaClientAdmin.initIndex("deals");
                checkDealsItem?.data?.map((e) => {
                  arr.push({
                    objectID: e?.id,
                    organizations: bodyData?.record,
                  });
                });
                updateAlgoliaItem =
                  await intiOrganizations.partialUpdateObjects(arr);

                console.log(
                  { updateAlgoliaItem },
                  "UPDATE - COURSE DEALS AFTER ORGANIZATION UPDATE"
                );
              }
            }
          } else if (
            bodyData?.record?.organization_type == "product_provider"
          ) {
            intiOrganizations = algoliaClientAdmin.initIndex("products");
            itemData = await supabase
              .from("products")
              .select("*")
              .eq("organization", bodyData?.record?.id);

            if (itemData?.data && itemData?.data?.length > 0) {
              ids = _.map(itemData?.data, "id");

              itemData?.data?.map((e) => {
                arr.push({
                  objectID: e?.id,
                  organization: bodyData?.record,
                });
              });
              updateAlgoliaItem = await intiOrganizations.partialUpdateObjects(
                arr
              );
              console.log(
                { updateAlgoliaItem },
                "UPDATE - PRODUCTS AFTER ORGANIZATION UPDATE"
              );

              checkDealsItem = await supabase
                .from("deals")
                .select("*")
                .in("item_id", ids)
                .eq("is_expire", 0);
              if (
                checkDealsItem &&
                checkDealsItem?.data &&
                checkDealsItem?.data?.length > 0
              ) {
                // ids = _.map(checkDealsItem?.data, "id");
                arr = [];
                intiOrganizations = algoliaClientAdmin.initIndex("deals");
                checkDealsItem?.data?.map((e) => {
                  arr.push({
                    objectID: e?.id,
                    organizations: bodyData?.record,
                  });
                });
                updateAlgoliaItem =
                  await intiOrganizations.partialUpdateObjects(arr);

                console.log(
                  { updateAlgoliaItem },
                  "UPDATE - COURSE DEALS AFTER ORGANIZATION UPDATE"
                );
              }
            }
          } else {
            console.log("NO ORGANIZATION TYPE");
          }

          let successObject = await supabase.from("algolia_data").insert({
            meta_key: bodyData?.type,
            meta_value: JSON.stringify(bodyData?.record),
            item_id: bodyData?.record?.id,
            type: "OTGANIZATION",
          });
          if (successObject?.data) {
            console.log("SUCCESS CREATED - OTGANIZATION");
          }
          // if (itemData && itemData?.data) {
          //   // let ids = _.map(itemData?.data, "id");
          //   // let findDeals = await supabase.from("deals");
          //   // if (ids?.length > 0) {
          //   // } else {
          //   //   console.log("NO IDS");
          //   // }
          // }
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  res.status(200).json({ name: "Sync" });
}
