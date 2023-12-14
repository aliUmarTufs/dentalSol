import { HeartIcon } from "@heroicons/react/outline";
import {
	OfficeBuildingIcon,
	HeartIcon as HeartFilledIcon,
	BadgeCheckIcon,
} from "@heroicons/react/solid";
import { Markup } from "interweave";
import _ from "lodash";
import Link from "next/link";
import { useState, useEffect } from "react";
import ReactStars from "react-stars";
import {
	BASE_URL,
	DATE_FORMAT_TWO,
	DEAL_TYPE,
	ENTITY_TYPE,
	ROUTES,
	Toast,
} from "../../constants";
import Modal from "../Modal";
import moment from "moment";
import { useRouter } from "next/router";

export default function CardBox({
	objectType,
	customCssClass,
	setIsFavourite,
	userID,
	setFav,
	addFavList,
	type,
	dataSource,
	isDeal,
}) {
	const [isLoading, setLoading] = useState(false);
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [alreadyFav, setAlreadyFav] = useState(false);
	const router = useRouter();

	const closeModalHandler = () => {
		setIsOpenModal(false);
		document.body.style.overflow = "auto";
	};

	useEffect(() => {
		if (!_.isUndefined(userID)) {
			if (
				objectType?.favUsers?.includes(userID) ||
				objectType?.dealDetail?.favUsers?.includes(userID)
			) {
				setAlreadyFav(true);
				setFav((current) => [
					...current,
					{
						item_id: objectType?.id || objectType?.objectID,
						user_id: userID,
						type: "deals",
					},
				]);
			}
		}
	}, []);

	useEffect(() => {
		let filteredFavList =
			addFavList?.filter((err) => {
				return err.item_id == objectType?.id || objectType?.objectID;
			}).length > 0;
	}, [alreadyFav]);

	const favouriteUnfavouriteItem = async () => {
		setLoading(true);
		const payload = {
			item_id: objectType?.id || objectType?.objectID,
			user_id: userID,
			type: "deals",
			deal_id: objectType?.dealDetail?.id,
		};

		fetch(`${BASE_URL}/api/wishlist`, {
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
					Toast.fire({
						icon: `${"success"}`,
						title: `${data.message}`,
					});
					setIsFavourite(true);
					// setTimeout(() => {
					//   router.reload();
					// }, 3000);
					// setFavData(data.data[0]);

					if (data.data[0]?.is_like === true) {
						setFav((current) => [...current, payload]);
						setAlreadyFav(true);
					} else {
						setFav((current) => {
							let arr = current.filter((err) => {
								return err.item_id != data?.data[0]?.item_id;
							});
							return arr;
						});
						setAlreadyFav(false);
					}
				} else {
					setLoading(false);
					setIsOpenModal(true);
					// Toast.fire({
					// 	icon: `${"error"}`,
					// 	title: `${data.message}`,
					// });
				}
				//
			});
	};

	const hasThumbnail =
		(!_.isNull(objectType?.thumbnail) && objectType?.thumbnail) ||
		(!_.isNull(objectType?.logo) && objectType?.logo) ||
		(!_.isNull(objectType?.itemDetail?.thumbnail) &&
			objectType?.itemDetail?.thumbnail);
	const dealDetails = objectType?.dealDetail;

	return (
		<div
			className={`customCardClass bg-white w-full ${customCssClass} flex flex-col`}>
			<Link
				href={`${
					type === ENTITY_TYPE.ARTICLES
						? `${BASE_URL}${ROUTES.LIBRARY}${ROUTES.ARTICLES}`
						: type === ENTITY_TYPE.PRODUCTS
						? `${BASE_URL}${ROUTES.PRODUCTS}`
						: type === ENTITY_TYPE.COURSES
						? `${BASE_URL}${ROUTES.COURSES}`
						: type === ENTITY_TYPE.SERVICES
						? `${BASE_URL}${ROUTES.SERVICES}/company`
						: type
				}/${
					objectType?.itemDetail?.id || objectType?.id || objectType?.objectID
				}`}>
				<div
					className={`relative border-black border-b border-opacity-20 h-72 rounded-t-26-radius cursor-pointer ${
						hasThumbnail ? `` : `bg-bluish-100 flex items-center justify-center`
					}`}>
					<img
						src={`${
							hasThumbnail
								? objectType?.itemDetail?.thumbnail ||
								  objectType?.thumbnail ||
								  objectType?.logo
								: type === ENTITY_TYPE.COURSES
								? `/courseFallBackImg.png`
								: type === ENTITY_TYPE.PRODUCTS
								? `/productFallBackImg.png`
								: `/serviceFallBackImg.png`
						}`}
						alt={`${type}`}
						className={`rounded-t-26-radius ${
							hasThumbnail
								? `w-full h-full object-cover`
								: `w-36 object-contain`
						}`}
					/>

					<div
						className={`absolute top-4 w-full flex  items-stretch ${
							objectType?.is_deal === true
								? objectType?.featured_item === true
									? "justify-between"
									: "justify-start"
								: objectType?.featured_item === true
								? "justify-end"
								: "justify-between"
						}`}>
						{(dataSource === "supabase" && objectType?.is_deal === true) ||
						dataSource === "algolia" ? (
							<>
								{objectType?.deal_type === DEAL_TYPE.DISCOUNTED ||
								dealDetails?.deal_type === DEAL_TYPE.DISCOUNTED ? (
									!_.isNull(dealDetails?.quantity) ||
									!_.isNull(objectType?.quantity) ? (
										<div
											className="mx-2 uppercase py-1 px-4 bg-black opacity-70"
											style={{ borderRadius: 45 }}>
											<span className="text-sm text-white font-medium">{`${
												objectType?.quantity || dealDetails?.quantity
											}% off`}</span>
										</div>
									) : (
										""
									)
								) : (
									<>
										{!_.isUndefined(
											objectType?.item_quantity || dealDetails?.item_quantity
										) ||
										!_.isUndefined(
											objectType?.free_quantity || dealDetails?.free_quantity
										) ? (
											<div
												className="mx-2 uppercase py-1 px-4 bg-black opacity-70"
												style={{ borderRadius: 45 }}>
												<span className="text-sm text-white font-medium">{`Buy ${
													objectType?.item_quantity ||
													dealDetails?.item_quantity
												} Get ${
													objectType?.free_quantity ||
													dealDetails?.free_quantity
												} Free`}</span>
											</div>
										) : (
											""
										)}
									</>
								)}
							</>
						) : (
							""
						)}
						{objectType?.featured_item === true ? (
							<div
								className=" uppercase flex items-center py-1 px-2 bg-black opacity-70 "
								style={{ borderRadius: "45px 0 0 45px" }}>
								<img
									src="/featured-icon.png"
									alt={"Featured"}
									className="w-5 h-5 object-contain mr-1"
								/>
								<span className="text-sm text-white font-medium">Featured</span>
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
			</Link>

			<div className="px-4 pb-7 relative">
				<div
					className={`absolute -top-6 left-4 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center`}>
					<img
						src={`${
							!_.isUndefined(objectType?.notable_figures?.picture)
								? objectType?.notable_figures?.picture
								: type === ENTITY_TYPE.COURSES
								? "/course-org-icon.png"
								: type === ENTITY_TYPE.PRODUCTS
								? "/product-org-icon.png"
								: type === ENTITY_TYPE.SERVICES
								? "/service-org-icon.png"
								: "/service-org-icon.png"
						}`}
						className={`${
							!_.isUndefined(objectType?.notable_figures?.picture)
								? "rounded-full w-full h-full object-cover"
								: "rounded-none"
						}`}
					/>
				</div>
				<div className="flex justify-between items-center gap-4 mt-8 h-32">
					<div className="flex flex-col gap-2 flex-1">
						{type === ENTITY_TYPE.ARTICLES ? (
							<h4 className="font-bold text-sm textTruncateTwo capitalize text-bluish-900">
								{objectType?.authorUser?.user_name ||
									objectType?.authorUser?.username ||
									objectType?.user_id?.user_name ||
									objectType?.author?.first_name}
								<span className="font-semibold">
									{" - "}
									{objectType?.organizations?.name ||
										objectType?.organization_id?.name ||
										"N/A"}
								</span>
							</h4>
						) : (
							<h4 className="font-bold text-sm textTruncateTwo capitalize text-bluish-900">
								{objectType?.company?.name ||
									objectType?.company_name ||
									objectType?.authorUser?.user_name ||
									objectType?.authorUser?.username ||
									objectType?.organizations?.name ||
									objectType?.organization?.name ||
									objectType?.notable_figures?.first_name ||
									objectType?.author?.first_name ||
									objectType?.organization_detail?.name ||
									"N/A"}
							</h4>
						)}
						<Link
							href={`${
								type === ENTITY_TYPE.ARTICLES
									? `${BASE_URL}${ROUTES.LIBRARY}${ROUTES.ARTICLES}`
									: type === ENTITY_TYPE.PRODUCTS
									? `${BASE_URL}${ROUTES.PRODUCTS}`
									: type === ENTITY_TYPE.COURSES
									? `${BASE_URL}${ROUTES.COURSES}`
									: type === ENTITY_TYPE.SERVICES
									? `${BASE_URL}${ROUTES.SERVICES}/company`
									: type
							}/${
								objectType?.itemDetail?.id ||
								objectType?.id ||
								objectType?.objectID
							}`}>
							<h2 className="font-bold text-sm h-16 capitalize flex-1 cursor-pointer text-purplish-900 textTruncateTen ">
								{objectType?.itemDetail?.title ||
									objectType?.itemDetail?.name ||
									objectType?.itemDetail?.company_name ||
									objectType?.title ||
									objectType?.name ||
									objectType?.company_name ||
									objectType?.company?.name ||
									"N/A"}
							</h2>
						</Link>
					</div>
				</div>

				<div className="flex flex-row gap-2 my-4 items-center justify-between">
					<div className="">
						<div className="flex flex-col justify-stretch">
							<p className="font-semibold text-sm text-blue-600 flex">
								<ReactStars
									count={5}
									size={18}
									isHalf={true}
									emptyIcon={<i className="far fa-star"></i>}
									halfIcon={<i className="fa fa-star-half-alt"></i>}
									fullIcon={<i className="fa fa-star"></i>}
									activeColor="#ffd700"
									value={objectType?.rating ?? 0}
									edit={false}
								/>
							</p>
						</div>
						<div className="flex flex-col justify-stretch"></div>
					</div>

					{(dataSource === "supabase" && objectType?.is_deal === true) ||
					(dataSource === "algolia" && objectType?.is_deal === true) ||
					(dataSource === "algolia" && isDeal === true) ? (
						<>
							<div onClick={() => favouriteUnfavouriteItem()}>
								{alreadyFav &&
								addFavList?.filter((err) => {
									return err.item_id == objectType?.id || objectType.objectID;
								}).length > 0 ? (
									<img
										src="/favourite.png"
										className="w-5 h-auto object-cover text-red-600 cursor-pointer"
									/>
								) : (
									<img
										src="/unfavourite.png"
										className="w-5 h-auto object-cover cursor-pointer"
									/>
								)}
							</div>
							{isOpenModal && (
								<Modal
									isOpen={isOpenModal}
									closeModalHandler={closeModalHandler}
									description=""
									title={"Login/Signup required"}
									loginSignUpTextDesc={
										"You must be logged in to favourite/unfavourite item."
									}
								/>
							)}
						</>
					) : (
						""
					)}
				</div>

				<div className="border-black border-b border-opacity-20 mb-3"></div>

				<Markup
					content={
						objectType?.tag_line ||
						objectType?.itemDetail?.short_description ||
						objectType?.description ||
						objectType?.short_description
					}
					className="mt-4 text-xs font-normal text-gray-600 text-left h-20 cardBoxDescription"
				/>

				{!_.isUndefined(objectType.expiry_data) ? (
					<div className="mt-4">
						<span className={"text-sm text-greyish-500 font-medium"}>
							Deal till:{" "}
							{moment(objectType?.expiry_data).format(DATE_FORMAT_TWO)}
						</span>
					</div>
				) : (
					""
				)}

				{type === ENTITY_TYPE.COURSES && !isDeal ? (
					<div className="mt-4">
						<span className={"text-sm text-greyish-500 font-medium"}>
							{objectType.date
								? `Date: ${moment(objectType?.date).format(DATE_FORMAT_TWO)}`
								: "Date : N/A"}
						</span>
					</div>
				) : (
					""
				)}
			</div>
		</div>
	);
}
