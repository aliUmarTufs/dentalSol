import { CalendarIcon, UserIcon } from "@heroicons/react/outline";
import { ClockIcon, MailIcon, PhoneIcon } from "@heroicons/react/solid";
import { Markup } from "interweave";
import _ from "lodash";
import moment from "moment";
import * as cheerio from "cheerio";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import {
  BASE_URL,
  DATE_FORMAT_THREE,
  DEAL_TYPE,
  ENTITY_TYPE,
  ENTITY_TYPE_ARRAY,
  NOT_FOUND,
  ROUTES,
  Toast,
} from "../../constants";
import CustomButton from "../CustomButton";
import Modal from "../Modal";
import AlertBox from "../AlertBox";
import VideosSection from "../VideoSection";
import { useSockets } from "../../context/socket.context";
import ConfirmationModal from "../ConfirmationModal";
import { MainContext } from "../../context-api/MainContext";

export default function InfoDetailSec({
  objectType,
  type,
  dealAvailHandler,
  objectHandler,
  isFav,
  setIsFav,
  setisItemAdded,
}) {
  const { socket } = useSockets();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOrganizationSameItem, setIsOrganizationSameItem] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setIsLoggedInUser] = useState(null);
  const [dealDetails, setDealDetail] = useState(null);
  const { MainState, dispatch } = useContext(MainContext);

  useEffect(() => {
    // const userDetails = localStorage.getItem("userData");
    const userDetails = MainState?.userData;

    if (!_.isNull(userDetails)) {
      //   setIsLoggedInUser(JSON.parse(userDetails));
      setIsLoggedInUser(userDetails);

      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const modalClickHandler = () => {
    setIsOpenModal(true);
    document.documentElement.style.overflow = "auto";
  };
  const closeModalHandler = () => {
    setIsOpenModal(false);
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  };

  const closeModalCartHandler = () => {
    setIsOrganizationSameItem(false);
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  };

  const addDifferentOrganizationItem = (item) => {
    localStorage.removeItem("total_price");
    localStorage.removeItem("cart_item");
    addToCart(item);
    setIsOrganizationSameItem(false);
  };

  const addToCart = (item) => {
    let arr = [];
    let totalPrice = 0;
    let addToCartItem = localStorage.getItem("cart_item");
    if (addToCartItem) {
      arr = JSON.parse(addToCartItem);
      let filterArr = arr?.filter((e) => {
        return e?.id == item?.id;
      });

      let filterItemOragnizationSync = arr?.filter((e) => {
        return e?.organization_id != item?.organization;
      });
      if (filterArr && filterArr?.length > 0) {
        Toast.fire({
          icon: `${"error"}`,
          title: `Item has already added into cart`,
        });
      } else if (
        filterItemOragnizationSync &&
        filterItemOragnizationSync?.length > 0
      ) {
        setIsOrganizationSameItem(true);
      } else {
        let itemObj = {
          id: item?.id,
          title: item?.name || item?.title,
          image: item?.thumbnail,
          price: item?.price || item?.Price,
          quantity: 1,
          organization_id: item?.organization,
          is_deal: item?.is_deal,
          unit: 1,
          item_type: item?.item_type,
          item_zoho_id: item?.item_zoho_id,
        };
        if (item?.is_deal === true) {
          if (item?.dealDetail?.deal_type == "free_item") {
            itemObj.unit = parseInt(item?.dealDetail?.item_quantity);
            itemObj.price = parseFloat(
              parseInt(item?.dealDetail?.item_quantity) *
                parseInt(item?.price || item?.Price)
            ).toFixed();
          } else if (item?.dealDetail?.deal_type == "discounted") {
            var dealPriceDiscount = item?.dealDetail?.quantity / 100;
            let ePrice = item?.price || item?.Price;
            var priceAfterDiscount = parseFloat(
              ePrice - ePrice * dealPriceDiscount
            ).toFixed(2);
            itemObj.unit = 1;
            itemObj.price = priceAfterDiscount;
          }
          itemObj.deal_type = item?.dealDetail?.deal_type;
        }
        arr?.push(itemObj);
        let orderTotalPrice = arr.map((e) => {
          if (e?.price) {
            totalPrice = totalPrice + parseInt(e?.price || e?.Price || 0);
          }
        });
        localStorage.setItem("cart_item", JSON.stringify(arr));
        setisItemAdded(true);
        localStorage.setItem("total_price", totalPrice);

        Toast.fire({
          icon: `${"success"}`,
          title: `Item has been added into cart`,
        });
      }
    } else {
      let itemObj = {
        id: item?.id,
        title: item?.name || item?.title,
        image: item?.thumbnail,
        price: item?.price || item?.Price,
        quantity: 1,
        organization_id: item?.organization,
        is_deal: item?.is_deal,
        unit: 1,
        item_type: item?.item_type,
        item_zoho_id: item?.item_zoho_id,
      };
      if (item?.is_deal === true) {
        if (item?.dealDetail?.deal_type == "free_item") {
          console.log("Here we are");
          itemObj.unit = parseInt(item?.dealDetail?.item_quantity);
          itemObj.price = parseFloat(
            parseInt(item?.dealDetail?.item_quantity) *
              parseInt(item?.price || item?.Price)
          ).toFixed();

          console.log(
            parseFloat(
              parseInt(item?.dealDetail?.item_quantity) *
                parseInt(item?.price || item?.Price)
            ).toFixed()
          );
        } else if (item?.dealDetail?.deal_type == "discounted") {
          var dealPriceDiscount = item?.dealDetail?.quantity / 100;
          let ePrice = item?.price || item?.Price;
          var priceAfterDiscount = parseFloat(
            ePrice - ePrice * dealPriceDiscount
          ).toFixed(2);
          itemObj.unit = 1;
          itemObj.price = priceAfterDiscount;
        }
        itemObj.deal_type = item?.dealDetail?.deal_type;
      }
      arr.push(itemObj);
      totalPrice = item?.price || item?.Price || 0;
      localStorage.setItem("cart_item", JSON.stringify(arr));
      setisItemAdded(true);
      localStorage.setItem("total_price", totalPrice);

      Toast.fire({
        icon: `${"success"}`,
        title: `Item has been added into cart`,
      });
    }
  };

  const articleBody = cheerio.load(
    objectType?.article_body || objectType?.long_description || ""
  );
  const articleText = `<p>${articleBody.text().substring(0, 500)}</p>`;

  const hasThumbnail =
    (!_.isNull(objectType?.thumbnail) && objectType?.thumbnail) ||
    (!_.isNull(objectType?.logo) && objectType?.logo);
  const hasUserImg = !_.isUndefined(objectType?.notable_figures?.picture);

  useEffect(() => {
    setDealDetail(objectType?.dealDetail);
  }, [objectType]);

  let entityPrice = objectType?.Price || objectType?.price;

  var dealPriceDiscount = dealDetails?.quantity / 100;
  var priceAfterDiscount = parseFloat(
    entityPrice - entityPrice * dealPriceDiscount
  ).toFixed(2);

  const favouriteUnfavouriteItem = async (event) => {
    event.preventDefault();

    const payload = {
      item_id: dealDetails?.id,
      user_id: loggedInUser?.id,
      type: "deals",
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

          if (data.data[0]?.is_like === true) {
            setIsFav(true);
            // socket.emit("createRoom" , {
            // 	room_name : ""
            // })
          } else {
            setIsFav(false);
          }
        } else {
          setIsOpenModal(true);
        }
      });
  };
  return (
    <>
      {objectType?.isDealAvail ? (
        <AlertBox type={"info"} text="You have already availed this deal." />
      ) : (
        <></>
      )}
      <h6 className="text-sm sm:text-lg font-medium text-black mb-5 capitalize">
        {type} &gt;{" "}
        {objectType?.product_category?.parent_category ||
          objectType?.directory_frontend_categories?.name ||
          objectType?.category ||
          objectType?.article_categories?.label ||
          "Uncategorized"}{" "}
        &gt;
        <span className="text-blue-600">
          {" "}
          {`${
            type === ENTITY_TYPE.COURSES
              ? "Course"
              : type === ENTITY_TYPE.PRODUCTS
              ? "Product"
              : type === ENTITY_TYPE.ARTICLES
              ? "Article"
              : "Service"
          } detail`}
        </span>
      </h6>
      <div className="flex justify-between flex-col lg:flex-row gap-6 sm:gap-10">
        <div className="flex flex-col flex-1 customHeight">
          <div
            className={`relative rounded-2xl border-black border border-opacity-20 overflow-hidden ${
              hasThumbnail
                ? ``
                : `bg-bluish-100 h-full customHeightResp flex items-center justify-center`
            }`}
          >
            <img
              src={`${
                hasThumbnail
                  ? objectType?.thumbnail || objectType?.logo
                  : type === ENTITY_TYPE.COURSES
                  ? `/courseFallBackImg.png`
                  : type === ENTITY_TYPE.PRODUCTS
                  ? `/productFallBackImg.png`
                  : `/serviceFallBackImg.png`
              }`}
              alt={`${type}`}
              className={`${
                hasThumbnail
                  ? `w-full object-cover h-full`
                  : `w-24 md:w-36 object-contain`
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 flex-1">
          <h1 className="text-bluish-700 text-xl md:text-3xl xl:text-4xl leading-normal font-bold mb-2 capitalize">
            {objectType?.title ||
              objectType?.name ||
              objectType?.company_name ||
              objectType?.company?.name ||
              "N/A"}
          </h1>

          <div className="flex justify-between">
            <div className="flex flex-col gap-6">
              {objectType?.organizations?.name ||
              objectType?.organization?.name ||
              objectType?.notable_figures?.first_name ? (
                <>
                  <div className="flex gap-2 items-center">
                    <div
                      className={`w-10 h-10 ${
                        hasUserImg ? "bg-transparent" : "bg-blue-600"
                      } rounded-full flex items-center justify-center`}
                    >
                      <img
                        src={`${
                          hasUserImg
                            ? objectType?.notable_figures?.picture
                            : type === ENTITY_TYPE.COURSES
                            ? "/course-org-icon.png"
                            : type === ENTITY_TYPE.PRODUCTS
                            ? "/product-org-icon.png"
                            : type === ENTITY_TYPE.SERVICES
                            ? "/service-org-icon.png"
                            : type === ENTITY_TYPE.ARTICLES
                            ? "/service-org-icon.png"
                            : "/service-org-icon.png"
                        }`}
                        alt={`${
                          type === ENTITY_TYPE.COURSES
                            ? "org-course"
                            : type === ENTITY_TYPE.PRODUCTS
                            ? "org-product"
                            : "org-service"
                        }`}
                        className={`${
                          hasUserImg
                            ? "rounded-full w-full h-full object-cover"
                            : "rounded-none"
                        }`}
                      />
                    </div>
                    <h6 className="font-normal text-base text-black">
                      {objectType?.organizations?.name ||
                        objectType?.organization?.name ||
                        objectType?.notable_figures?.first_name}
                    </h6>
                  </div>
                </>
              ) : (
                ""
              )}

              {type === ENTITY_TYPE.COURSES ? (
                <>
                  {objectType?.date ? (
                    <div className="flex gap-2 items-center">
                      <div className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-600">
                        <CalendarIcon className=" text-white w-6 h-6" />
                      </div>
                      <h6 className="font-normal text-base text-black">
                        {objectType?.date}
                      </h6>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}

              {type === ENTITY_TYPE.SERVICES ? (
                <>
                  {objectType?.contact_phone ? (
                    <>
                      <div className="flex gap-2 items-center">
                        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-600">
                          <PhoneIcon className=" text-white w-6 h-6" />
                        </div>

                        <Link href={`tel:${objectType?.contact_phone}`}>
                          <span className="font-normal text-base text-black cursor-pointer hover:underline">
                            {objectType?.contact_phone}
                          </span>
                        </Link>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
              {type === ENTITY_TYPE.SERVICES ? (
                <>
                  {objectType?.contact_phone ? (
                    <>
                      <div className="flex gap-2 items-center">
                        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-600">
                          <MailIcon className=" text-white w-6 h-6" />
                        </div>

                        <Link href={`mailto:${objectType?.contact_email}`}>
                          <span className="font-normal text-base text-black cursor-pointer hover:underline">
                            {objectType?.contact_email}
                          </span>
                        </Link>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}

              {type === ENTITY_TYPE.ARTICLES ? (
                <>
                  {objectType?.time_published ? (
                    <>
                      <div className="flex gap-2 items-center">
                        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-600">
                          <CalendarIcon className=" text-white w-6 h-6" />
                        </div>
                        <h6 className="font-normal text-base text-black">
                          {moment(objectType?.time_published).format(
                            DATE_FORMAT_THREE
                          )}
                        </h6>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}

              {type === ENTITY_TYPE.ARTICLES ? (
                <>
                  {" "}
                  {objectType?.authorUser?.short_bio ||
                  objectType?.users?.short_bio ||
                  objectType?.users?.user_name ||
                  objectType?.users?.username ? (
                    <div className="flex gap-2 flex-col ">
                      <h4 className="font-normal text-xl text-bluish-700">
                        Author Bio:
                      </h4>
                      <h6 className="font-normal text-base text-black">
                        {objectType?.authorUser?.short_bio ||
                          objectType?.users?.short_bio ||
                          objectType?.users?.user_name ||
                          objectType?.users?.username}
                      </h6>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}

              {objectType?.is_deal === true ? (
                <>
                  <h6 className="font-bold text-lg text-bluish-700 sm:text-2xl font-poppins">
                    {dealDetails?.deal_type === DEAL_TYPE.FREE_ITEM ? (
                      `Buy ${dealDetails?.item_quantity} Get ${dealDetails?.free_quantity} Free`
                    ) : dealDetails?.deal_type === DEAL_TYPE.DISCOUNTED ? (
                      <>
                        <div className="flex gap-4 items-center">
                          {_.isUndefined(entityPrice) ||
                          entityPrice === 0 ||
                          _.isNull(entityPrice) ? (
                            "No Price found"
                          ) : (
                            <>
                              <span className="line-through font-medium">
                                {`$${entityPrice}`}
                              </span>
                              <span>{`$${priceAfterDiscount}`}</span>
                              <span
                                className="w-px bg-bluish-700"
                                style={{
                                  height: 18,
                                }}
                              ></span>
                              <span>{`${dealDetails?.quantity}% off`}</span>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </h6>
                  <h6 className="font-bold text-lg text-bluish-700 sm:text-2xl font-poppins">
                    {dealDetails?.deal_type === DEAL_TYPE.FREE_ITEM
                      ? entityPrice
                        ? `$ ${entityPrice}`
                        : "0"
                      : ""}
                  </h6>
                </>
              ) : (
                <h6 className="font-bold text-lg text-bluish-700 sm:text-2xl">
                  {_.isNull(entityPrice) || entityPrice === 0
                    ? "No Price."
                    : `${entityPrice ? "$" : entityPrice ? "$" : ""} ${
                        entityPrice || ""
                      }`}
                </h6>
              )}
            </div>

            {objectType?.is_deal === true ? (
              <>
                <div
                  className="relative h-8 w-8"
                  onClick={favouriteUnfavouriteItem}
                >
                  {isFav === true ? (
                    <img
                      src="/fav-detail.png"
                      className="w-full h-auto text-red-600 cursor-pointer"
                    />
                  ) : (
                    <img
                      src="/unfav-detail.png"
                      className="w-full h-auto cursor-pointer"
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

          {objectType?.is_deal === true ? (
            <>
              <h6 className="font-normal text-bluish-700 text-base">
                Deal Till: {objectType?.dealDetail?.expiry_data}
              </h6>
              <form>
                <div className="flex flex-col gap-2 my-4">
                  <label
                    for="add_coupon"
                    className="font-medium text-bluish-600 text-base"
                  >
                    Add Coupon
                  </label>
                  <div className="flex gap-2 flex-col sm:flex-row flex-1">
                    <input
                      id="add_coupon"
                      className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Type Here"
                      // onChange={(e) => setCouponCode(e.target.value)}
                      value={
                        dealDetails?.coupon_code ?? "No coupon code available"
                      }
                      // ref={emailRef}
                      disabled={true}
                    />
                  </div>
                </div>
              </form>
            </>
          ) : (
            ""
          )}

          <div className="flex flex-col md:flex-row gap-4">
            {type != ENTITY_TYPE.SERVICES &&
            objectType?.is_deal === true &&
            !_.isUndefined(dealAvailHandler) ? (
              <>
                <CustomButton
                  btnText={"Avail Deal"}
                  // clickHandler={
                  //   loggedInUser && loggedInUser?.id
                  //     ? dealAvailHandler
                  //     : modalClickHandler
                  // }
                  clickHandler={() => addToCart(objectType)}
                  isPrimary={true}
                  borderRadiusClass={"rounded-md"}
                  loggedInUser={loggedInUser?.id ? true : false}
                  // isDisabled={objectType?.isDealAvail}
                />
                {isOpenModal && (
                  <Modal
                    isOpen={isOpenModal}
                    closeModalHandler={closeModalHandler}
                    description=""
                    title={"Login/Signup required"}
                    loginSignUpTextDesc={"You must be logged in to avail deal."}
                  />
                )}
              </>
            ) : (
              ""
            )}

            {type === ENTITY_TYPE.SERVICES ? (
              <>
                {!_.isNull(objectType.website) ? (
                  <CustomButton
                    btnText={"Provider's Link"}
                    redirectURL={`${objectType.website}`}
                    isPrimary={true}
                    borderRadiusClass={"rounded-md"}
                  />
                ) : null}
              </>
            ) : (
              ""
            )}

            {type === ENTITY_TYPE.COURSES ? (
              <>
                {objectType?.buyable === true &&
                objectType?.is_deal !== true &&
                objectType?.organizations?.organization_user !=
                  loggedInUser?.id ? (
                  <CustomButton
                    btnText={"Register with dent247"}
                    // redirectURL={ROUTES.REGISTER}
                    clickHandler={() => addToCart(objectType)}
                    isPrimary={true}
                    borderRadiusClass={"rounded-md"}
                  />
                ) : null}
                {objectType?.is_deal !== true ? (
                  <>
                    {!_.isNull(objectType?.provider_link) ? (
                      <CustomButton
                        btnText={"Provider's Link"}
                        redirectURL={`${objectType?.provider_link}`}
                        isPrimary={true}
                        borderRadiusClass={"rounded-md"}
                      />
                    ) : null}
                  </>
                ) : null}
              </>
            ) : type === ENTITY_TYPE.PRODUCTS ? (
              <>
                {!_.isUndefined(objectHandler) && !_.isNull(objectType) ? (
                  objectType?.organizations?.organization_user !=
                  loggedInUser?.id ? (
                    <CustomButton
                      btnText={"Request More Info"}
                      clickHandler={objectHandler}
                      isPrimary={false}
                      borderRadiusClass={"rounded-md"}
                    />
                  ) : (
                    <></>
                  )
                ) : (
                  ""
                )}
                {type == ENTITY_TYPE.PRODUCTS &&
                objectType?.is_deal === false ? (
                  objectType?.organizations?.organization_user !=
                  loggedInUser?.id ? (
                    <CustomButton
                      btnText={"Add To Cart"}
                      clickHandler={() => addToCart(objectType)}
                      isPrimary={false}
                      borderRadiusClass={"rounded-md"}
                    />
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
              </>
            ) : (
              ""
            )}

            {isOrganizationSameItem ? (
              <ConfirmationModal
                isOpen={isOrganizationSameItem}
                closeModalHandler={closeModalCartHandler}
                title={"Remove Your Previous Items?"}
                description={
                  "You still have items from another organization. Shall we start over with a fresh cart?"
                }
                successBtnText={"Sure"}
                cancelBtnText={"Cancel"}
                successHandler={() => addDifferentOrganizationItem(objectType)}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      {objectType?.video ? <VideosSection objectType={objectType} /> : <></>}

      <div className="flex flex-col gap-3 mt-8 md:mt-14">
        <h4 className="font-medium text-xl text-bluish-700">Description</h4>

        {ENTITY_TYPE_ARRAY.includes(type) ? (
          <>
            {!isLoggedIn ? (
              <>
                <Markup
                  content={articleText}
                  className={
                    "desc_style font-inter text-bluish-700 font-normal"
                  }
                />
                <span
                  className="text-blue-600 opacity-90 hover:underline hover:opacity-100 cursor-pointer"
                  onClick={modalClickHandler}
                >
                  Read More
                </span>
              </>
            ) : (
              <>
                {!_.isNull(objectType?.article_body) ||
                !_.isNull(objectType?.long_description) ? (
                  <Markup
                    content={
                      objectType?.article_body || objectType?.long_description
                    }
                    className={
                      "desc_style font-inter text-bluish-700 font-normal"
                    }
                  />
                ) : (
                  "N/A"
                )}
              </>
            )}

            {isOpenModal && (
              <Modal
                isOpen={isOpenModal}
                closeModalHandler={closeModalHandler}
                description=""
                title={"Login/Signup required"}
                loginSignUpTextDesc={`You must be logged in to read the full description.`}
              />
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
