import _ from "lodash";
import { BASE_URL, stripe_payment } from "../../../../constants";
import { supabase } from "../../../../lib/supabaseClient";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const getData = req.body;
		let getSubscriptions = await supabase
			.from("subscriptions")
			.select("*")
			.eq("id", getData?.subscription_id);
		if (getSubscriptions?.data && getSubscriptions?.data?.length > 0) {
			let sessionObj = {
				success_url: `${BASE_URL}/dashboard/pricing?type=payment&success=true`,
				line_items: [{ price: getData?.price_id, quantity: 1 }],
				mode: "subscription",
				metadata: {
					user_id: getData?.user_id,
					subscription_id: getData?.subscription_id,
					plan_id: getData?.item_id,
					plan_type: getData?.plan_type,
					checkout_type: "vendor_subscription",
				},
			};

			let getUserId = await supabase
				.from("users")
				.select("* ,user_city(*), subscription_id(*) , plan_id(*) ")
				.eq("id", getData?.user_id);
			if (getUserId?.data && getUserId?.data?.length > 0) {
				if (getUserId?.data[0]?.stripe_customer_id) {
					sessionObj.customer = getUserId?.data[0]?.stripe_customer_id;
				} else {
					sessionObj.customer_email = getData?.user_email;
				}
			}

			const session = await stripe_payment.checkout.sessions.create(sessionObj);
			if (session) {
				res.status(200).send({
					status: true,
					message: "Subscription Done Successfully",
					data: { url: session?.url },
				});
			} else {
				res.status(400).send({
					status: false,
					message: "Error",
				});
			}
		} else {
			res.status(400).send({
				status: false,
				message: getSubscriptions?.error?.message,
			});
		}
	} else {
		res.status(405).send({ message: "Only POST requests allowed" });
	}
}
