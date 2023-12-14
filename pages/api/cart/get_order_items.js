import _ from "lodash";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const getData = req.body;

		let getOrganizationsOfUsers;
		if (getData?.items && getData?.items?.length > 0) {
			let itemDetails;
			let itemDetailCount;
			let itemArr = [];
			let subscriptionEntity = 1;
			for (let index = 0; index < getData?.items?.length; index++) {
				switch (getData?.items[index]?.item_type) {
					case "courses":
						itemDetails = await supabase
							.from("courses")
							.select("*")
							.eq("id", getData?.items[index]?.id);

						break;
					case "products":
						itemDetails = await supabase
							.from("products")
							.select("*")
							.eq("id", getData?.items[index]?.id);

						break;
					case "services":
						itemDetails = await supabase
							.from("directory_companies")
							.select("*")
							.eq("id", getData?.items[index]?.id);

					case "articles":
						itemDetails = await supabase
							.from("articles")
							.select("*")
							.eq("id", getData?.items[index]?.id);

						break;

					default:
						break;
				}

				if (itemDetails && itemDetails?.data) {
					let checkDeal = await supabase
						.from("deals")
						.select("*")
						.eq("item_id", getData?.items[index]?.id)
						.eq("is_expire", 0);
					if (checkDeal?.data && checkDeal?.data?.length > 0) {
						itemDetails.data[0].is_deal = true;
						itemDetails.data[0].dealDetail = checkDeal?.data[0];
						if (checkDeal?.data[0]?.deal_type == "free_item") {
							itemDetails.data[0].item_price = parseFloat(
								parseInt(checkDeal?.data[0]?.item_quantity) *
									parseInt(
										itemDetails?.data[0]?.price || itemDetails?.data[0]?.Price
									)
							).toFixed();
						} else if (checkDeal?.data[0]?.deal_type == "discounted") {
							var dealPriceDiscount = checkDeal?.data[0]?.quantity / 100;
							let ePrice =
								itemDetails?.data[0]?.price || itemDetails?.data[0]?.Price;

							var priceAfterDiscount = parseFloat(
								ePrice - ePrice * dealPriceDiscount
							).toFixed(2);

							console.log(+priceAfterDiscount);

							itemDetails.data[0].item_price = +priceAfterDiscount;
						} else {
							itemDetails.data[0].item_price =
								itemDetails?.data[0]?.price || itemDetails?.data[0]?.Price;
						}
					} else {
						itemDetails.data[0].item_price =
							itemDetails?.data[0]?.price || itemDetails?.data[0]?.Price;
						itemDetails.data[0].is_deal = false;
						itemDetails.data[0].dealDetail = {};
					}
					let itemObj = {
						id: itemDetails?.data[0]?.id,
						is_deal: itemDetails?.data[0]?.is_deal,
						item_type: getData?.items[index]?.item_type,
						price: itemDetails?.data[0]?.item_price,
						unit: checkDeal?.data[0]?.item_quantity,
						organization_id:
							itemDetails?.data[0]?.organization_id ||
							itemDetails?.data[0]?.organization ||
							itemDetails?.data[0]?.company,
						title:
							itemDetails?.data[0]?.title ||
							itemDetails?.data[0]?.name ||
							itemDetails?.data[0]?.company_name,
						item_zoho_id: itemDetails?.data[0]?.item_zoho_id,
					};
					itemArr.push(itemObj);
					// console.log({ itemObj });
				}
			}

			if (itemArr && itemArr?.length > 0) {
				let totalPrice = _.sumBy(itemArr, (o) => {
					return o?.price;
				});

				res.status(200).send({
					status: true,
					message: "Data Found",
					data: {
						data: itemArr,
						totalPrice: totalPrice,
						subTotal: totalPrice,
					},
				});
			} else {
				res.status(400).send({
					status: false,
					message: "Items Not Found",
				});
			}
		} else {
			res.status(400).send({
				status: false,
				message: "Type required",
			});
		}
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
}
