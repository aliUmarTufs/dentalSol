import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const bodyData = req.body;

    let productReview = await supabase
      .from("reviews")
      .select("* , users ( id , user_name , user_email, image , username )")
      .in("related_id", [bodyData.related_id])
      .limit(6)
      .order("created_at", { ascending: false });

    if (productReview.data) {
      let ratingAvg = 0;
      let arr = [];
      let arrObj = [];
      productReview.data.map((data) => {
        ratingAvg = ratingAvg + parseFloat(data.stars);
        if (arr.includes(data.stars)) {
          let changeArr = arrObj.filter((e) => {
            if (e.star == data.stars) {
              e.count = e.count + 1;
            }
            return e;
          });
        } else {
          arr.push(data.stars);
          arrObj.push({
            count: 1,
            star: data.stars,
          });
        }
      });
      let obj = {
        reviewStarListing: arrObj,
        average: ratingAvg / productReview.data.length,
        totalRecords: productReview.data.length,
        list: productReview.data,
      };
      //   productReview.listing.average = ratingAvg / productReview.data.length;
      //   productReview.listing.list = productReview.data;
      //   productReview.data.average = ratingAvg / productReview.data.length;
      //   productReview.data.list = productReview.data;
      //   productReview.data.uniqueItem = productReview.data.map(())

      res.status(200).send({
        status: true,
        message: "Reviews Found",
        data: obj,
      });
    } else {
      res.status(400).send({
        status: false,
        message: productReview.error.message,
      });
    }
  } else {
    res.status(405).send({ message: "Only POST requests allowed" });
  }
}
