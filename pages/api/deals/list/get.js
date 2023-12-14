import { supabase } from "../../../../lib/supabaseClient";
import _ from "lodash";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    let obj = {
      coursesDeals: [],
      productsDeals: [],
      servicesDeals: [],
    };
    let courseDeals = await supabase
      .from("deals")
      .select("* , organizations(*)")
      .eq("type", "courses")
      .eq("is_expire", "0")
      .limit(data?.limit || 6);
    if (courseDeals.data && courseDeals.data.length > 0) {
      let ids = _.map(courseDeals.data, "item_id");
      if (ids && ids.length > 0) {
        let coursesFind = await supabase
          .from("courses")
          .select("*")
          .in("id", ids);
        if (coursesFind.data && coursesFind.data.length > 0) {
          let courseFindData = coursesFind.data;
          courseDeals.data.map((d) => {
            let filter = courseFindData.filter((e, key) => {
              return e.id == d.item_id;
            });
            d.courseDetail = filter[0];
          });
        }
      }
      obj.coursesDeals = courseDeals.data;
    }

    let productDeals = await supabase
      .from("deals")
      .select("* , organizations(*)")
      .eq("type", "products")
      .eq("is_expire", "0")
      .limit(data?.limit || 6);
    if (productDeals.data && productDeals.data.length > 0) {
      let ids = _.map(productDeals.data, "item_id");
      if (ids && ids.length > 0) {
        let productFind = await supabase
          .from("products")
          .select("*")
          .in("id", ids);
        if (productFind.data && productFind.data.length > 0) {
          let productFindData = productFind.data;
          productDeals.data.map((d) => {
            let filter = productFindData.filter((e, key) => {
              return e.id == d.item_id;
            });
            d.productDetail = filter[0];
          });
        }
      }
      obj.productsDeals = productDeals.data;
    }
    let serviceDeals = await supabase
      .from("deals")
      .select("* , organizations(*)")
      .eq("type", "services")
      .eq("is_expire", "0")
      .limit(data?.limit || 6);
    if (serviceDeals.data && serviceDeals.data.length > 0) {
      let ids = _.map(serviceDeals.data, "item_id");
      if (ids && ids.length > 0) {
        let servicesFind = await supabase
          .from("directory_companies")
          .select("*")
          .in("id", ids);
        if (servicesFind.data && servicesFind.data.length > 0) {
          let servicesFindData = servicesFind.data;
          serviceDeals.data.map((d) => {
            let filter = servicesFindData.filter((e, key) => {
              return e.id == d.item_id;
            });
            d.serviceDetail = filter[0];
          });
        }
      }
      obj.servicesDeals = serviceDeals.data;
    }

    res.status(200).send({
      status: true,
      message: "Deals found",
      data: obj,
    });
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
