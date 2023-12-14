import { supabase } from "../../../lib/supabaseClient";

export default async function handler(req, res) {
	if (req.method === "GET") {
		let getFAQs = await supabase
			.from("faqs")
			.select("* ")
			.order("created_at", { ascending: true });
		if (getFAQs?.data) {
			getFAQs?.data?.map((item) => {
				item.isOpen = false;
			});
			res.status(200).send({
				status: true,
				message: "FAQs Found",
				data: getFAQs?.data,
			});
		} else {
			res.status(400).send({
				status: false,
				message: getFAQs?.error?.message,
			});
		}
	} else {
		res.status(405).send({ message: "Only GET requests allowed" });
	}
}
