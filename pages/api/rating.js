import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const bodyData = req.body;
		if (bodyData.id) {
			let obj = {
				stars: bodyData.stars,
				review: bodyData.review,
			};

			const updateReview = await supabase.from("reviews").update(obj).match({
				id: bodyData.id,
			});
			if (updateReview.error) {
				res.status(400).json({
					status: false,
					message: updateReview.error.message,
				});
			} else {
				res.status(200).json({
					status: true,
					message: "Review Updated Successfully.",
					data: updateReview.data,
				});
			}
		} else {
			let checkExistingReview = await supabase
				.from("reviews")
				.select("*")
				.eq("user_id", bodyData.user_id)
				.eq("related_id", bodyData.related_id);

			if (checkExistingReview?.data?.length > 0) {
				return res.status(400).json({
					status: false,
					message: "You have already submitted your review.",
				});
			} else {
				let checkIfUserIsVendorIsTrue = false;
				if (bodyData?.type == "courses") {
					let checkIfUserIsVendor = await supabase
						.from("courses")
						.select("* , organization(*)")
						.eq("id", bodyData?.related_id);
					if (
						checkIfUserIsVendor?.data &&
						checkIfUserIsVendor?.data?.length > 0
					) {
						if (checkIfUserIsVendor?.data[0]?.organization?.organization_user) {
							if (
								checkIfUserIsVendor?.data[0]?.organization?.organization_user ==
								bodyData?.user_id
							) {
								// res.status(400).json({
								//   status: false,
								//   message: "You can not review your item",
								// });
								checkIfUserIsVendorIsTrue = true;
							}
						}
					}
				} else if (bodyData?.type == "products") {
					let checkIfUserIsVendor = await supabase
						.from("products")
						.select("* , organization(*)")
						.eq("id", bodyData?.related_id);
					if (
						checkIfUserIsVendor?.data &&
						checkIfUserIsVendor?.data?.length > 0
					) {
						if (checkIfUserIsVendor?.data[0]?.organization?.organization_user) {
							if (
								checkIfUserIsVendor?.data[0]?.organization?.organization_user ==
								bodyData?.user_id
							) {
								// res.status(400).json({
								//   status: false,
								//   message: "You can not review your item",
								// });
								checkIfUserIsVendorIsTrue = true;
							}
						}
					}
				}

				let obj = {
					stars: bodyData.stars,
					review: bodyData.review,
					user_id: bodyData.user_id,
					related_id: bodyData.related_id,
					type: bodyData.type,
				};
				if (checkIfUserIsVendorIsTrue) {
					res.status(400).json({
						status: false,
						message: "You can not review your item",
					});
				} else {
					const submitReview = await supabase.from("reviews").insert(obj);
					if (submitReview.error) {
						res.status(400).json({
							status: false,
							message: submitReview.error.message,
						});
					} else {
						res.status(200).json({
							status: true,
							message: "Review Added.",
							data: submitReview.data,
						});
					}
				}
			}
		}
	} else {
		res.status(405).send({ message: "Only POST requests allowed" });
	}
}
