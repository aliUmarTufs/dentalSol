import _ from "lodash";
import { supabase } from "../../../../lib/supabaseClient";
import { deleteItemInfo, refreshToken } from "../../../../zoho";

export default async function handler(req, res) {
	const refreshTokenFunc = await refreshToken();
	if (req.method === "POST") {
		const getData = req.body;
		if (getData?.entity_type) {
			let itemDelete;
			let obj;
			switch (getData?.entity_type) {
				case "courses":
					itemDelete = await supabase
						.from("courses")
						.delete()
						.eq("id", getData?.id);

					break;
				case "products":
					itemDelete = await supabase
						.from("products")
						.delete()
						.eq("id", getData?.id);

					break;
				case "services":
					itemDelete = await supabase
						.from("directory_companies")
						.delete()
						.eq("id", getData?.id);
					break;
				case "articles":
					itemDelete = await supabase
						.from("articles")
						.delete()
						.eq("id", getData?.id);
					break;

				default:
					break;
			}
			if (itemDelete && itemDelete?.data && itemDelete?.data?.length > 0) {
				let zohoItemID = itemDelete?.data[0]?.item_zoho_id;
				if (zohoItemID) {
					await deleteItemInfo(refreshTokenFunc, zohoItemID);
				}
				res.status(200).send({
					status: true,
					message: "Item Delete",
					data: itemDelete?.data[0],
				});
			} else {
				res.status(400).send({
					status: false,
					message: "Error Occured",
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
