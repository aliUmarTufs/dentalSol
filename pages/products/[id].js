import { useRouter } from "next/router";
// import { cookies } from "next/headers"
import cookie from "cookie";

import { useContext, useEffect, useState } from "react";
import {
  Footer,
  Navbar,
  HeadMeta,
  RequestModal,
  CustomerReviews,
  RelatedSlider,
  InfoDetailSec,
  NotFound,
} from "../../components";
import { supabase } from "../../lib/supabaseClient";
import { BASE_URL, getLoggedInUser, Toast } from "../../constants";
import _ from "lodash";

import { BeatLoader } from "react-spinners";
import { MainContext } from "../../context-api/MainContext";

export default function ProductDetailsPage({ product }) {
  const [company, setCompany] = useState(null);
  const router = useRouter();
  const loading = !product;

  const [requestData, setRequestData] = useState(null);
  const [isFav, setIsFav] = useState(false);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loggedInUser, setIsLoggedInUser] = useState(null);

  const [availDeal, setAvailDeal] = useState(null);
  const [successfullLoading, setSuccessfullLoading] = useState(false);
  const [isItemAdded, setisItemAdded] = useState(false);
  const { MainState, dispatch } = useContext(MainContext);

  useEffect(() => {
    // const userDetails = localStorage.getItem("userData");
    const userDetails = MainState?.userData;

    if (!_.isNull(userDetails)) {
      // setIsLoggedInUser(JSON.parse(userDetails));
      setIsLoggedInUser(userDetails);

      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const requestClickHandler = () => {
    setIsOpenModal(true);
  };

  const closeModalHandler = () => {
    setIsOpenModal(false);
    document.body.style.overflow = "auto";
  };

  const userDealAvail = async () => {
    let payload = {
      user_id: loggedInUser?.id,
      deal_id: product?.dealDetail?.id,
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

  useEffect(() => {
    const productListFunct = async () => {
      // if (!loading) {
      if (router.query.id) {
        let getuser = await getLoggedInUser();
        let loggedInUserUrl;
        if (!_.isNull(getuser)) {
          loggedInUserUrl = JSON.parse(getuser);
          loggedInUserUrl = loggedInUserUrl?.id;
        }

        fetch(
          !_.isUndefined(loggedInUserUrl)
            ? `${BASE_URL}/api/products?id=${router.query.id}&user_id=${loggedInUserUrl}`
            : `${BASE_URL}/api/products?id=${router.query.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
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
      // }
    };
    productListFunct();
  }, [product, router]);

  return (
    <>
      <HeadMeta
        title={`Dent247 | Product | ${product?.name ?? "Loading"}`}
        description="description"
        content={`Dent247 | Product | ${product?.name ?? "Loading"}`}
      />
      <div>
        <Navbar isItemAdded={isItemAdded} />

        <div className="bg-light-blue">
          <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
            {product === false ? (
              <div className="flex justify-center items-center">
                <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
              </div>
            ) : product?.is_approved == 0 ? (
              <NotFound
                isItem={true}
                title={"Product not found."}
                heroImage={"/404-item.png"}
              />
            ) : (
              <>
                <InfoDetailSec
                  objectType={product}
                  type={"products"}
                  dealAvailHandler={userDealAvail}
                  objectHandler={requestClickHandler}
                  setIsFav={setIsFav}
                  isFav={isFav}
                  setisItemAdded={setisItemAdded}
                />
                {isOpenModal === true && (
                  <RequestModal
                    objectType={requestData?.details}
                    isOpen={isOpenModal}
                    isLoggedIn={isLoggedIn}
                    relatedModuleID={router.query.id}
                    setIsOpenModal={setIsOpenModal}
                    closeModalHandler={closeModalHandler}
                    title={"Request More Info"}
                    description={""}
                    successBtnText={"Submit"}
                    cancelBtnText={"Cancel"}
                  />
                )}
                <CustomerReviews
                  typeID={product?.id}
                  reviewsList={requestData?.reviews}
                  reviewModuleType={"products"}
                />
                <RelatedSlider
                  loadSuccess={successfullLoading}
                  isRelated={requestData?.relatedCourses?.is_related}
                  sliderArr={requestData?.relatedCourses?.data}
                  title={"courses"}
                  sliderType={"courses"}
                />
                <RelatedSlider
                  loadSuccess={successfullLoading}
                  isRelated={requestData?.relatedProducts?.is_related}
                  sliderArr={requestData?.relatedProducts?.data}
                  title={"products"}
                  sliderType={"products"}
                />
                <RelatedSlider
                  loadSuccess={successfullLoading}
                  isRelated={requestData?.relatedArticles?.is_related}
                  sliderArr={requestData?.relatedArticles?.data}
                  title={"articles"}
                  sliderType={"articles"}
                />
                {/* <RelatedSlider
                loadSuccess={successfullLoading}
									isRelated={requestData?.relatedServices?.is_related}
									sliderArr={requestData?.relatedServices?.data}
									title={"services"}
									sliderType={"services"}
								/> */}
                <RelatedSlider
                  loadSuccess={successfullLoading}
                  isRelated={requestData?.relatedVideos?.is_related}
                  sliderArr={requestData?.relatedVideos?.data}
                  title={"videos"}
                  sliderType={"videos"}
                />{" "}
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const product_id = context.params.id;
  let cookies;
  if (context.req.headers.cookie) {
    cookies = cookie.parse(context.req.headers.cookie);
  }
  let details;
  const getProducts = await supabase
    .from("products")
    .select("* ,product_category!inner (*)  , organizations (*)")
    .eq("id", product_id)
    .limit(10);
  if (getProducts.data && getProducts.data.length > 0) {
    // check if item is a deal
    let checkDeal = await supabase
      .from("deals")
      .select("*")
      .eq("item_id", product_id)
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
      if (checkDeal?.data && checkDeal?.data[0]?.favUsers) {
        if (cookies?.user_token) {
          if (checkDeal?.data[0]?.favUsers?.includes(cookies?.user_token)) {
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
        ...getProducts?.data[0],
        is_deal: true,
        dealDetail: checkDeal?.data[0],
        is_fav,
        isDealAvail,
        userAvailDeal,
        item_type: "products",
      };
    } else {
      details = {
        ...getProducts?.data[0],
        is_deal: false,
        dealDetail: {},
        item_type: "products",
      };
    }
  }
  return {
    props: {
      product: details ? details : false || false,
    },
  };
}
