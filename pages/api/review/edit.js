import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let productReview = await supabase
      .from("reviews")
      .update({
        stars: req.body.stars,
        review: req.body.review,
      })
      .match({
        id: req.body.id,
      });
    if (productReview.data) {
      res.status(200).send({
        status: true,
        message: "Review updated successfully",
        data: productReview?.data,
      });
    } else {
      res.status(400).send({
        status: false,
        message: productReview?.error?.message,
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
