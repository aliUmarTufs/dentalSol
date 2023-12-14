import { useState, useEffect } from "react";
import _ from "lodash";
import { ListBoxForDeal } from "../../pages/dashboard/deals/add";
import {
	BASE_URL,
	COUNTRY_OPTIONS,
	DATE_FORMAT_ONE,
	DEAL_COUNTRY_OPTIONS,
	getLoggedInUser,
	INVALID_COUNTRY,
	INVALID_DATE_ERROR,
	REQUIRED_COUPON_CODE,
	REQUIRED_DATE,
	REQUIRED_EMAIL,
	REQUIRED_FREE_ITEM,
	REQUIRED_FREE_QUANITITY,
	REQUIRED_LOCATION,
	REQUIRED_NET_SAVINGS,
	REQUIRED_ORGANIZATION,
	REQUIRED_PASSWORD,
	REQUIRED_PRODUCT,
	REQUIRED_PRODUCT_QUANTITY,
	REQUIRED_TAG_LINE,
	ROUTES,
	Toast,
} from "../../constants";
import Util from "../../services/Util";
import { useRouter } from "next/router";
import { BeatLoader } from "react-spinners";
import { ComboBox } from "../ComboBox";
import moment from "moment";

export const DiscountedDealsForm = ({
	organizations,
	isEditData,
	loggedinUser,
}) => {
	const router = useRouter();
	const [product, setProduct] = useState(null);
	const [organization, setOrganization] = useState([]);
	const [users, setUser] = useState([]);

	const [filteredProducts, setFilterProducts] = useState([]);
	const [productsList, setProductList] = useState([]);

	const [isEdited, setIsEdited] = useState(null);

	const [country, setCountry] = useState(null);
	const [organizationId, setOrganizationID] = useState(null);
	const [itemID, setItemID] = useState(null);
	const [tagLine, setTagLine] = useState(null);
	const [location, setLocatio] = useState(null);
	const [expiryDate, setExpiryDate] = useState(null);
	const [netSavings, setNetSavings] = useState(null);
	const [couponCode, setCouponCode] = useState(null);
	const [discount, setDiscount] = useState(null);

	const [userQuery, setUserQuery] = useState("");

	const [isValidOrganization, setIsValidOrganization] = useState(null);
	const [isValidProductItem, setisValidProductItem] = useState(null);
	const [isValidCountry, setIsValidCountry] = useState(null);
	const [isValidProductQuantity, setIsValidProductQuantity] = useState(null);
	const [isValidLocation, setIsValidLocation] = useState(null);
	const [isValidNetSavings, setIsValidNetSavings] = useState(null);
	const [isValidCouponCode, setIsValidCouponCode] = useState(null);
	const [isValidTagLine, setIsValidTagLine] = useState(null);
	const [isValidExpirtyDate, setisValidExpirtyDate] = useState(null);

	const [organizationErrMsg, setOrganizationErrMsg] = useState(null);
	const [productItemErrMsg, setproductItemErrMsg] = useState(null);
	const [productQtyErrMsg, setproductQtyErrMsg] = useState(null);
	const [locationErrMsg, setlocationErrMsg] = useState(null);
	const [netSavingErrMsg, setNetSavingErrMsg] = useState(null);
	const [couponErrMsg, setCouponErrMsg] = useState(null);
	const [tagErrMsg, settagErrMsg] = useState(null);
	const [expiryErrMsg, setExpiryErrMsg] = useState(null);
	const [countryErrMsg, setCountryErrMsg] = useState(null);

	const [isDisabled, setIsDisabled] = useState(false);

	const filteredOrganizaions =
		userQuery === ""
			? organizations
			: organizations?.filter((person) => {
					return person.name
						.toLowerCase()
						.replace(/\s+/g, "")
						.includes(userQuery.toLowerCase().replace(/\s+/g, ""));
			  });

	useEffect(() => {
		if (!_.isNull(isEditData)) {
			let filterCountry = _.filter(DEAL_COUNTRY_OPTIONS, (item) => {
				return item.title == isEditData?.country;
			});
			if (filterCountry && filterCountry?.length > 0) {
				setCountry(filterCountry[0]);
			}

			setTagLine(isEditData?.tag_line);
			setLocatio(isEditData?.location);
			setNetSavings(isEditData?.net_savings);
			setCouponCode(isEditData?.coupon_code);
			setExpiryDate(isEditData?.expiry_data);
			setOrganization(isEditData?.organizations);
			setDiscount(String(isEditData?.quantity));
			setIsEdited(true);
		} else {
			setIsEdited(false);
		}
	}, [isEditData]);

	const validateForm = () => {
		let isValid = true;
		let expiryDateObj = new Date(expiryDate);

		setIsValidOrganization(true);
		setisValidProductItem(true);
		setIsValidProductQuantity(true);
		setIsValidLocation(true);
		setIsValidNetSavings(true);
		setIsValidCouponCode(true);
		setIsValidTagLine(true);
		setisValidExpirtyDate(true);
		setIsValidCountry(true);
		// required check
		if (_.isEmpty(organization)) {
			setIsValidOrganization(false);
			setOrganizationErrMsg(REQUIRED_ORGANIZATION);
			isValid = false;
		}
		if (_.isEmpty(country)) {
			setIsValidCountry(false);
			setCountryErrMsg(INVALID_COUNTRY);
			isValid = false;
		}
		if (_.isEmpty(product)) {
			setisValidProductItem(false);
			setproductItemErrMsg(REQUIRED_PRODUCT);
			isValid = false;
		}

		if (_.isEmpty(location)) {
			setIsValidLocation(false);
			setlocationErrMsg(REQUIRED_LOCATION);
			isValid = false;
		} else if (_.size(location) > 150) {
			setIsValidLocation(false);
			setlocationErrMsg("Field must not exceed 150 characters");
			isValid = false;
		}
		if (_.isEmpty(tagLine)) {
			setIsValidTagLine(false);
			settagErrMsg(REQUIRED_TAG_LINE);
			isValid = false;
		} else if (_.size(tagLine) > 125) {
			setIsValidTagLine(false);
			settagErrMsg("Field must not exceed 125 characters");
			isValid = false;
		}
		if (_.isEmpty(expiryDate)) {
			setisValidExpirtyDate(false);
			setExpiryErrMsg(REQUIRED_DATE);
			isValid = false;
		} else if (moment(expiryDateObj).diff(new Date(), "day") < 0) {
			setisValidExpirtyDate(false);
			setExpiryErrMsg(INVALID_DATE_ERROR);
			isValid = false;
		}
		if (_.isEmpty(netSavings)) {
			setIsValidNetSavings(false);
			setNetSavingErrMsg(REQUIRED_NET_SAVINGS);
			isValid = false;
		} else if (_.size(netSavings) > 10) {
			setIsValidNetSavings(false);
			setNetSavingErrMsg("Field must not exceed 10 characters");
			isValid = false;
		}
		if (_.isEmpty(couponCode)) {
			setIsValidCouponCode(false);
			setCouponErrMsg(REQUIRED_COUPON_CODE);
			isValid = false;
		} else if (_.size(couponCode) > 100) {
			setIsValidCouponCode(false);
			setCouponErrMsg("Field must not exceed 10 characters");
			isValid = false;
		}
		if (_.isEmpty(discount)) {
			setIsValidProductQuantity(false);
			setproductQtyErrMsg(REQUIRED_PRODUCT_QUANTITY);
			isValid = false;
		} else if (_.size(discount) > 10) {
			setIsValidProductQuantity(false);
			setproductQtyErrMsg("Field must not exceed 10 characters");
			isValid = false;
		} else if (parseInt(discount) > 100) {
			setIsValidProductQuantity(false);
			setproductQtyErrMsg("Discount should be less than 100");
			isValid = false;
		} else if (parseInt(discount) < 1) {
			setIsValidProductQuantity(false);
			setproductQtyErrMsg("Discount should not be negative or 0");
			isValid = false;
		}
		return isValid;
	};

	useEffect(() => {
		let filteredProducts = _.filter(organizations, (item) => {
			return item.id === organization?.id;
		});
		if (filteredProducts?.length > 0) {
			setFilterProducts(filteredProducts[0]);
		}
	}, [organization]);

	useEffect(() => {
		if (organization) {
			const getProducts = async () => {
				const setProducts = await fetch(
					`${BASE_URL}/api/deals/create/products`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							organization_id: organization?.id,
						}),
					}
				)
					.then((res) => res.json())
					.then((response) => {
						if (response.status == true) {
							setProductList(response?.data);
							if (!_.isNull(isEditData)) {
								let filteredProducts = _.filter(response?.data, (item) => {
									return item.id == isEditData?.item_id;
								});
								if (filteredProducts.length > 0) {
									setProduct(filteredProducts[0]);
								}
							} else {
								setProduct(null);
							}
						} else {
							setProductList([]);
						}
					});
			};
			getProducts();
		}
	}, [organization]);

	const createDiscountedDeal = (event) => {
		event.preventDefault();
		let payload = {
			expiry_data: expiryDate,
			location: location,
			net_savings: netSavings,
			coupon_code: couponCode,
			item_id: product?.id,
			type:
				organization?.organization_type == "course_provider"
					? "courses"
					: organization?.organization_type == "product_provider"
					? "products"
					: organization?.organization_type == "service_provider"
					? "services"
					: "",
			deal_type: "discounted",
			quantity: discount,
			organization_id: organization?.id,
			tag_line: tagLine,
			country: country?.title,
		};
		if (validateForm()) {
			setIsDisabled(true);
			let url;
			if (_.isNull(isEditData)) {
				url = `${BASE_URL}/api/deals/create`;
			} else {
				url = `${BASE_URL}/api/deals/update`;
				payload.deal_id = isEditData?.id;
			}
			if (loggedinUser?.role_type == "Admin") {
				payload.isAdmin = 1;
			}

			fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			})
				.then((res) => res.json())
				.then((response) => {
					if (response.status == true) {
						Toast.fire({
							icon: `${"success"}`,
							title: `${response.message}`,
						});
						setTimeout(() => {
							setIsDisabled(false);
							router.push(ROUTES.DASHBOARD_DEALS);
						}, 5000);
					} else {
						Toast.fire({
							icon: `${"error"}`,
							title: `${response.message}`,
						});
						setIsDisabled(false);
					}
				});
		}
	};

	return _.isNull(isEdited) ? (
		<div className="my-2 flex justify-center w-full h-screen items-center">
			<BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
		</div>
	) : _.isNull(organizations) ? (
		<div className="my-2 flex justify-center items-center">
			<BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
		</div>
	) : (
		<form onSubmit={createDiscountedDeal}>
			<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
				<div className="mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
					<label
						for="email"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Organizations
					</label>

					{loggedinUser?.role_type == "Admin" ? (
						<ComboBox
							valueKey={organization}
							valueSetter={setOrganization}
							optionsList={filteredOrganizaions}
							type={"organization"}
							itemQuery={userQuery}
							setItemQuery={setUserQuery}
							isDisable={_.isNull(isEditData) ? false : true}
						/>
					) : (
						<ListBoxForDeal
							valueKey={organization}
							valueSetter={setOrganization}
							optionsList={organizations}
							type={"organization"}
							isDisable={_.isNull(isEditData) ? false : true}
						/>
					)}
					{!isValidOrganization ? (
						<span className={"text-sm text-red-500"}>{organizationErrMsg}</span>
					) : (
						""
					)}
				</div>
			</div>
			{/* <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
        <div className="mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
          <label
            for="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Organization
          </label>

          <ListBoxForDeal
            valueKey={organization}
            valueSetter={setOrganization}
            optionsList={organizations}
            type={"organization"}
            isDisable={_.isNull(isEditData) ? false : true}
          />
          {!isValidOrganization ? (
            <span className={"text-sm text-red-500"}>{organizationErrMsg}</span>
          ) : (
            ""
          )}
        </div>
      </div> */}
			<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
				<div className="mb-3 md:mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
					<label
						for="password"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Discount
					</label>
					<div className="relative">
						<input
							placeholder="Type Discount"
							type="number"
							id="text"
							className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							value={discount}
							onChange={(e) => {
								setDiscount(e.target.value);
							}}
							// maxLength={10}
						/>

						<div className="absolute top-3 bottom-1 right-4 z-10 text-gray-600">
							% off
						</div>
					</div>
					{!isValidProductQuantity ? (
						<span className={"text-sm text-red-500"}>{productQtyErrMsg}</span>
					) : (
						""
					)}
				</div>
				<div className="mb-3 md:mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
					<label
						for="email"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Item
					</label>
					<ListBoxForDeal
						valueKey={product}
						valueSetter={setProduct}
						// optionsList={filteredProducts?.products}
						optionsList={productsList}
						relaventState={setOrganizationID}
						isDisable={_.isNull(isEditData) ? false : true}
					/>
					{!isValidProductItem ? (
						<span className={"text-sm text-red-500"}>{productItemErrMsg}</span>
					) : (
						""
					)}
				</div>
			</div>
			<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
				<div className="mb-3 md:mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
					<label
						for="email"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Country
					</label>
					<ListBoxForDeal
						valueKey={country}
						valueSetter={setCountry}
						optionsList={DEAL_COUNTRY_OPTIONS}
						relaventState={setOrganizationID}
					/>
					{!isValidCountry ? (
						<span className={"text-sm text-red-500"}>{countryErrMsg}</span>
					) : (
						""
					)}
				</div>
				<div className="mb-3 md:mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
					<label
						for="email"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Deal Tag Line
					</label>
					<input
						type="text"
						id="discountLine"
						className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="70% Discount on item"
						value={tagLine}
						onChange={(e) => {
							setTagLine(e.target.value);
						}}
					/>
					{!isValidTagLine ? (
						<span className={"text-sm text-red-500"}>{tagErrMsg}</span>
					) : (
						""
					)}
				</div>
			</div>
			<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
				<div className="mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
					<label
						for="password"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Location
					</label>
					<input
						placeholder="Type Location"
						type="text"
						id="text"
						className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={location}
						onChange={(e) => {
							setLocatio(e.target.value);
						}}
						maxLength={150}
					/>
					{!isValidLocation ? (
						<span className={"text-sm text-red-500"}>{locationErrMsg}</span>
					) : (
						""
					)}
				</div>
				<div className="mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
					<label
						for="password"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Expiry Date
					</label>
					<input
						placeholder="Type Date"
						type="date"
						id="text"
						className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={expiryDate}
						pattern="\d{4}-\d{2}-\d{2}"
						onChange={(e) => {
							setExpiryDate(e.target.value);
						}}
					/>
					{!isValidExpirtyDate ? (
						<span className={"text-sm text-red-500"}>{expiryErrMsg}</span>
					) : (
						""
					)}
				</div>
			</div>

			<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
				<div className="mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
					<label
						for="password"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Net Savings
					</label>
					<input
						placeholder="Type Net Savings"
						type="number"
						id="text"
						className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={netSavings}
						onChange={(e) => {
							setNetSavings(e.target.value);
						}}
						maxLength={100}
					/>
					{!isValidNetSavings ? (
						<span className={"text-sm text-red-500"}>{netSavingErrMsg}</span>
					) : (
						""
					)}
				</div>
				<div className="mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
					<label
						for="password"
						className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Coupon Code
					</label>
					<input
						placeholder="Type Coupon Code"
						type="text"
						id="text"
						className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={couponCode}
						onChange={(e) => {
							setCouponCode(e.target.value);
						}}
						maxLength={100}
					/>
					{!isValidCouponCode ? (
						<span className={"text-sm text-red-500"}>{couponErrMsg}</span>
					) : (
						""
					)}
				</div>
			</div>

			<div className="flex items-stretch justify-end gap:2 md:gap-6 flex-col md:flex-row mt-4">
				<button
					type="submit"
					disabled={isDisabled}
					className={`inline-flex justify-center items-center px-8 xl:px-12 py-3 border rounded-xl border-blue-600 shadow-sm text-sm font-medium w-auto h-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700`}>
					{isEdited ? "Update" : "Create"}
				</button>
			</div>
		</form>
	);
};
