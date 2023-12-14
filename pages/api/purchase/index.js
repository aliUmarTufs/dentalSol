import _ from "lodash";
import moment from "moment";
import { DATE_FORMAT_ONE } from "../../../constants";
import { supabase } from "../../../lib/supabaseClient";
import { createOrder, refreshToken, updateCustomerInfo } from "../../../zoho";

export default async function handler(req, res) {
	const refreshTokenFunc = await refreshToken();
	if (req.method === "POST") {
		try {
			const getData = req.body;
			let userInfoObj;
			if (getData?.items) {
				let getUser = await supabase
					.from("users")
					.select("*")
					.eq("id", getData?.buyer_id);
				if (getUser?.data && getUser?.data?.length > 0) {
					userInfoObj = {
						id: getUser?.data[0]?.vendor_zoho_id,
						contact_name: getData?.user_details?.name,
						contact_type: "customer",
						billing_address: {
							attention: getData?.user_details?.name,
							address: getData?.user_details?.address,
							street2: getData?.user_details?.street2,
							city: getData?.user_details?.city,
							state: getData?.user_details?.state,
							zip: getData?.user_details?.zip_code,
							country: getData?.user_details?.country,
							fax: getData?.user_details?.phoneNumber,
							phone: getData?.user_details?.phoneNumber,
						},
						shipping_address: {
							attention: getData?.user_details?.name,
							address: getData?.user_details?.address,
							street2: getData?.user_details?.street2,
							city: getData?.user_details?.city,
							state: getData?.user_details?.state,
							zip: getData?.user_details?.zip_code,
							country: getData?.user_details?.country,
							fax: getData?.user_details?.phoneNumber,
							phone: getData?.user_details?.phoneNumber,
						},
					};
					if (getUser?.data[0]?.vendor_zoho_id) {
						let purchaseZOhoUser = await updateCustomerInfo(
							refreshTokenFunc,
							userInfoObj,
							getUser?.data[0]?.vendor_zoho_id
						);
						console.log({ purchaseZOhoUser });
					}
					if (getData?.items && getData?.items?.length > 0) {
						let zohoItemArr = [];
						let arr = [];

						getData?.items?.map((e) => {
							zohoItemArr.push({
								item_id: e?.item_zoho_id,
							});
							arr.push({ name: e?.title, images: [e?.image], price: e?.price });
						});
						let app_amount = parseFloat(
							(getData?.total_price / 100) * 5
						).toFixed(2);
						let obj = {
							buyer_id: getData?.buyer_id,
							items_id: JSON.stringify(getData?.items),
							total_price: getData?.total_price,
							organization_id: getData?.organization_id,
							app_amount: app_amount,
							revenue: parseFloat(getData?.total_price - app_amount).toFixed(2),
							is_deal: getData?.is_deal,
						};

						let purchaseRecordCreate = await supabase
							.from("purchases")
							.insert(obj);
						if (
							purchaseRecordCreate?.data &&
							purchaseRecordCreate?.data?.length > 0
						) {
							// let vendorObj = {
							//   Vendor_Name: getData?.name,
							//   Email: getData?.email,
							//   Street: getData?.practiceAddress,
							//   Phone: getData?.phoneNumber,
							//   State: getData?.state,
							//   City: getData?.city,
							//   Zip_Code: getData?.zip_code,
							//   Country: getData?.country,
							//   Description: getData?.short_bio,
							// };
							console.log({ zohoItemArr });
							let orderObj = {
								customer_id: getUser?.data[0]?.vendor_zoho_id,
								// customer_id: "338389000002314045",
								date: moment(new Date()).format(DATE_FORMAT_ONE),
								line_items: zohoItemArr,
								notes: getData?.user_details?.addInfo ?? "",
								terms: "",
							};

							await createOrder(refreshTokenFunc, orderObj);
							res.status(200).send({
								status: true,
								message: "Order has been placed successfully.",
							});
						} else {
							res.status(400).send({
								status: false,
								message: "Error while placing order. Please try again later.",
							});
						}
					} else {
						res.status(400).send({
							status: false,
							message: "There should be 1 item required.",
						});
					}
				} else {
					res.status(400).send({
						status: false,
						message: getUser?.error?.message,
					});
				}
			} else {
				res.status(400).send({
					status: false,
					message: "Items are required",
				});
			}
		} catch (error) {
			res.status(400).send({
				status: false,
				message: error?.message,
			});
		}
	} else {
		res.status(405).send({ message: "Only POST requests allowed" });
	}
}
