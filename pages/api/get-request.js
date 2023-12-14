import { supabase } from "../../lib/supabaseClient";
import _ from "lodash";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const bodyData = req.body;
    if (bodyData.organization_id) {
      let getOrganization = await supabase
        .from("products")
        .select("*")
        .in("organization", [bodyData.organization_id]);
      if (getOrganization.data.length > 0) {
        let ids = _.map(getOrganization.data, "id");

        const submitInformation = await supabase
          .from("request_information")
          .select("*")
          .in("product_id", ids);
        if (submitInformation.error) {
          res.status(400).json({
            status: false,
            message: submitInformation.error.message,
          });
        } else {
          res.status(200).json({
            status: true,
            message: "Data Found.",
            data: submitInformation.data,
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "No data found",
          data: getOrganization.data,
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: "Organization id required",
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
