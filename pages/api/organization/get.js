import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const getData = req.query;
    if (getData?.user_id) {
      let getOrganization;
      let getOrganizationCount;
      let checkIfUserisAdmin = await supabase
        .from("users")
        .select("*")
        .eq("id", getData?.user_id)
        .eq("role_type", "Admin");
      if (checkIfUserisAdmin?.data && checkIfUserisAdmin?.data?.length > 0) {
        getOrganization = await supabase
          .from("organizations")
          .select("* , organization_user(*)")
          .order("created_at", { ascending: false })
          .range(getData?.offset, getData?.offset + 5);
        getOrganizationCount = await supabase
          .from("organizations")
          .select("* , organization_user(*)");
      } else {
        getOrganization = await supabase
          .from("organizations")
          .select("*")
          .eq("organization_user", getData?.user_id)
          .order("created_at", { ascending: false })
          .range(getData?.offset, getData?.offset + 5);

        getOrganizationCount = await supabase
          .from("organizations")
          .select("*")
          .eq("organization_user", getData?.user_id);
      }
      if (getOrganization?.data) {
        if (getOrganization?.data?.length > 0) {
          res.status(200).send({
            status: true,
            message: "Organization Listed",
            data: getOrganization?.data,
            offset: parseInt(getData?.offset) + 5,
            totalcount: getOrganizationCount?.data?.length,
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
        message: "User id is required.",
      });
    }
  } else {
    res.status(405).send({ message: "Only GET requests allowed" });
  }
}
