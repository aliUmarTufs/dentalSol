import { useState, Fragment, useRef, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import _ from "lodash";
import ReactStars from "react-stars";
import Link from "next/link";
import {
  BASE_URL,
  REQUIRED_COMMENT,
  REQUIRED_RATING,
  ROUTES,
  Toast,
} from "../../constants";
import LoginSignupModalText from "../LoginSignupModalText";
import { MainContext } from "../../context-api/MainContext";

export default function ReviewModal({
  isOpen,
  closeModalHandler,
  title,
  description,
  successBtnText,
  cancelBtnText,
  isLoggedIn,
  moduleType,
  relatedModuleID,
  setIsOpenModal,
  setReview,
  dataToSend,
  isUpdate,
}) {
  const [loggedInUser, setIsLoggedInUser] = useState(null);
  const [comment, setComment] = useState("");
  const [ratingNum, setRatingNum] = useState(0);
  const [isValidComment, setIsValidComment] = useState(true);
  const [isValidRating, setIsValidRating] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);
  const [disabled, setIsDisbaled] = useState(false);
  const { MainState, dispatch } = useContext(MainContext);

  const commentRef = useRef(null);
  const ratingRef = useRef(null);

  useEffect(() => {
    // const userDetails = localStorage.getItem("userData");
    // const parseUserData = JSON.parse(userDetails);
    const parseUserData = MainState?.userData;

    setIsLoggedInUser(parseUserData);
    if (dataToSend && isUpdate) {
      // let userDetail = JSON.parse(localStorage.getItem("userData"));
      const userDetail = MainState?.userData;

      if (userDetail) {
        setComment(dataToSend?.review);
        setRatingNum(dataToSend?.stars);
      }
    }
  }, [dataToSend]);

  const validateForm = () => {
    let isValid = true;

    setIsValidComment(true);
    setIsValidRating(true);

    // required check
    if (_.isEmpty(comment)) {
      commentRef.current.focus();
      setIsValidComment(false);
      isValid = false;
    }

    if (ratingNum <= 0) {
      setIsValidRating(false);
      isValid = false;
    }

    return isValid;
  };

  const reviewSubmission = async (event) => {
    event.preventDefault();
    setIsDisbaled(true);
    if (validateForm()) {
      const payload = {
        stars: ratingNum.toString(),
        review: comment,
        user_id: loggedInUser?.id,
        related_id: relatedModuleID,
        type: moduleType,
      };
      if (dataToSend && isUpdate) {
        payload.id = dataToSend.id;
      }
      fetch(`${BASE_URL}/api/rating`, {
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
            setIsSuccess(true);
            setReview(payload);
            Toast.fire({
              icon: `${"success"}`,
              title: `${data.message}`,
            });
            setTimeout(() => {
              setIsDisbaled(false);

              setIsOpenModal(false);
            }, 3000);
          } else {
            setIsSuccess(false);
            Toast.fire({
              icon: `${"error"}`,
              title: `${data.message}`,
            });
            setTimeout(() => {
              setIsOpenModal(false);
            }, 3000);
          }
        });
    }
  };

  const ratingChanged = (newRating) => {
    setRatingNum(newRating, setIsValidRating(true));
  };

  return (
    <Transition
      show={isOpen ?? false}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={Fragment}
    >
      <Dialog onClose={closeModalHandler} className="relative z-102">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div
          className="fixed inset-0 bg-gray-600 opacity-60"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-2xl h-96 overflow-y-auto md:h-auto rounded bg-white">
            <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
              <Dialog.Title
                className={
                  "text-xl font-semibold text-gray-900 dark:text-white"
                }
              >
                {title}
              </Dialog.Title>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeModalHandler}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <Dialog.Description>{description}</Dialog.Description>

            {!isLoggedIn ? (
              <LoginSignupModalText
                description={"You must be logged in to add a review."}
              />
            ) : (
              <form className="p-4" onSubmit={reviewSubmission}>
                <div className="flex flex-col gap-2 my-4">
                  <label
                    for="comment"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Comment
                  </label>
                  <textarea
                    type="text"
                    name="comment"
                    id="comment"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
                    onChange={(e) =>
                      setComment(e.target.value, setIsValidComment(true))
                    }
                    value={comment}
                    ref={commentRef}
                  />
                  {!isValidComment ? (
                    <span className={"text-sm text-red-500"}>
                      {REQUIRED_COMMENT}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex flex-col gap-2 my-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Rating
                  </label>
                  <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    isHalf={true}
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    fullIcon={<i className="fa fa-star"></i>}
                    activeColor="#ffd700"
                    value={ratingNum}
                    // onChange={(e, ratingNum) =>
                    //   setRatingNum(e.target.value, )
                    // }
                    ref={ratingRef}
                  />
                  {!isValidRating ? (
                    <span className={"text-sm text-red-500"}>
                      {REQUIRED_RATING}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="submit"
                    disabled={disabled}
                    className={
                      "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    }
                  >
                    {dataToSend && isUpdate ? "Update" : successBtnText}
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    onClick={closeModalHandler}
                  >
                    {cancelBtnText}
                  </button>
                </div>
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
