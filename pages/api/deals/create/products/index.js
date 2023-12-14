import _ from "lodash";
import { supabase } from "../../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getBody = req.body;
    if (getBody?.organization_id) {
      let organizations = await supabase
        .from("organizations")
        .select("*")
        .eq("id", getBody?.organization_id);
      if (organizations?.data && organizations?.data?.length > 0) {
        if (organizations?.data[0]?.organization_type == "course_provider") {
          let getitem = await supabase
            .from("courses")
            .select("*")
            .eq("is_approved", 1)
            .eq("is_blocked", 0)
            .eq("organization", getBody?.organization_id);
          if (getitem?.data && getitem?.data?.length > 0) {
            res.status(200).send({
              status: true,
              message: "Organizations Found",
              data: getitem?.data,
            });
          } else {
            res.status(200).send({
              status: true,
              message: "No Products Found",
              data: [],
            });
          }
        } else if (
          organizations?.data[0]?.organization_type == "product_provider"
        ) {
          let getitem = await supabase
            .from("products")
            .select("*")
            .eq("is_approved", 1)
            .eq("is_blocked", 0)
            .eq("organization", getBody?.organization_id);
          if (getitem?.data && getitem?.data?.length > 0) {
            res.status(200).send({
              status: true,
              message: "Organizations Found",
              data: getitem?.data,
            });
          } else {
            res.status(200).send({
              status: true,
              message: "No Products Found",
              data: [],
            });
          }
        } else if (
          organizations?.data[0]?.organization_type == "service_provider"
        ) {
          let getitem = await supabase
            .from("directory_companies")
            .select("* , company(*) , directory_frontend_categories(*) ")
            .eq("is_approved", 1)
            .eq("is_blocked", 0)
            .eq("company", getBody?.organization_id);
          if (getitem?.data && getitem?.data?.length > 0) {
            res.status(200).send({
              status: true,
              message: "Organizations Found",
              data: getitem?.data,
            });
          } else {
            res.status(200).send({
              status: true,
              message: "No Services Found",
              data: [],
            });
          }
        } else {
          res.status(200).send({
            status: false,
            message: "No Type Found",
            data: [],
          });
        }
        // else if (
        //     organizations?.data[0]?.organization_type == "service_providers"
        //   ) {
        //     let getitem = await supabase
        //       .from("products")
        //       .select("*")
        //       .in("organization", getBody?.organization_id);
        //     if (getitem?.data && getitem?.data?.length > 0) {
        //       res.status(200).send({
        //         status: true,
        //         message: "Organizations Found",
        //         data: getitem?.data,
        //       });
        //     }
        //   }
      } else {
        res.status(400).send({
          status: false,
          message: "No Organizations Found",
        });
      }
    } else {
      res.status(400).send({
        status: false,
        message: "Organization id is required.",
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
