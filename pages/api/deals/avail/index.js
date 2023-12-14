import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      let getData = req.body;
      let obj = {
        user_id: getData?.user_id,
        deal_id: getData?.deal_id,
        item_id: getData?.deal_id,
        type: "deals",
      };
      let checkIfAlreadyDealAvail = await supabase
        .from("avail_deal_users")
        .select("*")
        .eq("user_id", getData?.user_id)
        .eq("deal_id", getData?.deal_id);
      if (
        checkIfAlreadyDealAvail?.data &&
        checkIfAlreadyDealAvail?.data?.length > 0
      ) {
        res.status(400).send({
          status: false,
          message: "You have already avail this deal.",
        });
      } else {
        let checkIfUserisVendor = await supabase
          .from("deals")
          .select("*, organizations(*)")
          .eq("id", getData?.deal_id);
        if (
          checkIfUserisVendor?.data &&
          checkIfUserisVendor?.data?.length > 0
        ) {
          console.log(checkIfUserisVendor?.data);
          if (
            checkIfUserisVendor?.data[0]?.organizations?.organization_user ===
            getData?.user_id
          ) {
            res.status(400).send({
              status: false,
              message: "You can not avail your deal.",
            });
          } else {
            let checkIfUserIsAdmin = await supabase
              .from("users")
              .select("*")
              .eq("id", getData?.user_id)
              .eq("role_type", "Admin");
            if (
              checkIfUserIsAdmin?.data &&
              checkIfUserIsAdmin?.data?.length > 0
            ) {
              res.status(400).send({
                status: false,
                message: "Admin can not avail this deal",
              });
            } else {
              let dealUser = await supabase
                .from("avail_deal_users")
                .insert(obj);
              if (dealUser?.data && dealUser?.data?.length > 0) {
                res.status(200).send({
                  status: true,
                  message: "Deal Avail successfully",
                  data: dealUser?.data[0],
                });
              } else {
                res.status(400).send({
                  status: false,
                  message: "Error occured while avail deal.",
                });
              }
            }
          }
        } else {
          res.status(400).send({
            status: false,
            message: "Deal Error.",
          });
        }
      }
    } catch (err) {
      res.status(400).send({
        status: false,
        message: err.message,
      });
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
