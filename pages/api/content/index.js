import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const getData = req.query;
    if (getData?.type) {
      let getContentPageData = await supabase
        .from("legal")
        .select("*")
        .eq("type", getData?.type)
        .order("created_at", { ascending: true });
      if (getContentPageData?.data) {
        if (getContentPageData?.data?.length > 0) {
          res.status(200).send({
            status: true,
            message: "Content Found",
            data: getContentPageData?.data[0],
          });
        } else {
          res.status(200).send({
            status: true,
            message: "Content Found",
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: getContentPageData?.error?.message,
        });
      }
    } else {
      res.status(400).send({
        status: false,
        message: "Type is required.",
      });
    }
  } else {
    res.status(405).send({ message: "Only GET requests allowed" });
  }
}
