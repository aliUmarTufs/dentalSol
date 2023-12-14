import { StarIcon, UserCircleIcon } from "@heroicons/react/solid";
import _ from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Slider from "react-slick/lib/slider";
import ReactStars from "react-stars";
import {
  BASE_URL,
  classNames,
  customReviewSliderSettings,
  isLoggedInIndication,
  NOT_FOUND,
  reviewSliderSettings,
} from "../../constants";
import { MainContext } from "../../context-api/MainContext";
import CustomButton from "../CustomButton";
import ReviewBox from "../ReviewBox";
import ReviewModal from "../ReviewModal";

export default function CustomerReviews({
  typeID,
  reviewsList,
  reviewModuleType,
}) {
  const { MainState, dispatch } = useContext(MainContext);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dataObject, setDataObject] = useState(null);
  const [isUpdate, setIsUpdate] = useState(true);
  const [isUserSubmitReview, setIsUserSubmitReview] = useState(false);

  const router = useRouter();
  const [reviews, setReviews] = useState([]);

  const [commentReview, setCommentReview] = useState(null);

  useEffect(() => {
    if (isLoggedInIndication()) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (router.query.id || router.query.companyId) {
      fetch(`${BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          related_id: router?.query?.id || router?.query?.companyId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === true) {
            setReviews(data.data);
            let userids = _.map(data?.data?.list, "user_id");
            // const userDetails = localStorage.getItem("userData");
            const userDetails = MainState?.userData;

            if (!_.isNull(userDetails)) {
              //   let parseData = JSON.parse(userDetails);
              let parseData = userDetails;

              if (userids.includes(parseData.id)) {
                setIsUserSubmitReview(true);
              } else {
                setIsUserSubmitReview(false);
              }
            }
          }
        });
    }
  }, [commentReview, router.query.id, router.query.companyId]);

  const reviewClickHandler = () => {
    setIsUpdate(false);
    setIsOpenModal(true);
    setDataObject(null);
  };

  const editReviewClickHandler = (review) => {
    setIsUpdate(true);
    setIsOpenModal(true);
    setDataObject(review);
  };

  const closeModalHandler = () => {
    setIsOpenModal(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="mt-14">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-16">
        <div className="flex flex-col gap-6 w-full lg:w-6/12">
          <div className="flex flex-col sm:flex-row border-greyish-100 border-opacity-30 justify-between sm:items-center border-b-4">
            <div className="flex items-center h-full">
              <h2 className="text-lg font-normal tracking-tight text-black pl-0 sm:pl-4">
                Customer Reviews
              </h2>
            </div>

            {typeID ? (
              <div className="ml-auto mt-6 mb-4">
                <CustomButton
                  clickHandler={reviewClickHandler}
                  isPrimary={true}
                  btnText={"Submit Review"}
                />
              </div>
            ) : (
              ""
            )}

            {isOpenModal === true && (
              <ReviewModal
                isOpen={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                closeModalHandler={closeModalHandler}
                title={dataObject ? "Update a review." : "Add a review."}
                description={""}
                successBtnText={"Submit"}
                cancelBtnText={"Cancel"}
                isLoggedIn={isLoggedIn}
                relatedModuleID={typeID}
                moduleType={reviewModuleType}
                setReview={setCommentReview}
                dataToSend={dataObject}
                isUpdate={isUpdate}
              />
            )}
          </div>

          {!_.isEmpty(reviews.list) ? (
            <Slider
              {...customReviewSliderSettings}
              className={"w-full mt-4 reviewSliderWrap"}
            >
              {reviews?.list?.map((review) => (
                <ReviewBox
                  setIsLoggedIn={setIsLoggedIn}
                  objectType={review}
                  updateReviewHandler={() => editReviewClickHandler(review)}
                />
              ))}
            </Slider>
          ) : (
            <div>{NOT_FOUND}</div>
          )}
        </div>
        <div className="flex flex-col w-full lg:w-6/12">
          <div className="mt-3 flex items-center">
            <div>
              <div className="flex items-center">
                <ReactStars
                  count={5}
                  size={24}
                  isHalf={true}
                  emptyIcon={<i className="far fa-star"></i>}
                  halfIcon={<i className="fa fa-star-half-alt"></i>}
                  fullIcon={<i className="fa fa-star"></i>}
                  activeColor="#F8BB46"
                  value={reviews?.average}
                  edit={false}
                />
              </div>
              <p className="sr-only">{reviews?.average} out of 5 stars</p>
            </div>
            <p className="ml-2 text-sm text-gray-900">
              Based on {reviews?.list?.length} reviews
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Review data</h3>

            <div className="space-y-3">
              {reviews?.reviewStarListing &&
              reviews?.reviewStarListing?.length > 0 ? (
                reviews?.reviewStarListing?.map((count) => (
                  <div key={count.star} className="flex items-center text-sm">
                    <div className="flex-1 flex items-center">
                      <p className="w-3 font-medium text-gray-900 mr-2">
                        {count.star}
                        <span className="sr-only"> star reviews</span>
                      </p>
                      <div
                        aria-hidden="true"
                        className="ml-1 flex-1 flex items-center"
                      >
                        <StarIcon
                          className={classNames(
                            count.star > 0
                              ? "text-yellow-400"
                              : "text-gray-300",
                            "flex-shrink-0 h-5 w-5"
                          )}
                          aria-hidden="true"
                        />

                        <div className="ml-3 relative flex-1">
                          <div className="h-3 bg-gray-100 border border-gray-200 rounded-full" />
                          {count.star > 0 ? (
                            <div
                              className="absolute w-full inset-y-0 bg-yellow-400 border border-yellow-400 rounded-full"
                              style={{
                                maxWidth: `calc(${count.count} / ${reviews.totalRecords} * 100%)`,
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <dd className="ml-3 w-10 text-right tabular-nums text-sm text-gray-900">
                      {Math.round((count.count / reviews.totalRecords) * 100)}%
                    </dd>
                  </div>
                ))
              ) : (
                <div>{NOT_FOUND}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
