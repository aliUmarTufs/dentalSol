import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import _ from "lodash";
import { Footer, HeadMeta, Modal, Navbar } from "../../components";
import {
  BASE_URL,
  COUNTRY_OPTIONS,
  getLoggedInUser,
  getOrderItems,
  INVALID_CITY,
  INVALID_COUNTRY,
  INVALID_PHONE_NUM,
  INVALID_STATE_PROVINCE,
  INVALID_ZIP_CODE,
  isLoggedInIndication,
  isOrderItems,
  ORDER_ITEMS,
  REQUIRED_BILLING_ADDRESS_ONE,
  REQUIRED_ZIP_CODE,
  ROUTES,
  Toast,
} from "../../constants";
import PhoneInput from "react-phone-input-2";
import { ListBoxComponents } from "../../components/ListBoxComponents";
import { BeatLoader } from "react-spinners";
import Util from "../../services/Util";
import { supabase } from "../../lib/supabaseClient";
import { MainContext } from "../../context-api/MainContext";

export default function CartCheckout({ pageData }) {
  const router = useRouter();
  const { MainState, dispatch } = useContext(MainContext);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");

  const [fullName, setFullName] = useState("");
  const [streetAddOne, setStreetAddOne] = useState("");
  const [streetAddTwo, setStreetAddTwo] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [country, setCountry] = useState(COUNTRY_OPTIONS[0]);
  const [cities, setCities] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [stateProvince, setStateProvince] = useState([]);
  const [stateProvinceData, setStateProvinceData] = useState([]);
  const [zipCode, setZipCode] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [orderItems, setOrderItems] = useState([]);
  const [isOrderItemsExist, setIsOrderItemsExist] = useState(false);

  const [totalPrice, setTotalPrice] = useState(0);
  const [isPaymentWithStripe, setIsPaymentWithStripe] = useState(true);

  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);

  /* form refs */
  const fullNameRef = useRef();
  const streetAddOneRef = useRef();
  const streetAddTwoRef = useRef();
  const phoneNumRef = useRef();
  const countryRef = useRef(null);
  const citiesRef = useRef(null);
  const stateProvinceRef = useRef(null);
  const zipCodeRef = useRef(null);
  const additionalInfoRef = useRef(null);

  /* validation state hooks */
  const [isValidFullName, setIsValidFullName] = useState(true);
  const [isValidStreetAddOne, setIsValidStreetAddOne] = useState(true);
  const [isValidStreetAddTwo, setIsValidStreetAddTwo] = useState(true);
  const [isValidPhoneNum, setIsValidPhoneNum] = useState(true);
  const [isValidCountry, setIsValidCountry] = useState(true);
  const [isValidCities, setIsValidCities] = useState(true);
  const [isValidStateProvince, setIsValidStateProvince] = useState(true);
  const [isValidZipCode, setIsValidZipCode] = useState(true);
  const [isValidAdditionalInfo, setIsValidAdditionalInfo] = useState(true);

  //error messages
  const [fullNameErrMsg, setFullNameErrMsg] = useState("");
  const [streetAddOneErrMsg, setStreetAddOneErrMsg] = useState("");
  const [streetAddTwoErrMsg, setStreetAddTwoErrMsg] = useState("");
  const [phoneNumErrMsg, setPhoneNumErrMsg] = useState("");
  const [countryErrMsg, setCountryErrMsg] = useState("");
  const [stateProvinceErrMsg, setStateProvinceErrMsg] = useState("");
  const [cityErrMsg, setCityErrMsg] = useState("");
  const [zipCodeErrMsg, setZipCodeErrMsg] = useState("");
  const [additionalInfoErrMsg, setAdditionalInfoErrMsg] = useState("");

  const [isSuccessLoading, setIsSuccessLoading] = useState(false);
  const [isItemRemoved, setisItemRemoved] = useState(false);
  const [orderItemsListing, setOrderItemsListing] = useState(null);
  const [orderItemsListingLoading, setOrderItemsListingLoading] =
    useState(false);

  useEffect(() => {
    if (isLoggedInIndication()) {
      let LoggedInUserData = async () => {
        let getUser = await getLoggedInUser();

        if (!_.isNull(getUser)) {
          let userInfo = JSON.parse(getUser);

          setLoggedInUser(userInfo);
          setIsLoggedInUser(true);

          setFullName(userInfo?.user_name);
          setPhoneNum(userInfo?.phone_number);

          _.filter(COUNTRY_OPTIONS, (item) => {
            if (item?.title == userInfo?.user_city?.country) {
              setCountry(item);
            }
          });
          setCitiesData(userInfo?.user_city);
          setStateProvinceData(userInfo?.user_city);
          setZipCode(userInfo?.zip_code);

          setPaymentMode(router?.query?.mode);
          setPaymentSuccess(router?.query?.success);
        }
      };

      LoggedInUserData();
    }
  }, []);

  useEffect(() => {
    if (isOrderItems()) {
      let CartItemData = async () => {
        let cartItems = await getOrderItems();

        if (!_.isNull(cartItems)) {
          setOrderItemsListingLoading(true);
          let getTotalPrice = localStorage.getItem("total_price");
          if (getTotalPrice) {
            setTotalPrice(parseInt(getTotalPrice));
          }
          let orderInfo = JSON.parse(cartItems);
          setOrderItems(orderInfo);
          if (orderInfo?.length > 0) {
            fetch(`${BASE_URL}/api/cart/get_order_items`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ items: orderInfo }),
            })
              .then((res) => res.json())
              .then((response) => {
                if (response?.status === true) {
                  setOrderItemsListing(response?.data);
                  setOrderItemsListingLoading(false);
                  setIsOrderItemsExist(true);
                } else {
                  Toast.fire({
                    icon: `${"error"}`,
                    title: `${response?.message}`,
                  });
                }
              });
          }
        }
      };

      CartItemData();
    } else {
      setOrderItems([]);
      setTotalPrice(0);
    }
  }, [isOrderItemsExist]);

  useEffect(() => {
    const setUserCountry = async () => {
      if (country.title != "Select Country") {
        const filteredStateData = _.filter(pageData?.citiesData, (item) => {
          if (item?.country?.toLowerCase() === country?.title?.toLowerCase()) {
            item.user_state = item?.state;
            return item;
          }
        });
        const duplicateFreeStateData = _.uniqBy(filteredStateData, "state");
        setStateProvince(duplicateFreeStateData);

        const filteredCitiesData = _.filter(filteredStateData, (item) => {
          if (
            item?.state?.toLowerCase() ===
            stateProvinceData?.state?.toLowerCase()
          ) {
            return item?.name;
          }
        });
        setCities(filteredCitiesData);
      }
    };
    setUserCountry();
  }, [country, stateProvinceData]);

  //   Api for purchase addition in database
  useEffect(() => {
    if (
      !_.isEmpty(paymentMode) &&
      !_.isEmpty(paymentSuccess) &&
      isLoggedInUser &&
      orderItemsListing?.data?.length > 0
    ) {
      const purchaseSuccessfull = async () => {
        let organizationID = _.uniqBy(
          orderItemsListing?.data,
          "organization_id"
        );
        if (organizationID?.length > 0) {
          organizationID = organizationID[0]?.organization_id;
        }
        setIsSuccessLoading(true);
        fetch(`${BASE_URL}/api/purchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: orderItemsListing?.data || [],
            buyer_id: loggedInUser?.id,
            total_price: orderItemsListing?.subTotal,
            organization_id: organizationID,
          }),
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.status == true) {
              setIsSuccessLoading(false);
              localStorage.removeItem("total_price");
              localStorage.removeItem("cart_item");

              Toast.fire({
                icon: `${"success"}`,
                title: "Your transaction has been done.",
              });

              setIsOrderItemsExist(false);
              router.push(ROUTES.PURCHASE);
            } else {
            }
          });
      };

      if (
        paymentMode == "checkout" &&
        paymentSuccess == "true" &&
        isOrderItemsExist
      ) {
        purchaseSuccessfull();
      }
    }
  }, [paymentMode, paymentSuccess, isOrderItemsExist, isLoggedInUser]);

  useEffect(() => {
    if (isSuccessLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSuccessLoading]);

  /* modal open handler */
  const modalClickHandler = () => {
    setIsOpenModal(true);
    document.body.style.overflow = "auto";
  };

  /* modal close handler */
  const closeModalHandler = () => {
    setIsOpenModal(false);
    document.body.style.overflow = "auto";
    document.body.style.overflow = "auto";
  };

  /* form validation function */
  const validateForm = () => {
    let isValid = true;

    setIsValidStreetAddOne(true);
    setIsValidStreetAddTwo(true);
    setIsValidPhoneNum(true);
    setIsValidCountry(true);
    setIsValidCities(true);
    setIsValidStateProvince(true);
    setIsValidZipCode(true);
    setIsValidAdditionalInfo(true);

    if (_.isEmpty(streetAddOne)) {
      streetAddOneRef.current.focus();
      setIsValidStreetAddOne(false);
      setStreetAddOneErrMsg(REQUIRED_BILLING_ADDRESS_ONE);
      isValid = false;
    }

    if (_.isEmpty(phoneNum) || phoneNum === "+") {
      setIsValidPhoneNum(false);
      setPhoneNumErrMsg(INVALID_PHONE_NUM);
      isValid = false;
    }

    if (country.title === "Select Country") {
      countryRef.current.focus();
      setIsValidCountry(false);
      setCountryErrMsg(INVALID_COUNTRY);
      isValid = false;
    }
    if (_.isEmpty(stateProvinceData)) {
      stateProvinceRef.current.focus();
      setIsValidStateProvince(false);
      setStateProvinceErrMsg(INVALID_STATE_PROVINCE);
      isValid = false;
    }
    if (_.isEmpty(citiesData)) {
      citiesRef.current.focus();
      setIsValidCities(false);
      setCityErrMsg(INVALID_CITY);
      isValid = false;
    }
    if (_.isEmpty(zipCode)) {
      zipCodeRef.current.focus();
      setIsValidZipCode(false);
      setZipCodeErrMsg(REQUIRED_ZIP_CODE);
      isValid = false;
    } else if (zipCode.length < 5 || zipCode.length > 8) {
      zipCodeRef.current.focus();
      setIsValidZipCode(false);
      isValid = false;
      setZipCodeErrMsg(INVALID_ZIP_CODE);
      isValid = false;
    }

    return isValid;
  };

  const placeAnOrder = () => {
    if (loggedInUser && validateForm()) {
      setSubmitBtnLoading(true);
      let organizationID = _.uniqBy(orderItemsListing?.data, "organization_id");
      if (organizationID?.length > 0) {
        organizationID = organizationID[0]?.organization_id;
      }
      let payload = {
        user_id: loggedInUser?.id,
        items: orderItemsListing?.data,
        organization_id: organizationID,
        user_details: {
          phoneNumber: phoneNum,
          city: citiesData?.name,
          country: country?.title,
          state: stateProvinceData?.state,
          name: fullName,
          address: streetAddOne,
          street2: streetAddTwo,
          zip_code: zipCode,
          addInfo: additionalInfo,
        },
      };

      fetch(`${BASE_URL}/api/purchase/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response?.status === true) {
            router.push(response?.data?.url);
            setSubmitBtnLoading(false);
          } else {
            Toast.fire({
              icon: `${"error"}`,
              title: `${response?.message}`,
            });
            setSubmitBtnLoading(false);
          }
        });
    }
  };

  const removeItemFromCart = (item, itemId) => {
    let arr = [];
    let totalPrice = 0;
    let removeCartItem = localStorage.getItem("cart_item");
    if (removeCartItem) {
      arr = JSON.parse(removeCartItem);
      let filterArr = arr?.filter((e) => {
        return e?.id != itemId;
      });
      let filterOrderListing = orderItemsListing?.data?.filter((e) => {
        return e?.id != itemId;
      });
      let getCartPrice = localStorage.getItem("total_price");
      if (getCartPrice) {
        totalPrice =
          parseFloat(getCartPrice).toFixed(2) -
          parseFloat(item?.price || item?.Price).toFixed(2);
      }
      let totalPriceOrderListing =
        orderItemsListing?.totalPrice - item?.price || item?.Price;

      localStorage.setItem("cart_item", JSON.stringify(filterArr));
      localStorage.setItem("total_price", totalPrice);
      setOrderItems(filterArr);
      setOrderItemsListing({
        data: filterOrderListing,
        subTotal: parseFloat(totalPriceOrderListing).toFixed(2),
        totalPrice: parseFloat(totalPriceOrderListing).toFixed(2),
      });
      setisItemRemoved(true);
      Toast.fire({
        icon: `${"success"}`,
        title: `Item has been removed from cart`,
      });
    } else {
      Toast.fire({
        icon: `${"error"}`,
        title: `Error occured`,
      });
    }
  };

  return (
    <>
      {isSuccessLoading ? (
        <div
          className="flex justify-center w-full h-full items-center bg-black bg-opacity-40 absolute left-0 right-0 top-0 bottom-0 m-auto"
          style={{ zIndex: 9999 }}
        >
          <BeatLoader color="#fff" sizeunit={"px"} size={14} />
        </div>
      ) : (
        ""
      )}
      <HeadMeta
        title="Dent247 | Cart Checkout"
        description="description"
        content="Dent247 | Cart Checkout"
      />
      <div>
        <Navbar isItemRemoved={isItemRemoved} />
        <div className="bg-light-blue">
          <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
            <div className="flex flex-col gap-4 mb-6 md:mb-12">
              <h1 className="font-inter font-bold text-bluish-600 text-2xl md:text-4xl capitalize">
                checkout
              </h1>
              <p className="font-inter font-medium text-light-blue-800 text-base">
                There are {orderItems?.length > 0 ? orderItems?.length : "0"}{" "}
                item in your cart
              </p>
            </div>

            {/* Billing Form */}
            <form>
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-between items-stretch">
                {/* left column */}
                <div className="flex-2">
                  <h2 className="font-inter font-bold text-bluish-600 text-xl md:text-2xl capitalize mb-6">
                    billing details
                  </h2>

                  <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                    {/* full name input field */}
                    <div className="flex flex-col gap-2 my-2 flex-1">
                      <label
                        for="full_name"
                        className={
                          "block text-sm font-normal text-gray-900 dark:text-gray-300"
                        }
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="full_name"
                        className={`${
                          !_.isEmpty(fullName)
                            ? "cursor-not-allowed bg-gray-100"
                            : ""
                        } bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        placeholder="First name*"
                        onChange={(e) =>
                          setFullName(e.target.value, setIsValidFullName(true))
                        }
                        value={fullName}
                        ref={fullNameRef}
                        maxLength={100}
                        disabled={!_.isEmpty(fullName) ? true : false}
                      />
                      {!isValidFullName ? (
                        <span className={"text-sm text-red-500"}>
                          {fullNameErrMsg}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    {/* phoneNumber input field */}
                    <div className="flex flex-col gap-2 my-2 flex-1">
                      <label
                        for="phone_num"
                        className="block text-sm font-normal text-gray-900 dark:text-gray-300"
                      >
                        Phone Number *
                      </label>

                      <PhoneInput
                        country={"us"}
                        onlyCountries={["us", "ca"]}
                        id="phone_num"
                        inputClass="phone-num-input"
                        containerClass="phoneCustomWrap"
                        placeholder="Phone *"
                        onChange={(value) => {
                          setPhoneNum(`+${value}`, setIsValidPhoneNum(true));
                        }}
                        value={_.isEmpty(phoneNum) ? "+1" : phoneNum}
                        ref={phoneNumRef}
                      />

                      {!isValidPhoneNum ? (
                        <span className={"text-sm text-red-500"}>
                          {phoneNumErrMsg}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                    {/* street address one input field */}
                    <div className="flex flex-col gap-2 my-2 flex-1">
                      <label
                        for="street_add_one"
                        className={
                          "block text-sm font-normal text-gray-900 dark:text-gray-300"
                        }
                      >
                        Address *
                      </label>
                      <input
                        type="text"
                        id="street_add_one"
                        className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Address*"
                        onChange={(e) =>
                          setStreetAddOne(
                            e.target.value,
                            setIsValidStreetAddOne(true)
                          )
                        }
                        value={streetAddOne}
                        ref={streetAddOneRef}
                        maxLength={1000}
                      />
                      {!isValidStreetAddOne ? (
                        <span className={"text-sm text-red-500"}>
                          {streetAddOneErrMsg}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    {/* street address two input field */}
                    <div className="flex flex-col gap-2 my-2 flex-1">
                      <label
                        for="street_add_two"
                        className={
                          "block text-sm font-normal text-gray-900 dark:text-gray-300"
                        }
                      >
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        id="street_add_two"
                        className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Address Line 2*"
                        onChange={(e) =>
                          setStreetAddTwo(
                            e.target.value,
                            setIsValidStreetAddTwo(true)
                          )
                        }
                        value={streetAddTwo}
                        ref={streetAddTwoRef}
                        maxLength={1000}
                      />
                      {!isValidStreetAddTwo ? (
                        <span className={"text-sm text-red-500"}>
                          {streetAddTwoErrMsg}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                    {/* country input field */}
                    <div className="flex flex-col gap-2 my-2 flex-1">
                      <label className="block text-sm font-normal text-gray-900 dark:text-gray-300">
                        Country *
                      </label>

                      <ListBoxComponents
                        valueKey={country}
                        valueSetter={setCountry}
                        optionsList={COUNTRY_OPTIONS}
                        type={"country"}
                        isRef={true}
                        refType={countryRef}
                      />
                      {!isValidCountry ? (
                        <span className={"text-sm text-red-500"}>
                          {countryErrMsg}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    {/* state input field */}
                    <div className="flex flex-col gap-2 my-2 flex-1">
                      <label className="block text-sm font-normal text-gray-900 dark:text-gray-300">
                        State/Province *
                      </label>
                      <ListBoxComponents
                        valueKey={stateProvinceData}
                        valueSetter={setStateProvinceData}
                        optionsList={stateProvince}
                        type={"country"}
                        isRef={true}
                        refType={stateProvinceRef}
                      />
                      {!isValidStateProvince ? (
                        <span className={"text-sm text-red-500"}>
                          {stateProvinceErrMsg}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                    {/* cities input field */}
                    <div className="flex flex-col gap-2 my-2 flex-1">
                      <label className="block text-sm font-normal text-gray-900 dark:text-gray-300">
                        City *
                      </label>

                      <ListBoxComponents
                        valueKey={citiesData}
                        valueSetter={setCitiesData}
                        optionsList={cities}
                        type={"city"}
                        isRef={true}
                        refType={citiesRef}
                      />

                      {!isValidCities ? (
                        <span className={"text-sm text-red-500"}>
                          {cityErrMsg}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    {/* zipcode input field */}
                    <div className="flex flex-col gap-2 my-2 flex-1">
                      <label
                        for="zipcode"
                        className={
                          "block text-sm font-normal text-gray-900 dark:text-gray-300"
                        }
                      >
                        Postal Code/Zip *
                      </label>
                      <input
                        type="text"
                        id="zipcode"
                        className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Postal Code/Zip *"
                        onChange={(e) =>
                          setZipCode(e.target.value, setIsValidZipCode(true))
                        }
                        value={zipCode}
                        ref={zipCodeRef}
                      />
                      {!isValidZipCode ? (
                        <span className={"text-sm text-red-500"}>
                          {zipCodeErrMsg}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                    {/* additional info input field */}
                    <div className="flex flex-col gap-2 my-2 flex-1">
                      <label
                        for="additional_info"
                        className={
                          "block text-sm font-normal text-gray-900 dark:text-gray-300"
                        }
                      >
                        Additional Information
                      </label>
                      <textarea
                        type="text"
                        id="additional_info"
                        className="resize-none h-44 bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Additional Information"
                        onChange={(e) =>
                          setAdditionalInfo(
                            e.target.value,
                            setIsValidAdditionalInfo(true)
                          )
                        }
                        value={additionalInfo}
                        ref={additionalInfoRef}
                      ></textarea>
                      {!isValidAdditionalInfo ? (
                        <span className={"text-sm text-red-500"}>
                          {additionalInfoErrMsg}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  {!isLoggedInUser ? (
                    <>
                      {isOpenModal && (
                        <Modal
                          isOpen={isOpenModal}
                          closeModalHandler={closeModalHandler}
                          description=""
                          title={"Login/Signup required"}
                          loginSignUpTextDesc={
                            "You must be logged in to place an order."
                          }
                        />
                      )}
                      <p
                        className="mt-8 font-medium font-inter text-light-blue-800 text-base capitalize cursor-pointer hover:text-blue-600"
                        onClick={modalClickHandler}
                      >
                        create account
                      </p>
                    </>
                  ) : (
                    ""
                  )}
                </div>

                {/* right column */}
                <div className="flex-1">
                  <h2 className="font-inter font-bold text-bluish-600 text-xl md:text-2xl capitalize mb-8">
                    your order
                  </h2>
                  {/* product info box */}
                  <div className="shadow-3xl border rounded-lg bg-white border border-greyish-600">
                    {/* order title sec */}
                    <div className="p-3 sm:py-4 sm:px-6 bg-greyish-700 rounded-tl-md rounded-tr-md flex items-center justify-between">
                      <h5 className="text-bluish-600 text-base capitalize font-inter font-medium">
                        item
                      </h5>
                      <h6 className="text-bluish-600 text-base capitalize font-inter font-medium">
                        subtotal
                      </h6>
                    </div>

                    {/* order items array */}
                    <div className="flex flex-col">
                      {orderItems && _.size(orderItems) > 0 ? (
                        orderItemsListingLoading ? (
                          <div className="flex justify-center items-center">
                            <BeatLoader
                              color="#2563eb"
                              sizeunit={"px"}
                              size={14}
                            />
                          </div>
                        ) : (
                          orderItemsListing?.data?.map((item) => {
                            return (
                              <div
                                key={item?.id}
                                className="p-3 sm:p-6 flex flex-row items-stretch justify-between border-b border-greyish-600"
                              >
                                <div className="flex gap-4 items-center">
                                  <img
                                    src={
                                      item?.image
                                        ? item?.image
                                        : "/productFallBackImg.png"
                                    }
                                    alt={item?.title ?? "product"}
                                    className="w-8 h-8 sm:w-12 sm:h-12 border border-blue-600 rounded-2xl object-cover"
                                  />
                                  <div className="flex flex-col gap-2">
                                    <h6 className="text-bluish-600 text-sm sm:text-base capitalize font-inter font-medium">
                                      {item?.title}
                                    </h6>
                                    <span
                                      onClick={() =>
                                        removeItemFromCart(item, item?.id)
                                      }
                                      className="cursor-pointer font-inter font-normal text-xs text-red-700 capitalize hover:underline"
                                    >
                                      remove
                                    </span>
                                  </div>
                                </div>

                                <h6 className="text-bluish-600 text-sm sm:text-base capitalize font-inter font-semibold">
                                  {`$${item?.price || 0}`}
                                </h6>
                              </div>
                            );
                          })
                        )
                      ) : (
                        <h6 className="p-6 border-b border-greyish-600 text-center text-bluish-600 text-base capitalize font-inter font-semibold">
                          No Items Selected
                        </h6>
                      )}
                    </div>

                    {/* payment info sec */}
                    <div className="p-3 sm:p-6 flex flex-col gap-y-6 sm:gap-y-4 border-b border-greyish-600">
                      {/* subtotal */}
                      <div className="flex items-center justify-between">
                        <h6 className="text-bluish-600 text-sm sm:text-base capitalize font-inter font-medium">
                          subtotal
                        </h6>
                        <h6 className="text-bluish-600 text-sm sm:text-base capitalize font-inter font-semibold">
                          $
                          {orderItems?.length > 0
                            ? orderItemsListing?.subTotal
                            : 0}
                        </h6>
                      </div>

                      {/* discount */}
                      {/* <div className="flex items-center justify-between">
                        <h6 className="text-bluish-600 text-sm sm:text-base capitalize font-inter font-medium">
                          discount (-)
                        </h6>
                        <h6 className="text-bluish-600 text-sm sm:text-base capitalize font-inter font-semibold">
                          $9
                        </h6>
                      </div> */}
                    </div>

                    {/* total sec */}
                    <div className="p-3 sm:p-6 flex items-center justify-between">
                      <h5 className="text-bluish-600 text-sm sm:text-base capitalize font-inter font-medium">
                        total
                      </h5>
                      <h6 className="text-bluish-600 text-sm sm:text-base capitalize font-inter font-semibold">
                        $
                        {orderItems?.length > 0
                          ? orderItemsListing?.subTotal
                          : 0}
                      </h6>
                    </div>
                  </div>
                  {/* payment info box */}
                  <div className="mt-10 shadow-3xl border rounded-lg bg-white border border-greyish-600">
                    {/* payment title sec */}
                    <div className="py-4 px-6 bg-greyish-700 rounded-tl-md rounded-tr-md flex items-stretch">
                      <h5 className="text-bluish-600 text-xl md:text-2xl capitalize font-inter font-bold">
                        payment
                      </h5>
                    </div>

                    {/* payment type info sec */}
                    <div className="p-3 sm:p-6 flex gap-2 items-center">
                      <input
                        checked={isPaymentWithStripe}
                        id="default-radio-2"
                        type="radio"
                        value="with stripe"
                        name="default-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        for="default-radio-2"
                        className="font-medium font-inter text-light-blue-800 text-sm sm:text-base capitalize"
                      >
                        With Stripe
                      </label>
                    </div>

                    {/* payment card options */}
                    <div className="p-3 sm:p-6 flex gap-2 items-center justify-end sm:justify-start">
                      <img
                        src={"/visa-card.png"}
                        alt={"visa card"}
                        className={"w-8 sm:w-12 h-auto object-contain"}
                      />
                      <img
                        src={"/master-card.png"}
                        alt={"master card"}
                        className={"w-6 sm:w-8 h-auto object-contain"}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={
                      !isLoggedInUser ||
                      submitBtnLoading ||
                      orderItems?.length == 0
                        ? true
                        : false
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      orderItems && orderItems?.length > 0
                        ? placeAnOrder()
                        : undefined;
                    }}
                    className={`${
                      !isLoggedInUser ||
                      submitBtnLoading ||
                      orderItems?.length == 0
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    } w-full h-14 mt-6 md:mt-8 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    {submitBtnLoading ? (
                      <BeatLoader color="#fff" sizeunit={"px"} size={8} />
                    ) : (
                      ""
                    )}
                    {submitBtnLoading ? "" : "place an order"}
                  </button>{" "}
                </div>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  // Pass data to the page via props
  // const getPageData = await fetch(`${BASE_URL}/api/edit_profile/getdata`);
  // const data = await getPageData?.json();
  let errorCount = 0;

  let obj = {
    userTypeList: [],
    areasOfInterest: [],
    citiesData: [],
  };

  const citiesData = await supabase.from("cities").select("*");
  if (citiesData?.data) {
    obj.citiesData = citiesData?.data;
  } else {
    errorCount += 1;
  }

  if (errorCount > 0) {
    return {
      props: {
        pageData: obj,
        error: {
          message: "Error Occured",
        },
      },
    };
  } else {
    return {
      props: {
        pageData: obj,
        error: null,
      },
    };
  }
}
