import _ from "lodash";
import { supabase } from "../../../../lib/supabaseClient";
import { refreshToken, updateItemInfo } from "../../../../zoho";

export default async function handler(req, res) {
	const refreshTokenFunc = await refreshToken();
	if (req.method === "POST") {
		const getData = req.body;
		if (getData?.entity_type) {
			let allItemsObj;
			let itemUpdate;
			let obj;
			switch (getData?.entity_type) {
				case "courses":
					obj = {
						title: getData?.title,
						short_description: getData?.short_description,
						long_description: getData?.long_description,
						category: getData?.category,
						category_filters: getData?.category_filters,
						Price: getData?.Price,
						date: getData?.date,
						buyable: getData?.buyable,
						city: getData?.city,
						teachers: getData?.teachers,
						CE: getData?.CE,
						course_mode: getData?.course_mode,
						video: getData?.video,
						provider_link: getData?.provider_link,
						price_mode: parseInt(getData?.Price) > 0 ? "Paid" : "Free",
					};
					allItemsObj = {
						name: getData?.title,
						rate: getData?.Price,
						purchase_rate: getData?.Price,
						description: getData?.short_description,
						product_type: "service",
						status:
							itemUpdate?.data[0]?.is_approved === 1 ? "active" : "inactive",
					};
					itemUpdate = await supabase
						.from("courses")
						.update(obj)
						.eq("id", getData?.id);

					break;
				case "products":
					obj = {
						name: getData?.name,
						short_description: getData?.short_description,
						long_description: getData?.long_description,
						thumbnail: getData?.thumbnail,
						category: getData?.category,
						price: getData?.price,
					};
					allItemsObj = {
						name: getData?.name,
						rate: getData?.price,
						purchase_rate: getData?.price,
						description: getData?.short_description,
						product_type: "goods",
						status:
							itemUpdate?.data[0]?.is_approved === 1 ? "active" : "inactive",
					};

					itemUpdate = await supabase
						.from("products")
						.update(obj)
						.eq("id", getData?.id);

					break;
				case "services":
					obj = {
						short_description: getData?.short_description,
						long_description: getData?.long_description,
						logo: getData?.logo,
						contact_email: getData?.contact_email,
						contact_phone: getData?.contact_phone,
						website: getData?.website,
						category: getData?.category,
						attrs: getData?.attrs,
						company_name: getData?.company_name,
					};
					allItemsObj = {
						name: getData?.company_name,
						rate: getData?.price ?? 0,
						purchase_rate: getData?.price ?? 0,
						description: getData?.short_description,
						product_type: "service",
						status:
							itemUpdate?.data[0]?.is_approved === 1 ? "active" : "inactive",
					};
					itemUpdate = await supabase
						.from("directory_companies")
						.update(obj)
						.eq("id", getData?.id);
					break;
				case "articles":
					obj = {
						title: getData?.title,
						description: getData.description,
						article_body: getData?.article_body,
						thumbnail: getData?.thumbnail,
						hero_image: getData?.thumbnail,
						category_id: getData?.category_id,
						category_filter_id: getData?.category_filter_id,
					};
					allItemsObj = {
						name: getData?.title,
						rate: getData?.price ?? 0,
						purchase_rate: getData?.price ?? 0,
						description: getData?.description,
						product_type: "service",
						status:
							itemUpdate?.data[0]?.is_approved === 1 ? "active" : "inactive",
					};
					itemUpdate = await supabase
						.from("articles")
						.update(obj)
						.eq("id", getData?.id);
					break;
				default:
					break;
			}
			if (itemUpdate && itemUpdate?.data && itemUpdate?.data?.length > 0) {
				let zohoItemID = itemUpdate?.data[0]?.item_zoho_id;

				await updateItemInfo(refreshTokenFunc, zohoItemID, allItemsObj);
				res.status(200).send({
					status: true,
					message: "Item updated successfully.",
					data: itemUpdate?.data[0],
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
