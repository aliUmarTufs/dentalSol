import { supabase } from "../../../lib/supabaseClient";
import _ from "lodash";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const getBody = req.body;
		let obj = {
			name: getBody.fullname,
			email: getBody.email,
			phone: getBody.phone,
			city: getBody.city,
			notes: getBody.notes,
		};
		let contactUsers = await supabase.from("contact_users").insert(obj);
		if (contactUsers.data) {
			res.status(200).send({
				status: true,
				message: "Form has been submitted",
				data: contactUsers.data,
			});
		} else {
			res.status(400).send({
				status: true,
				message: contactUsers?.error?.message,
			});
		}
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
}
