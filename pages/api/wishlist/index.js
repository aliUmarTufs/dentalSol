import _ from "lodash";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const getData = req.body;
    if (getData?.user_id) {
      let wishlist;
      let message;
      let wishListUsers;
      let obj = {
        user_id: getData?.user_id,
        item_id: getData?.item_id,
        is_like: true,
        type: getData?.type,
      };
      let checkExisting = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", obj?.user_id)
        .eq("item_id", obj?.item_id);

      if (checkExisting?.data && checkExisting?.data?.length > 0) {
        if (
          checkExisting?.data[0]?.is_like &&
          checkExisting?.data[0]?.is_like === true
        ) {
          console.log("TRUE CONDITION", checkExisting?.data[0]?.is_like);
          wishlist = await supabase
            .from("wishlist")
            .update({
              is_like: false,
            })
            .eq("user_id", obj?.user_id)
            .eq("item_id", obj?.item_id);
          if (wishlist.data && wishlist?.data?.length > 0) {
            message = "Item removed from wishlist";
          }
        } else {
          console.log("FALSE CONDITION", checkExisting?.data[0]?.is_like);

          wishlist = await supabase
            .from("wishlist")
            .update({
              is_like: true,
            })
            .eq("user_id", obj?.user_id)
            .eq("item_id", obj?.item_id);
          if (wishlist.data && wishlist?.data?.length > 0) {
            message = "Item added to wishlist";
          }
        }
      } else {
        wishlist = await supabase.from("wishlist").insert(obj);
        if (wishlist.data && wishlist?.data?.length > 0) {
          message = "Item added to wishlist";
        }
      }
      if (wishlist.data) {
        wishListUsers = await supabase
          .from("wishlist")
          .select("*")
          .eq("item_id", obj?.item_id)
          .eq("type", "deals")
          .eq("is_like", true);
        if (wishListUsers?.data) {
          let seletectedUsers = _.map(wishListUsers?.data, "user_id");
          let updateDealsFavUsers = await supabase
            .from("deals")
            .update({
              favUsers: seletectedUsers,
            })
            .eq("id", getData?.deal_id);
        }
        res.status(200).send({
          status: true,
          message: message,
          data: wishlist?.data,
        });
      } else {
        res.status(400).send({
          status: false,
          message: wishlist,
        });
      }
      //   if (getData?.is_like && getData?.is_like === true) {
      //     wishlist = await supabase
      //       .from("wishlist")
      //       .update({
      //         is_like: false,
      //       })
      //       .eq("user_id", obj?.user_id)
      //       .eq("item_id", obj?.item_id);
      //     if (wishlist.data) {
      //       res.status(200).send({
      //         status: true,
      //         message: "Item removed from wishlist",
      //         data: wishlist?.data,
      //       });
      //     }
      //   } else {
      //     wishlist = await supabase
      //       .from("wishlist")
      //       .update({
      //         is_like: true,
      //       })
      //       .eq("user_id", obj?.user_id)
      //       .eq("item_id", obj?.item_id);
      //   }
      //   if (wishlist?.data) {
      //     res.status(200).send({
      //       status: true,
      //       message: "User id is required.",
      //       data: wishlist?.data,
      //     });
      //   }
    } else {
      res.status(405).send({ status: false, message: "User id is required." });
    }
  } else {
    res
      .status(405)
      .send({ status: false, message: "Only POST requests allowed" });
  }
}
