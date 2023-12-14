import _ from "lodash";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const getData = req.body;
		if (getData?.entity_type) {
			let itemDetails;
			switch (getData?.entity_type) {
				case "courses":
					itemDetails = await supabase
						.from("courses")
						.select(
							"* , organizations(*) , cities(*) , course_categories(*) , course_mode(*)"
						)
						.eq("id", getData?.id);
					itemDetails?.data?.map((e) => {
						e.organization_data = e?.organizations;
						e.mode = e?.course_mode;
						e.category_filters = { name: e?.category_filters };
					});
					if (itemDetails?.data?.length > 0) {
						let getUsers = await supabase
							.from("users")
							.select("*")
							.in("id", itemDetails?.data[0]?.teachers);
						if (getUsers?.data && getUsers?.data?.length > 0) {
							itemDetails.data[0].teachers_data = getUsers?.data;
						}
					}

					break;
				case "products":
					itemDetails = await supabase
						.from("products")
						.select("* ,  organizations(*) , product_category(*)")
						.eq("id", getData?.id);
					itemDetails?.data?.map((e) => {
						e.organization_data = e?.organizations;
					});
					break;
				case "services":
					itemDetails = await supabase
						.from("directory_companies")
						.select("* , company(*) , category(*)")
						.eq("id", getData?.id);
					itemDetails?.data?.map((e) => {
						e.organization_data = e?.company;
						e.directory_frontend_categories = e?.category;
					});
					break;
				case "articles":
					itemDetails = await supabase
						.from("articles")
						.select(
							"* , category_id(*),category_filter_id(*) , user_id(*) , organization_id(*)"
						)
						.eq("id", getData?.id);
					itemDetails?.data?.map((e) => {
						e.organization_data = e?.organization_id;
						e.category_data = e?.category_id;
						e.category_filter_data = e?.category_filter_id;
						e.user_data = e?.user_id;
					});
					break;

				default:
					break;
			}
			if (itemDetails && itemDetails?.data) {
				res.status(200).send({
					status: true,
					message: "Data Found",
					data: itemDetails?.data[0],
					key: getData?.entity_type,
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
