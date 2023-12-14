import { supabase } from "../../../lib/supabaseClient";
import _ from "lodash";

export default async function handler(req, res) {
  if (req.method === "GET") {
    let getSubscriptions = await supabase
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: true });
    if (getSubscriptions?.data) {
      let getSubscriptionsPlans = await supabase
        .from("subscription_plan_price")
        .select("*")
        .eq("is_deleted", 0);
      getSubscriptions?.data?.map((d) => {
        d.items = _.filter(getSubscriptionsPlans?.data, (e) => {
          return d?.id == e?.subscription_id;
        });
      });
      res.status(200).send({
        status: true,
        message: "Subscriptions Found",
        data: getSubscriptions?.data,
      });
    } else {
      res.status(400).send({
        status: false,
        message: getSubscriptions?.error?.message,
      });
    }
  } else {
    res.status(405).send({ message: "Only GET requests allowed" });
  }
}
