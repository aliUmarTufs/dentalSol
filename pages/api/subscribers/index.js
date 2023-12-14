import _ from "lodash";
import { getSubscribedUserZoho, refreshToken } from "../../../zoho";
import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
	let refreshTokenFunc = await refreshToken();
	if (req.method === "POST") {
		let data = req.body;
		if (data?.email) {
			let checkIfEmailExist = await supabase
				.from("subscribers")
				.select("*")
				.eq("email", data?.email);
			if (checkIfEmailExist?.data && checkIfEmailExist?.data?.length > 0) {
				console.log({ everyTime: data });
				res.status(400).send({
					status: false,
					message: "You have already subscribed to a news feed.",
					data: checkIfEmailExist?.data[0],
				});
			} else {
				let payload = {
					email: data?.email,
				};
				let subscribedUser = await supabase.from("subscribers").insert(payload);
				if (subscribedUser?.data && subscribedUser?.data?.length > 0) {
					await getSubscribedUserZoho(
						refreshTokenFunc,
						data?.email
					);

					res.status(200).send({
						status: true,
						message: "You email has registered for news feed",
						data: subscribedUser?.data[0],
					});
				} else {
					res.status(400).send({
						status: false,
						message: `Error Occured ${subscribedUser?.error?.message}`,
					});
				}
			}
		}
	} else {
		res
			.status(405)
			.send({ status: false, message: "Only POST requests allowed" });
	}
}
