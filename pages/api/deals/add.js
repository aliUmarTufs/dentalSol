import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
	if (req.method === "POST") {
		try {
			const data = req.body;
			if (data?.item_id && data?.organization_id) {
				var todayDate = new Date().toISOString().slice(0, 10);
				let existingItemDeal = await supabase
					.from("deals")
					.select("*")
					.eq("item_id", data?.item_id)
					.eq("is_expire", 0);
				if (existingItemDeal.data && existingItemDeal.data.length < 0) {
					res.status(400).send({
						status: false,
						message: "Item is already listed as deals",
					});
				} else {
					const obj = {
						vendor_id: data?.user_id,
						expiry_data: data?.expiry_date,
						location: data?.location,
						net_savings: data?.net_savings,
						coupon_code: data?.coupon_code,
						exclusive: data?.exclusive,
						item_id: data?.item_id,
						type: data?.type,
						deal_type: data?.deal_type,
						quantity: data?.quantity,
						item_quantity: data?.item_quantity,
						free_quantity: data?.free_quantity,
						organization_id: data?.organization_id,
					};

					let dealsData = await supabase.from("deals").insert(obj);
					if (dealsData.data && dealsData.data.length > 0) {
						res.status(200).send({
							status: true,
							message: "Deals have been added",
							data: dealsData?.data[0],
						});
					} else {
						res.status(400).send({
							status: false,
							message: dealsData.error.message,
						});
					}
				}
			} else {
				res.status(400).send({
					status: false,
					message: "Item id or User id is required.",
				});
			}
		} catch (err) {
			res.status(400).send({
				status: false,
				message: err.message,
			});
		}
	} else {
		res.status(405).send({ message: "Only POST requests allowed" });
	}
}
