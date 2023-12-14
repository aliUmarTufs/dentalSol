import _ from "lodash";
import { supabase } from "../../../../lib/supabaseClient";
import { createItemInfo, refreshToken } from "../../../../zoho";

export default async function handler(req, res) {
	const refreshTokenFunc = await refreshToken();
	if (req.method === "POST") {
		const getData = req.body;
		if (getData?.entity_type) {
			let allItemsObj;
			let itemCreate;
			let obj;
			let entryAllowed = 1;
			let checkItem;
			let entryRestrict = false;
			let getUserDetail = await supabase
				.from("users")
				.select("* ,user_city(*), subscription_id(*) , plan_id(*) ")
				.eq("id", getData?.user_id);
			if (getUserDetail?.data && getUserDetail?.data?.length > 0) {
				if (getUserDetail?.data[0]?.subscription_id?.subscription_entry) {
					entryAllowed =
						getUserDetail?.data[0]?.subscription_id?.subscription_entry;
				}
				switch (getData?.entity_type) {
					case "courses":
						obj = {
							title: getData?.title,
							short_description: getData?.short_description,
							long_description: getData?.long_description,
							category: getData?.category,
							category_filters: getData?.category_filters,
							organization: getData?.organization,
							Price: getData?.Price,
							date: getData?.date,
							buyable: getData?.buyable,
							city: getData?.city,
							teachers: getData?.teachers,
							CE: getData?.CE ? getData?.CE : null,
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
							status: getData?.is_approved,
						};

						checkItem = await supabase
							.from("courses")
							.select("*")
							.eq("organization", getData?.organization);
						if (checkItem?.data && checkItem?.data?.length < entryAllowed) {
							itemCreate = await supabase.from("courses").insert(obj);
						} else {
							entryRestrict = true;
						}

						break;
					case "products":
						obj = {
							name: getData?.name,
							short_description: getData?.short_description,
							long_description: getData?.long_description,
							thumbnail: getData?.thumbnail,
							category: getData?.category,
							organization: getData?.organization,
							price: getData?.price,
						};

						allItemsObj = {
							name: getData?.name,
							rate: getData?.price,
							purchase_rate: getData?.price,
							description: getData?.short_description,
							product_type: "goods",
							status: getData?.is_approved,
						};

						checkItem = await supabase
							.from("products")
							.select("*")
							.eq("organization", getData?.organization);
						if (checkItem?.data && checkItem?.data?.length < entryAllowed) {
							itemCreate = await supabase.from("products").insert(obj);
						} else {
							entryRestrict = true;
						}
						break;
					case "services":
						obj = {
							company: getData?.company_id,
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
							status: getData?.is_approved,
						};
						let idNumber;
						let counterNumber = await supabase
							.from("directory_companies")
							.select("*")
							.order("id", { ascending: false })
							.limit(1);
						if (counterNumber?.data && counterNumber?.data?.length > 0) {
							idNumber = parseInt(counterNumber?.data[0]?.id) + 1;
							obj.id = idNumber;
						} else {
							res.status(400).send({
								status: false,
								message: "Error Occured",
							});
						}

						checkItem = await supabase
							.from("directory_companies")
							.select("*")
							.eq("company", getData?.company_id);
						if (checkItem?.data && checkItem?.data?.length < entryAllowed) {
							itemCreate = await supabase
								.from("directory_companies")
								.insert(obj);
						} else {
							entryRestrict = true;
						}
						break;

					case "articles":
						obj = {
							title: getData?.title,
							description: getData.description,
							article_body: getData?.article_body,
							user_id: getData?.user_id,
							organization_id: getData?.organization_id,
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
							status: getData?.is_approved,
						};
						checkItem = await supabase
							.from("articles")
							.select("*")
							.eq("organization_id", getData?.organization_id);
						if (checkItem?.data && checkItem?.data?.length < entryAllowed) {
							itemCreate = await supabase.from("articles").insert(obj);
						} else {
							entryRestrict = true;
						}

						break;

					default:
						break;
				}
				if (entryRestrict) {
					res.status(400).send({
						status: false,
						message: `You can not create more than entry mentioned in you plan`,
					});
				} else {
					if (itemCreate && itemCreate?.data && itemCreate?.data?.length > 0) {
						let zohoItem = await createItemInfo(refreshTokenFunc, allItemsObj);
						switch (getData?.entity_type) {
							case "courses":
								await supabase
									.from("courses")
									.update({
										item_zoho_id: zohoItem?.item?.item_id,
									})
									.eq("id", itemCreate?.data[0]?.id);
								break;

							case "products":
								await supabase
									.from("products")
									.update({
										item_zoho_id: zohoItem?.item?.item_id,
									})
									.eq("id", itemCreate?.data[0]?.id);
								break;
							case "services":
								await supabase
									.from("directory_companies")
									.update({
										item_zoho_id: zohoItem?.item?.item_id,
									})
									.eq("id", itemCreate?.data[0]?.id);
								break;
							case "articles":
								await supabase
									.from("articles")
									.update({
										item_zoho_id: zohoItem?.item?.item_id,
									})
									.eq("id", itemCreate?.data[0]?.id);
								break;
							default:
								break;
						}

						res.status(200).send({
							status: true,
							message: "Item created successfully.",
							data: itemCreate?.data[0],
						});
					} else {
						res.status(400).send({
							status: false,
							message: `Error Occured ${itemCreate?.error?.message}`,
						});
					}
				}
			} else {
				res.status(400).send({
					status: false,
					message: `Error Occured ${getUserDetail?.error?.message}`,
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
