import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const bodyData = req.body;
		let obj = {
			user_id: bodyData.user_id,
			product_id: bodyData.product_id,
			practice_name: bodyData.practice_name,
			practice_type: bodyData.practice_type,
			location: bodyData.location,
		};

		const submitInformation = await supabase
			.from("request_information")
			.insert(obj);
		if (submitInformation.error) {
			res.status(400).json({
				status: false,
				message: submitInformation.error.message,
			});
		} else {
			res.status(200).json({
				status: true,
				message: "Request has been sent successfully.",
				data: submitInformation.data,
			});
		}
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
}
