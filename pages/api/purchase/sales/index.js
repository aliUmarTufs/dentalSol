import _ from "lodash";
import { salesMonths } from "../../../../constants";
import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const getData = req.body;
      let objResponse = {
        totalSales: 0,
        totalAppCharges: 0,
        totalRevenue: 0,
        productListing: 0,
        courseListing: 0,
        serviceListing: 0,
        articlesListing: 0,
        salesByMonth: [],
        salesList: [],
      };
      if (getData?.user_id) {
        let getUser = await supabase
          .from("users")
          .select("*")
          .eq("id", getData?.user_id);
        if (getUser?.data && getUser?.data?.length > 0) {
          let getOrganizations = await supabase
            .from("organizations")
            .select("*")
            .eq("organization_user", getData?.user_id);
          if (getOrganizations?.data && getOrganizations?.data?.length > 0) {
            let organizationIDs = _.map(getOrganizations?.data, "id");
            let monthArr = [];
            // let salesMonth = await supabase
            //   .from("sales_report_month")
            //   .select("*");
            // if (salesMonth?.data && salesMonth?.data?.length > 0) {
            //   salesMonth?.data?.map((e) => {
            //     emaghrib.sales = 0;
            //   });
            // }
            if (organizationIDs?.length > 0) {
              let productListing = await supabase
                .from("products")
                .select("*")
                .in("organization", organizationIDs);
              if (productListing?.data) {
                objResponse.productListing = productListing?.data?.length;
              }

              let courseListing = await supabase
                .from("courses")
                .select("*")
                .in("organization", organizationIDs);
              if (courseListing?.data) {
                objResponse.courseListing = courseListing?.data?.length;
              }

              let serviceListing = await supabase
                .from("directory_companies")
                .select("*")
                .in("company", organizationIDs);
              if (serviceListing?.data) {
                objResponse.serviceListing = serviceListing?.data?.length;
              }

              let articlesListing = await supabase
                .from("articles")
                .select("*")
                .in("organization_id", organizationIDs);
              if (articlesListing?.data) {
                objResponse.articlesListing = articlesListing?.data?.length;
              }

              let sales = await supabase
                .from("sales_report")
                .select("*")
                .in("organization_id", organizationIDs);
              if (sales?.data) {
                objResponse.totalSales = _.sumBy(sales?.data, "total");
                objResponse.totalAppCharges = _.sumBy(
                  sales?.data,
                  "app_amount"
                );
                objResponse.totalRevenue = parseFloat(
                  _.sumBy(sales?.data, "revenue")
                ).toFixed(2);
                let monthlyArray = _.cloneDeep(salesMonths);
                monthlyArray?.map((e) => {
                  let mapSales = sales?.data?.map((data) => {
                    if (e?.month == data?.Month) {
                      e.sales = e?.sales + data?.total;
                      if (data?.revenue) {
                        e.revenue = e.revenue + parseInt(data?.revenue);
                      }
                      if (data?.app_amount) {
                        e.app_amount =
                          e.app_amount + parseInt(data?.app_amount);
                      }
                    }
                  });
                });

                objResponse.salesByMonth = monthlyArray;
              }

              let salesList = await supabase
                .from("purchases")
                .select("* , buyer_id(*) , organization_id(*)")
                .in("organization_id", organizationIDs)
                .order("created_at", { ascending: false });
              if (salesList?.data && salesList?.data?.length > 0) {
                objResponse.salesList = salesList?.data;
              }
            }

            res.status(200).send({
              status: true,
              message: "Data Found",
              data: objResponse,
            });
          } else {
            res.status(400).send({
              status: false,
              message: "No Organization Found",
            });
          }
        } else {
          res.status(400).send({
            status: false,
            message: getUser?.error?.message,
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: "User is required.",
        });
      }
    } catch (error) {
      res.status(400).send({
        status: false,
        message: error?.message,
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
