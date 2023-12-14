import {
  Navbar,
  HeadMeta,
  useSupabaseObject,
  Footer,
  RelatedSlider,
  CustomerReviews,
  InfoDetailSec,
  NotFound,
} from "../../../components";
import cookie from "cookie";

import { useRouter } from "next/router";
import { BASE_URL } from "../../../constants";
import { useState, useEffect } from "react";
import _ from "lodash";
import { BeatLoader } from "react-spinners";
import { supabase } from "../../../lib/supabaseClient";

export default function Article({ articleData }) {
  const router = useRouter();
  const [requestData, setrequestData] = useState(null);
  const [successfullLoading, setSuccessfullLoading] = useState(false);
  const [isItemAdded, setisItemAdded] = useState(false);

  //   const { loading, object: article } = useSupabaseObject({
  //     table: "articles",
  //     col: "id",
  //     val: router.query.id,
  //     select: "*, notable_figures!inner(*)",
  //   });

  useEffect(() => {
    if (router.query.id) {
      fetch(`${BASE_URL}/api/library?id=${router.query.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status == true) {
            setrequestData(data.data);
            setSuccessfullLoading(true);
          } else {
            setrequestData({});
          }
        });
    }
  }, [router]);

  return (
    <>
      <HeadMeta
        title={`Dent247 | Library | Article | ${router.query.id}`}
        description="description"
        content={`Dent247 | Library | Article | ${router.query.id}`}
      />
      <div>
        <Navbar isItemAdded={isItemAdded} />

        <div className="bg-light-blue">
          <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
            {articleData === false ? (
              <div className="flex justify-center items-center">
                <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
              </div>
            ) : articleData?.is_approved == 0 ? (
              <NotFound
                isItem={true}
                title={"Article not found."}
                heroImage={"/404-item.png"}
              />
            ) : (
              <>
                <InfoDetailSec
                  objectType={articleData}
                  type={"articles"}
                  setisItemAdded={setisItemAdded}
                />

                <CustomerReviews
                  typeID={requestData?.details?.id}
                  reviewsList={requestData?.reviews}
                  reviewModuleType={"articles"}
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
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const article_id = context.params.id;
  let cookies;
  if (context.req.headers.cookie) {
    cookies = cookie.parse(context.req.headers.cookie);
  }
  let details;
  let articleData = await supabase
    .from("articles")
    .select(
      "* ,  article_categories ( label , image , type ), notable_figures(*) , users(*) ,organizations(*) ,  category_filter_id(*) "
    )
    .eq("id", article_id);
  if (articleData?.data && articleData?.data?.length > 0) {
    articleData.data[0].item_type = "articles";
    details = articleData?.data[0];
  }

  return {
    props: {
      articleData: details ? details : false || false,
    },
  };
}
