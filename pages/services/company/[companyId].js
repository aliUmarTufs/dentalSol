import { supabase } from "../../../lib/supabaseClient.js";
import {
	Navbar,
	Footer,
	HeadMeta,
	InfoDetailSec,
	CustomerReviews,
	RelatedSlider,
	NotFound,
} from "../../../components";
import cookie from "cookie";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getLoggedInUser, Toast, BASE_URL } from "../../../constants";
import _ from "lodash";
import { BeatLoader } from "react-spinners";

export default function CompanyDirectoryPage({ company }) {
	const [requestData, setRequestData] = useState(null);
	const [loggedinUser, setLoggedinUser] = useState(null);
	const [isFav, setIsFav] = useState(false);
	const [availDeal, setAvailDeal] = useState(null);
	const [isItemAdded, setisItemAdded] = useState(false);
	const [successfullLoading, setSuccessfullLoading] = useState(false);

	const router = useRouter();

	useEffect(() => {
		const companyListFunc = async () => {
			if (router.query.companyId) {
				let getuser = await getLoggedInUser();
				let loggedInUserUrl;
				if (!_.isNull(getuser)) {
					loggedInUserUrl = JSON.parse(getuser);
					setLoggedinUser(loggedInUserUrl);
					loggedInUserUrl = loggedInUserUrl?.id;
				}

				fetch(
					!_.isUndefined(loggedInUserUrl)
						? `${BASE_URL}/api/directory?id=${router?.query?.companyId}&user_id=${loggedInUserUrl}`
						: `${BASE_URL}/api/directory?id=${router?.query?.companyId}`
				)
					.then((res) => {
						return res.json();
					})
					.then((data) => {
						if (data.status === true) {
							setRequestData(data.data);
							setSuccessfullLoading(true);
							if (data?.data?.details?.is_fav === true) {
								setIsFav(true);
							}
						} else {
							setRequestData([]);
						}
					});
			}
		};
		companyListFunc();
	}, [router]);

	const userDealAvail = async () => {
		let payload = {
			user_id: loggedinUser?.id,
			deal_id: company?.dealDetail?.id,
		};
		fetch(`${BASE_URL}/api/deals/avail`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})
			.then((res) => res.json())
			.then((response) => {
				if (response?.status === true) {
					setAvailDeal(response?.data);
					Toast.fire({
						icon: `${"success"}`,
						title: `${response.message}`,
					});
					setTimeout(() => {
						router.reload();
					}, 3000);
				} else {
					Toast.fire({
						icon: `${"error"}`,
						title: `${response.message}`,
					});
				}
			});
	};

	return (
		<>
			<HeadMeta
				title={`Dent247 | Services | ${
					company?.company?.name ?? "Company Detail"
				}`}
				description="description"
				content={`Dent247 | Services | ${
					company?.company?.name ?? "Company Detail"
				}`}
			/>
			<Navbar isItemAdded={isItemAdded} />{" "}
			<div className="bg-light-blue">
				<div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
					{company === false ? (
						<div className="flex justify-center items-center">
							<BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
						</div>
					) : company?.is_approved == 0 ? (
						<NotFound
							isItem={true}
							title={"Directory/Service not found."}
							heroImage={"/404-item.png"}
						/>
					) : (
						<>
							<InfoDetailSec
								setIsFav={setIsFav}
								isFav={isFav}
								objectType={company}
								type={"services"}
								dealAvailHandler={userDealAvail}
								setisItemAdded={setisItemAdded}
							/>

							<CustomerReviews
								typeID={requestData?.details?.id}
								reviewsList={requestData?.reviews}
								reviewModuleType={"services"}
							/>
							<RelatedSlider
								loadSuccess={successfullLoading}
								isRelated={requestData?.relatedCourses?.is_related}
								sliderArr={requestData?.relatedCourses?.data}
								title={"courses"}
								sliderType={"courses"}
							/>
							{/* <RelatedSlider
                              loadSuccess={successfullLoading}
			<Navbar isItemAdded={isItemAdded} />
			<div className="bg-light-blue">
				<div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
					{_.isNull(requestData) ? (
						<div className="flex justify-center items-center">
							<BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
						</div>
					) : (
						<>
							<InfoDetailSec
								setIsFav={setIsFav}
								isFav={isFav}
								objectType={requestData?.details}
								type={"services"}
								dealAvailHandler={userDealAvail}
								setisItemAdded={setisItemAdded}
							/>

								isRelated={requestData?.relatedProducts?.is_related}
								sliderArr={requestData?.relatedProducts?.data}
								title={"products"}
								sliderType={"products"}
							/> */}
							<RelatedSlider
								loadSuccess={successfullLoading}
								isRelated={requestData?.relatedArticles?.is_related}
								sliderArr={requestData?.relatedArticles?.data}
								title={"articles"}
								sliderType={"articles"}
							/>
							<RelatedSlider
								loadSuccess={successfullLoading}
								isRelated={requestData?.relatedServices?.is_related}
								sliderArr={requestData?.relatedServices?.data}
								title={"services"}
								sliderType={"services"}
							/>
							<RelatedSlider
								loadSuccess={successfullLoading}
								isRelated={requestData?.relatedVideos?.is_related}
								sliderArr={requestData?.relatedVideos?.data}
								title={"videos"}
								sliderType={"videos"}
							/>
						</>
					)}
				</div>
			</div>
			<Footer />
		</>
	);
}

export async function getServerSideProps(context) {
	const company_id = context.params.companyId;
	let cookies;
	if (context.req.headers.cookie) {
		cookies = cookie.parse(context.req.headers.cookie);
	}
	let details;
	let directory = await supabase
		.from("directory_companies")
		.select("* , company(*) , directory_frontend_categories(*) ")
		.eq("id", company_id);
	if (directory?.data) {
		if (directory?.data?.length > 0) {
			//   obj.details = directory?.data[0];

			let checkDeal = await supabase
				.from("deals")
				.select("*")
				.eq("item_id", company_id)
				.eq("is_expire", 0);
			if (checkDeal?.data && checkDeal?.data?.length > 0) {
				let isDealAvail = false;
				let userAvailDeal = {};
				if (cookies?.user_token) {
					let checkIfDealAvail = await supabase
						.from("avail_deal_users")
						.select("*")
						.eq("user_id", cookies?.user_token)
						.eq("deal_id", checkDeal?.data[0]?.id);
					if (checkIfDealAvail?.data && checkIfDealAvail?.data?.length > 0) {
						isDealAvail = true;
						userAvailDeal = checkIfDealAvail?.data[0];
					}
				}
				let is_fav;
				if (checkDeal && checkDeal?.favUsers) {
					if (cookies?.user_token) {
						if (checkDeal?.favUsers?.includes(cookies?.user_token)) {
							is_fav = true;
						} else {
							is_fav = false;
						}
					} else {
						is_fav = false;
					}
				} else {
					is_fav = false;
				}
				details = {
					...directory?.data[0],
					is_deal: true,
					dealDetail: checkDeal?.data[0],
					is_fav,
					isDealAvail,
					userAvailDeal,
					item_type: "services",
				};
			} else {
				details = {
					...directory?.data[0],
					is_deal: false,
					item_type: "services",
					dealDetail: {},
				};
			}
		}
	}
	// const company = data.data[0];
	return {
		props: {
			company: details ? details : false || false,
		},
	};
}
