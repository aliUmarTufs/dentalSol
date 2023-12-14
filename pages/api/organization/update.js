import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    if (getData?.organization_id && getData?.user_id) {
      let obj = {
        name: getData?.organization_name,
        url: getData?.url,
      };
      let checkIfSameExist = await supabase
        .from("organizations")
        .select("*")
        .eq("name", obj?.name)
        .not("id", "in", `(${getData?.org_id})`)
        .eq("organization_type", getData?.organization_type);
      if (checkIfSameExist.data && checkIfSameExist?.data?.length > 0) {
        res.status(400).send({
          status: false,
          message: "Organization with same name is already created",
        });
      } else {
        let updateOrganization = await supabase
          .from("organizations")
          .update(obj)
          .eq("id", getData?.organization_id);
        if (updateOrganization?.data && updateOrganization?.data?.length > 0) {
          res.status(200).send({
            status: true,
            message: "Organization has been updated",
            data: updateOrganization?.data[0],
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
