import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    if (getData?.organization_name && getData?.user_id) {
      let obj = {
        organization_user: getData?.user_id,
        name: getData?.organization_name,
        organization_type: getData?.organization_type,
        url: getData?.url,
      };

      let checkIfSameExist = await supabase
        .from("organizations")
        .select("*")
        .eq("name", obj?.name)
        .eq("organization_type", obj?.organization_type);
      if (checkIfSameExist.data && checkIfSameExist?.data?.length > 0) {
        res.status(400).send({
          status: false,
          message: "Organization with same name is already created",
        });
      } else {
        let createOrganization = await supabase
          .from("organizations")
          .insert(obj);
        if (createOrganization?.data && createOrganization?.data?.length > 0) {
          res.status(200).send({
            status: true,
            message: "Organization has been created",
            data: createOrganization?.data[0],
          });
        } else {
          res.status(400).send({
            status: false,
            message: "Error Occured",
          });
        }
      }
    } else {
      res.status(400).send({
        status: false,
        message: "Organization name is required.",
        data: getData,
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
