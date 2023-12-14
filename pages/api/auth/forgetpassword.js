import { BASE_URL } from "../../../constants";
import { supabase, supabase_admin_secret } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const getBody = req.body;
		if (getBody.email) {
			let checkUser = await supabase
				.from("users")
				.select("*")
				.eq("user_email", getBody.email);

			if (checkUser.data && checkUser.data.length > 0) {
				const d = await supabase_admin_secret.auth.api.resetPasswordForEmail(
					getBody.email,
					{
						redirectTo: `${BASE_URL}/reset-password`,
					}
				);
				if (d.data) {
					res.status(200).send({
						status: true,
						message: "Email has been sent to your account.",
					});
				}
			} else {
				res.status(400).send({
					status: false,
					message: "No user found against this email.",
				});
			}
		} else {
			res
				.status(400)
				.send({ status: false, message: "Email or Password required" });
		}
	} else {
		res.status(405).send({ message: "Only POST requests allowed" });
	}
}
