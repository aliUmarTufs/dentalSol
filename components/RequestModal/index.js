import { useState, Fragment, useRef, useContext } from "react";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
import _ from "lodash";
import ReactStars from "react-stars";
import Link from "next/link";
import {
  BASE_URL,
  PRACTICE_TYPE,
  REQUIRED_LOCATION,
  REQUIRED_MESSAGE,
  REQUIRED_PRACTICE_NAME,
  REQUIRED_PRACTICE_TYPE,
  ROUTES,
  Toast,
} from "../../constants";
import LoginSignupModalText from "../LoginSignupModalText";
import { useSockets } from "../../context/socket.context";
import { useRouter } from "next/router";
import { MainContext } from "../../context-api/MainContext";

export default function RequestModal({
  objectType,
  isOpen,
  closeModalHandler,
  title,
  description,
  successBtnText,
  cancelBtnText,
  isLoggedIn,
  setIsOpenModal,
  relatedModuleID,
}) {
  const router = useRouter();

  const [practiceName, setPracticeName] = useState("");
  const [practiceType, setPracticeType] = useState(PRACTICE_TYPE[0]);
  const [location, setLocation] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [isValidPracticeName, setIsValidPracticeName] = useState(true);
  const [isValidPracticeType, setIsValidPracticeType] = useState(true);
  const [isValidLocation, setIsValidLocation] = useState(true);
  const [isValidMessage, setIsValidMessage] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);

  const practiceNameRef = useRef(null);
  const practiceTypeRef = useRef(null);
  const locationRef = useRef(null);
  const messageRef = useRef(null);
  const { MainState, dispatch } = useContext(MainContext);

  //   const userDetails = localStorage.getItem("userData");

  //   const parseUserData = JSON.parse(userDetails);
  const parseUserData = MainState?.userData;

  const { socket } = useSockets();

  const validateForm = () => {
    let isValid = true;

    setIsValidPracticeName(true);
    setIsValidPracticeType(true);
    setIsValidLocation(true);
    setIsValidMessage(true);

    // required check
    if (_.isEmpty(practiceName)) {
      practiceNameRef.current.focus();
      setIsValidPracticeName(false);
      isValid = false;
    }
    if (practiceType.title === "Select Practice Type") {
      practiceTypeRef.current.focus();
      setIsValidPracticeType(false);
      isValid = false;
    }

    if (_.isEmpty(userMessage)) {
      messageRef.current.focus();
      setIsValidMessage(false);
      isValid = false;
    }

    if (_.isEmpty(location)) {
      locationRef.current.focus();
      setIsValidLocation(false);
      isValid = false;
    }

    return isValid;
  };

  const requestSubmission = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const payload = {
        practice_name: practiceName,
        practice_type: practiceType.title,
        location: location,
        user_id: parseUserData.id,
        product_id: relatedModuleID,
      };

      fetch(`${BASE_URL}/api/request-information`, {
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
            Toast.fire({
              icon: `${"success"}`,
              title: `${data.message}`,
            });
            if (objectType?.organizations?.organization_user) {
              socket.emit(
                "createRoom",
                {
                  room_name: `${relatedModuleID}-${parseUserData?.id}`,
                  room_owner: parseUserData?.id,
                  room_reciever: objectType?.organizations?.organization_user,
                  message: userMessage,
                  item_id: objectType?.id,
                },
                (error) => {
                  if (error) {
                    console.log(
                      "Something went wrong please try again later. (edit message error)",
                      error
                    );
                    throw error;
                  }
                }
              );
            }

            setTimeout(() => {
              router.push(ROUTES.CHAT);
            }, 3000);
          } else {
            setIsSuccess(false);
            Toast.fire({
              icon: `${"error"}`,
              title: `${data.message}`,
            });
          }
        });
    }
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
              <img
                className="block h-8 w-8 mr-4"
                src="https://tailwindui.com/img/logos/workflow-mark-blue-600.svg"
                alt="Workflow"
              />
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
                description={"You must be logged in to make request"}
              />
            ) : (
              <form className="p-4" onSubmit={requestSubmission}>
                <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                  {/* fullName input field */}
                  <div className="flex flex-col gap-2 my-2 flex-1">
                    <label
                      for="full-name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="full-name"
                      className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      disabled
                      value={parseUserData?.user_name ?? "Name"}
                    />
                  </div>
                  {/* email input field */}
                  <div className="flex flex-col gap-2 my-2 flex-1">
                    <label
                      for="email_address"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email_address"
                      className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      disabled
                      value={parseUserData?.user_email ?? "Email Address"}
                    />
                  </div>
                </div>

                <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                  {/* role input field */}
                  <div className="flex flex-col gap-2 my-2 flex-1">
                    <label
                      for="role"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Role Type
                    </label>
                    <input
                      type="text"
                      id="role"
                      className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      disabled
                      value={parseUserData?.role_type ?? "Role Type"}
                    />
                  </div>
                  {/* phone input field */}
                  <div className="flex flex-col gap-2 my-2 flex-1">
                    <label
                      for="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phone"
                      className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      disabled
                      value={parseUserData?.phone_number ?? "Phone Number"}
                    />
                  </div>
                </div>

                <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                  {/* practice name input field */}
                  <div className="flex flex-col gap-2 my-2 flex-1">
                    <label
                      for="practice_name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Practice Name
                    </label>
                    <input
                      type="text"
                      id="practice_name"
                      className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={practiceName}
                      onChange={(e) => {
                        setPracticeName(
                          e.target.value,
                          setIsValidPracticeName(true)
                        );
                      }}
                      ref={practiceNameRef}
                    />

                    {!isValidPracticeName ? (
                      <span className={"text-sm text-red-500"}>
                        {REQUIRED_PRACTICE_NAME}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  {/* phone input field */}
                  <div className="flex flex-col gap-2 my-2 flex-1">
                    <label className="block mb-2 text-sm font-normal text-gray-900 dark:text-gray-300">
                      Are you?
                    </label>

                    <Listbox
                      value={practiceType}
                      onChange={(e) =>
                        setPracticeType(e, setIsValidPracticeType(true))
                      }
                    >
                      <div className="relative">
                        <Listbox.Button
                          ref={practiceTypeRef}
                          className="relative text-left bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <span className="block truncate">
                            {practiceType.title}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                            {PRACTICE_TYPE.map((practiceInfo) => (
                              <Listbox.Option
                                key={practiceInfo.id}
                                disabled={practiceInfo.disable === true}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-amber-100 text-amber-900"
                                      : "text-gray-900"
                                  }`
                                }
                                value={practiceInfo}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        practiceInfo.disable != true && selected
                                          ? "font-medium"
                                          : "font-normal"
                                      } ${
                                        practiceInfo.disable ? "opacity-40" : ""
                                      }`}
                                    >
                                      {practiceInfo.title}
                                    </span>
                                    {practiceInfo.disable != true &&
                                    selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                    {!isValidPracticeType ? (
                      <span className={"text-sm text-red-500"}>
                        {REQUIRED_PRACTICE_TYPE}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    for="location"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value, setIsValidLocation(true));
                    }}
                    ref={locationRef}
                  />
                  {!isValidLocation ? (
                    <span className={"text-sm text-red-500"}>
                      {REQUIRED_LOCATION}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="mb-6">
                  <label
                    for="location"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Message
                  </label>
                  <input
                    type="text"
                    id="location"
                    className="bg-gray-50 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={userMessage}
                    onChange={(e) => {
                      setUserMessage(e.target.value, setIsValidMessage(true));
                    }}
                    ref={messageRef}
                  />
                  {!isValidMessage ? (
                    <span className={"text-sm text-red-500"}>
                      {REQUIRED_MESSAGE}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="submit"
                    className={
                      "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    }
                  >
                    {successBtnText}
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
