import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import cookie from "cookie";

import {
  Navbar,
  Footer,
  HeadMeta,
  InfoDetailSec,
  CustomerReviews,
  RelatedSlider,
  NotFound,
} from "../../components";
import _ from "lodash";
import { BASE_URL, getLoggedInUser, Toast } from "../../constants";
import { useRouter } from "next/router";
import { BeatLoader } from "react-spinners";

export default function CoursePage({ course }) {
  const [requestData, setRequestData] = useState(null);
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [isItemAdded, setisItemAdded] = useState(false);
  const [availDeal, setAvailDeal] = useState(null);
  const [successfullLoading, setSuccessfullLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const courseListFunc = async () => {
      if (router.query.id) {
        let getuser = await getLoggedInUser();
        let loggedInUserUrl;
        if (!_.isNull(getuser)) {
          loggedInUserUrl = JSON.parse(getuser);
          setLoggedinUser(loggedInUserUrl);
          loggedInUserUrl = loggedInUserUrl?.id;
        }

        fetch(
          !_.isUndefined(loggedInUserUrl)
            ? `${BASE_URL}/api/courses?id=${router.query.id}&user_id=${loggedInUserUrl}`
            : `${BASE_URL}/api/courses?id=${router.query.id}`,
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
    };
    courseListFunc();
  }, [router]);

  const userDealAvail = async () => {
    let payload = {
      user_id: loggedinUser?.id,
      deal_id: course?.dealDetail?.id,
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
        title={`Dent247 | ${course?.title ?? "Single Course"}`}
        description="description"
        content={`Dent247 | ${course?.title ?? "Single Course"}`}
      />

      <Navbar isItemAdded={isItemAdded} />

      <div className="bg-light-blue">
        <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
          {course === false ? (
            <div className="flex justify-center items-center">
              <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
            </div>
          ) : course?.is_approved == 0 ? (
            <NotFound
              isItem={true}
              title={"Course not found."}
              heroImage={"/404-item.png"}
            />
          ) : (
            <>
              <InfoDetailSec
                setIsFav={setIsFav}
                isFav={isFav}
                objectType={course}
                type={"courses"}
                dealAvailHandler={userDealAvail}
                setisItemAdded={setisItemAdded}
              />

              <CustomerReviews
                typeID={requestData?.details?.id}
                reviewsList={requestData?.reviews}
                reviewModuleType={"courses"}
              />

              <RelatedSlider
                isRelated={requestData?.relatedCourses?.is_related}
                sliderArr={requestData?.relatedCourses?.data}
                title={"courses"}
                loadSuccess={successfullLoading}
                sliderType={"courses"}
              />
              <RelatedSlider
                isRelated={requestData?.relatedProducts?.is_related}
                sliderArr={requestData?.relatedProducts?.data}
                title={"products"}
                loadSuccess={successfullLoading}
                sliderType={"products"}
              />
              <RelatedSlider
                isRelated={requestData?.relatedArticles?.is_related}
                sliderArr={requestData?.relatedArticles?.data}
                title={"articles"}
                loadSuccess={successfullLoading}
                sliderType={"articles"}
              />
              <RelatedSlider
                isRelated={requestData?.relatedServices?.is_related}
                sliderArr={requestData?.relatedServices?.data}
                title={"services"}
                loadSuccess={successfullLoading}
                sliderType={"services"}
              />
              <RelatedSlider
                isRelated={requestData?.relatedVideos?.is_related}
                sliderArr={requestData?.relatedVideos?.data}
                title={"videos"}
                loadSuccess={"Hello"}
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
  const course_Id = context.params.id;
  let cookies;
  if (context.req.headers.cookie) {
    cookies = cookie.parse(context.req.headers.cookie);
  }

  let details;
  const getCourse = await supabase
    .from("courses")
    .select("* , organizations (*)")
    .eq("id", course_Id)
    .limit(10);
  if (getCourse.data && getCourse.data.length > 0) {
    // Check if a course is deal or not

    let checkDeal = await supabase
      .from("deals")
      .select("*")
      .eq("item_id", course_Id)
      .eq("is_expire", 0);
    if (checkDeal?.data && checkDeal?.data?.length > 0) {
      let isDealAvail = false;
      let userAvailDeal = {};
      let checkIfDealAvail = await supabase
        .from("avail_deal_users")
        .select("*")
        .eq("user_id", cookies?.user_token)
        .eq("deal_id", checkDeal?.data[0]?.id);
      if (checkIfDealAvail?.data && checkIfDealAvail?.data?.length > 0) {
        isDealAvail = true;
        userAvailDeal = checkIfDealAvail?.data[0];
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
        ...getCourse?.data[0],
        is_deal: true,
        dealDetail: checkDeal?.data[0],
        is_fav,
        isDealAvail,
        userAvailDeal,
        item_type: "courses",
      };
    } else {
      details = {
        ...getCourse?.data[0],
        is_deal: false,
        dealDetail: {},
        item_type: "courses",
      };
    }
  }
  return {
    props: {
      course: details ? details : false || false,
    },
  };
}
