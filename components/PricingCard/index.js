import { BadgeCheckIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { BASE_URL, ROUTES, Toast } from "../../constants";
export default function PricingCard({
	pricingPlanObj,
	planType,
	loggedinUser,
}) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const subcriptionHandler = async (itemObj) => {
		setLoading(true);
		localStorage.setItem("subscriptionObject", itemObj);
		let payload = {
			subscription_id: pricingPlanObj?.id,
			user_id: loggedinUser?.id,
			user_email: loggedinUser?.user_email,
			price_id:
				planType === "annually"
					? itemObj?.stripe_yearly_price
					: itemObj?.stripe_monthly_price,
			item_id: itemObj?.id,
			plan_type: planType === "annually" ? "annually" : "monthly",
		};

		fetch(`${BASE_URL}/api/subscriptions/subscribe`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				if (data.status === true) {
					router.push(data?.data?.url);
				} else {
					setLoading(false);
					Toast.fire({
						icon: `${"error"}`,
						title: `${data.message}`,
					});
				}
			});
	};

	return (
		<div className="bg-white border border-dark-bluish-500 shadow-4xl border-opacity-10 rounded-lg p-5">
			<div className="flex flex-col gap-2">
				<h4 className="text-base text-bluish-600 font-bold font-inter capitalize">
					{pricingPlanObj?.subscription_title}
					<span className="text-sm text-light-blue-800 font-medium font-inter ml-1.5 normal-case">{`/ ${
						planType === "annually" ? "year" : "month"
					}`}</span>
				</h4>
				<h6 className="text-sm text-light-blue-800 font-medium font-inter capitalize">{`${
					pricingPlanObj?.subscription_entry
				}  ${
					pricingPlanObj?.subscription_entry > 1 ? "entries" : "entry"
				}`}</h6>
			</div>

			<hr className="w-4/5 h-px mx-auto mt-6 mb-5 bg-greyish-400 bg-opacity-10 border-0 rounded" />

			{_.size(pricingPlanObj?.items) > 0
				? pricingPlanObj?.items.map((item, index) => {
						return (
							<div
								key={index}
								className={`${
									index === 0
										? "bg-dark-bluish-500"
										: "bg-white border border-light-blue-100"
								} rounded-md flex flex-row items-center justify-between p-3 my-1.5 ${
									loggedinUser?.plan_id?.id === item?.id &&
									loggedinUser?.plan_type === planType
										? "cursor-not-allowed"
										: "cursor-pointer"
								}`}
								onClick={() => {
									if (item?.qoute === false) {
										if (planType === "annually") {
											if (
												item?.qoute !== true &&
												item?.subscription_yearly_price > 0
											) {
												if (
													loggedinUser?.plan_type === planType &&
													loggedinUser?.plan_id?.id === item?.id
												) {
													undefined;
												} else {
													subcriptionHandler(item);
												}
											} else {
												undefined;
											}
										} else {
											if (
												item?.qoute !== true &&
												item?.subscription_yearly_price > 0
											) {
												if (
													loggedinUser?.plan_type === planType &&
													loggedinUser?.plan_id?.id === item?.id
												) {
													undefined;
												} else {
													subcriptionHandler(item);
												}
											} else {
												undefined;
											}
										}
									} else {
										router.push(ROUTES.CONTACT_US);
									}
								}}>
								<p
									className={`text-xs ${
										index === 0 ? "text-white" : "text-dark-bluish-500"
									} font-medium font-inter capitalize`}>
									{loggedinUser?.plan_id?.id === item?.id &&
									loggedinUser?.plan_type === planType ? (
										<BadgeCheckIcon
											className={`${
												index === 0 ? "text-white" : "text-blue-600"
											} w-4 h-4 inline-block mr-2`}
										/>
									) : (
										""
									)}
									{item?.name}

									{item?.qoute === true ? (
										<span
											className={`block text-xs mt-1 ${
												index === 0 ? "text-white" : "text-light-blue-800"
											} font-normal font-inter capitalize`}>
											Corporate Pricing Contact for qoute
										</span>
									) : (
										""
									)}
								</p>
								{item?.qoute !== true ? (
									<p
										className={`text-sm ${
											index === 0 ? "text-white" : "text-dark-bluish-500"
										} font-medium font-inter capitalize`}>{`${
										planType === "annually"
											? item?.subscription_yearly_price <= 0
												? "free"
												: `$${item?.subscription_yearly_price}`
											: item?.subscription_monthly_price <= 0
											? "free"
											: `$${item?.subscription_monthly_price}`
									}`}</p>
								) : (
									""
								)}
							</div>
						);
				  })
				: ""}
		</div>
	);
}
