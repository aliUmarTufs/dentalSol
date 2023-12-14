import prisma from "../../../lib/prismaClient";
import { supabase, supabase_admin_secret } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      let data = {
        categories: [],
        services: [],
      };
      let categories_ = await supabase.from("vendor_categories").select("*");
      let services_list_ = await supabase.from("services_list").select("*");

      if (categories_?.data && services_list_?.data) {
        data.categories = categories_?.data;
        data.services = services_list_?.data;
        res.status(200).send({
          status: true,
          message: "Data Found.",
          data: data,
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
        message: error?.message,
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
