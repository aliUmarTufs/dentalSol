import { supabase } from "../../../../lib/supabaseClient";
import _ from "lodash";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const getBody = req.query;
    if (getBody?.user_id) {
      let organizations;
      if (getBody?.isAdmin && getBody?.isAdmin == 1) {
        organizations = await supabase
          .from("organizations")
          .select("*")
          .order("created_at", { ascending: false });
      } else {
        organizations = await supabase
          .from("organizations")
          .select("*")
          .eq("organization_user", getBody?.user_id);
      }

      if (organizations?.data && organizations?.data?.length > 0) {
        let ids = _.map(organizations?.data, "id");
        let getProducts = await supabase
          .from("products")
          .select("*")
          .in("organization", ids);
        if (getProducts?.data) {
          organizations?.data?.map((d) => {
            let filter = getProducts?.data?.filter((e) => {
              return d?.id == e?.organization;
            });
            d.products = filter;
          });
        }
        res.status(200).send({
          status: true,
          message: "Organizations Found",
          data: organizations?.data,
        });
      } else {
        res.status(400).send({
          status: false,
          message: "No Organizations Found",
        });
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
