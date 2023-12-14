import { stripe_payment } from "../../../../constants";
import { supabase } from "../../../../lib/supabaseClient";
import {
	refreshToken,
	updateCustomerInfo,
	updateVendorInfo,
} from "../../../../zoho";

export default async function handle(req, res) {
	const refreshTokenFunc = await refreshToken();
	if (req.method === "POST") {
		try {
			const getData = req.body;
			if (getData.email) {
				let checkEmail = await supabase
					.from("users")
					.select("*")
					.eq("id", getData?.id);
				if (checkEmail.data.length < 1) {
					res.status(400).json({
						status: false,
						data: {},
						message: "User does not exist",
					});
				} else {
					let obj = {
						user_name: getData?.name,
						office_number: getData?.practiceName,
						office_address: getData?.practiceAddress,
						phone_number: getData?.phoneNumber,
						user_city: getData?.city,
						user_country: getData?.country,
						user_state: getData?.state,
						user_type_list: getData?.userTypeList,
						username: getData?.username,
						areas_of_interest: getData?.areasOfInterest,
						image: getData?.profileImg,
						zip_code: getData?.zip_code,
						short_bio: getData?.short_bio,
						long_bio: getData?.long_bio,
					};

					const updateUser = await supabase
						.from("users")
						.update(obj)
						.eq("id", getData?.id);
					if (updateUser.error) {
						res.status(400).json({
							status: false,
							data: updateUser.error,
							message: "Error Occured while signup",
						});
					} else {
						if (updateUser.data) {
							let subs = false;
							const getSubscribed = await supabase
								.from("subscribers")
								.select("*")
								.eq("email", updateUser.data[0].user_email);
							if (getSubscribed?.data && getSubscribed?.data?.length > 0) {
								subs = true;
							}

							let user = await supabase
								.from("users")
								.select("* ,user_city(*), subscription_id(*) , plan_id(*) ")
								.eq("id", updateUser.data[0].id);
							if (user?.data && user?.data?.length > 0) {
								if (updateUser?.data[0]?.role_type == "User") {
									if (updateUser?.data[0]?.vendor_zoho_id) {
										/* zoho API call for adding customers(user) to zoho and save zoho id against new user */
										let customerObj = {
											id: updateUser?.data[0]?.vendor_zoho_id,
											contact_name: getData?.name,
											contact_type: "customer",
											billing_address: {
												attention: getData?.name,
												address: getData?.practiceAddress ?? "",
												country: getData?.country,
												city: getData?.cityName,
												state: getData?.state,
												zip: getData?.zip_code,
												fax: getData?.phoneNumber,
												phone: getData?.phoneNumber,
											},
											shipping_address: {
												attention: getData?.name,
												address: getData?.practiceAddress ?? "",
												country: getData?.country,
												city: getData?.cityName,
												state: getData?.state,
												zip: getData?.zip_code,
												fax: getData?.phoneNumber,
												phone: getData?.phoneNumber,
											},
										};
										await updateCustomerInfo(
											refreshTokenFunc,
											customerObj,
											updateUser?.data[0]?.vendor_zoho_id
										);
									} else {
										null;
									}
								} else if (updateUser?.data[0]?.role_type == "Vendor") {
									if (
										updateUser?.data[0]?.vendor_zoho_id &&
										updateUser?.data[0]?.vendor_zoho_book_id
									) {
										let obj = {
											id: updateUser?.data[0]?.vendor_zoho_id,
											Vendor_Name: getData?.name,
											Email: getData?.email,
											Street: getData?.practiceAddress,
											Phone: getData?.phoneNumber,
											State: getData?.state,
											City: getData?.cityName,
											Zip_Code: getData?.zip_code,
											Country: getData?.country,
											Description: getData?.short_bio,
										};
										let vendorAsCustomerObj = {
											id: updateUser?.data[0]?.vendor_zoho_id,
											contact_name: getData?.name,
											contact_type: "vendor",
											billing_address: {
												attention: getData?.name,
												address: getData?.practiceAddress ?? "",
												country: getData?.country,
												city: getData?.cityName,
												state: getData?.state,
												zip: getData?.zip_code,
												fax: getData?.phoneNumber,
												phone: getData?.phoneNumber,
											},
											shipping_address: {
												attention: getData?.name,
												address: getData?.practiceAddress ?? "",
												country: getData?.country,
												city: getData?.cityName,
												state: getData?.state,
												zip: getData?.zip_code,
												fax: getData?.phoneNumber,
												phone: getData?.phoneNumber,
											},
										};
										await updateVendorInfo(refreshTokenFunc, obj);
										await updateCustomerInfo(
											refreshTokenFunc,
											vendorAsCustomerObj,
											updateUser?.data[0]?.vendor_zoho_book_id
										);
									} else {
										null;
									}
								}
								if (user?.data[0]?.stripe_account_id) {
									let StripeAccount = await stripe_payment.accounts.retrieve(
										user?.data[0]?.stripe_account_id
									);
									if (StripeAccount) {
										user.data[0].accounts =
											StripeAccount?.external_accounts?.data;
									} else {
										user.data[0].accounts = [];
									}
								} else {
									user.data[0].accounts = [];
								}
								user.data[0].subs = subs;
								res.status(200).json({
									status: true,
									data: user.data[0],
									message: "Your profile has been updated.",
								});
							} else {
								res.status(400).json({
									status: false,
									message: "Error Occured - User may not be found",
								});
							}
						}
					}
				}
			} else {
				res
					.status(400)
					.json({ status: false, message: "Email or Password required" });
			}
		} catch (error) {
			res.status(400).json({ status: false, message: error.message });
		}
	} else {
		res.status(405).send({ message: "Only POST requests allowed" });
	}
}
