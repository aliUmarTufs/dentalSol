import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    if (getData?.organization_id) {
      let getOrganization;

      getOrganization = await supabase
        .from("organizations")
        .select("*")
        .eq("id", getData?.organization_id);

      if (getOrganization?.data) {
        if (getOrganization?.data?.length > 0) {
          res.status(200).send({
            status: true,
            message: "Organization Listed",
            data: getOrganization?.data[0],
          });
        } else {
          res.status(200).send({
            status: true,
            message: "No Organization Listed",
            data: getOrganization?.data,
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: getOrganization?.error?.message,
        });
      }
    } else {
      res.status(400).send({
        status: false,
        message: "Organization is required.",
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
