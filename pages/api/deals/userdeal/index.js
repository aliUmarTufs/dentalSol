import { supabase } from "../../../../lib/supabaseClient";
import _ from "lodash";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const getBody = req.query;
    if (getBody?.user_id) {
      let organizations;
      let checkIfUserisAdmin = await supabase
        .from("users")
        .select("*")
        .eq("id", getBody?.user_id)
        .eq("role_type", "Admin");
      if (checkIfUserisAdmin?.data && checkIfUserisAdmin?.data?.length > 0) {
        let adminDeals = await supabase
          .from("deals")
          .select("* , organizations( * , organization_user(*))")
          .eq("deal_type", req?.query?.type)
          .order("is_approved", { ascending: false })
          .range(req?.query?.offset, req?.query?.offset + 5);

        let productsCount = await await supabase
          .from("deals")
          .select("* , organizations( * , organization_user(*))")
          .eq("deal_type", req?.query?.type);
        if (adminDeals.data && adminDeals?.data?.length > 0) {
          // Filter Courses and Products Details from deals
          let filterCourses = _.filter(adminDeals?.data, (item) => {
            return item.type == "courses";
          });

          let filterIdsCourses = _.map(filterCourses, "item_id");
          let findFilterCourses = await supabase
            .from("courses")
            .select("*")
            .in("id", filterIdsCourses);

          let filterProdcuts = _.filter(adminDeals?.data, (item) => {
            return item.type == "products";
          });
          let filterIdsProdcuts = _.map(filterProdcuts, "item_id");
          let findFilterProdcuts = await supabase
            .from("products")
            .select("* , category(*)")
            .in("id", filterIdsProdcuts);

          let filterServices = _.filter(adminDeals?.data, (item) => {
            return item.type == "services";
          });
          let filterIdsServices = _.map(filterServices, "item_id");
          let findFilterServices = await supabase
            .from("directory_companies")
            .select("* , company(*) , directory_frontend_categories(*) ")
            .in("id", filterIdsServices);

          // -------------xxxx-------------

          let deal_ids = _.map(adminDeals?.data, "id");
          let availUsers = await supabase
            .from("avail_deal_users")
            .select("* , users(*)")
            .in("deal_id", deal_ids);
          if (availUsers?.data) {
            adminDeals?.data?.map((e) => {
              let filter = _.filter(availUsers?.data, (item) => {
                return e?.id == item?.deal_id;
              });

              if (e?.type == "courses") {
                let filterItem = _.filter(findFilterCourses?.data, (item) => {
                  return item?.id == e?.item_id;
                });

                e.itemDetails = filterItem;
              }
              if (e?.type == "products") {
                let filterItem = _.filter(findFilterProdcuts?.data, (item) => {
                  return item?.id == e?.item_id;
                });

                e.itemDetails = filterItem;
              }
              if (e?.type == "services") {
                let filterItem = _.filter(findFilterServices?.data, (item) => {
                  return item?.id == e?.item_id;
                });

                e.itemDetails = filterItem;
              }

              e.availUsers = filter;
              e.availUsersCount = filter?.length;
            });
          }
          res.status(200).send({
            status: true,
            message: "Deals Found",
            data: adminDeals?.data,
            totalCount: productsCount?.data?.length,
            offset: parseInt(req?.query?.offset) + 5,
          });
        } else {
          res.status(200).send({
            status: false,
            message: "No Deals Found",
          });
        }
      } else {
        organizations = await supabase
          .from("organizations")
          .select("* ,  organization_user(*)")
          .eq("organization_user", getBody?.user_id);
        if (organizations?.data && organizations?.data?.length > 0) {
          let ids = _.map(organizations?.data, "id");
          let getProducts = await supabase
            .from("deals")
            .select("* , organizations( * , organization_user(*))")
            .eq("deal_type", req?.query?.type)
            .in("organization_id", ids)
            .order("is_approved", { ascending: false })
            .range(req?.query?.offset, req?.query?.offset + 5);
          let productsCount = await supabase
            .from("deals")
            .select("* , organizations( * , organization_user(*))")
            .eq("deal_type", req?.query?.type)
            .in("organization_id", ids);
          if (getProducts?.data && getProducts?.data?.length > 0) {
            let filterCourses = _.filter(getProducts?.data, (item) => {
              return item.type == "courses";
            });

            let filterIdsCourses = _.map(filterCourses, "item_id");
            let findFilterCourses = await supabase
              .from("courses")
              .select("*")
              .in("id", filterIdsCourses);

            let filterProdcuts = _.filter(getProducts?.data, (item) => {
              return item.type == "products";
            });
            // console.log(findFilterCourses?.data , filterIdsCourses);
            let filterIdsProdcuts = _.map(filterProdcuts, "item_id");
            let findFilterProdcuts = await supabase
              .from("products")
              .select("* , category(*)")
              .in("id", filterIdsProdcuts);

            let filterServices = _.filter(getProducts?.data, (item) => {
              return item.type == "services";
            });
            let filterIdsServices = _.map(filterServices, "item_id");
            let findFilterServices = await supabase
              .from("directory_companies")
              .select("* , company(*) , directory_frontend_categories(*) ")
              .in("id", filterIdsServices);

            // ----------xxxxxxxxxxxxx-------------

            let deal_ids = _.map(getProducts?.data, "id");
            let availUsers = await supabase
              .from("avail_deal_users")
              .select("* , users(*)")
              .in("deal_id", deal_ids);
            if (availUsers?.data) {
              getProducts?.data?.map((e) => {
                let filter = _.filter(availUsers?.data, (item) => {
                  return e?.id == item?.deal_id;
                });

                let filterOrganization = _.filter(
                  organizations?.data,
                  (item) => {
                    return e?.organization_id == item?.id;
                  }
                );

                if (e?.type == "courses") {
                  let filterItem = _.filter(findFilterCourses?.data, (item) => {
                    return item?.id == e?.item_id;
                  });

                  e.itemDetails = filterItem;
                }
                if (e?.type == "products") {
                  let filterItem = _.filter(
                    findFilterProdcuts?.data,
                    (item) => {
                      return item?.id == e?.item_id;
                    }
                  );

                  e.itemDetails = filterItem;
                }

                if (e?.type == "services") {
                  let filterItem = _.filter(
                    findFilterServices?.data,
                    (item) => {
                      return item?.id == e?.item_id;
                    }
                  );

                  e.itemDetails = filterItem;
                }

                // e.organizations = filterOrganization
                e.availUsers = filter;
                e.availUsersCount = filter?.length;
              });
            }
            res.status(200).send({
              status: true,
              message: "Deals Found",
              data: getProducts?.data,
              totalCount: productsCount?.data?.length,
              offset: parseInt(req?.query?.offset) + 5,
            });
          } else {
            res.status(200).send({
              status: false,
              message: "No Deals Found",
            });
          }
        } else {
          res.status(400).send({
            status: false,
            message: "No Organizations Found",
          });
        }
      }
    } else {
      res.status(400).send({
        status: false,
        message: "user id is required.",
      });
    }
  } else {
    res.status(405).send({ message: "Only GET requests allowed" });
  }
}
