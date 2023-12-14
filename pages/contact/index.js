import { MailIcon, PhoneIcon } from "@heroicons/react/solid";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState, useEffect, useContext } from "react";
import PhoneInput from "react-phone-input-2";
import { BeatLoader } from "react-spinners";
import { Navbar, Footer, HeadMeta, PageTitleInfo } from "../../components";
import {
  BASE_URL,
  INVALID_CITY,
  INVALID_EMAIL,
  INVALID_EMPTY_NOTES,
  INVALID_NAME,
  INVALID_NOTES,
  INVALID_PHONE_NUM,
  REQUIRED_EMAIL,
  REQUIRED_NAME,
  Toast,
} from "../../constants";
import { MainContext } from "../../context-api/MainContext";
import Util from "../../services/Util";

export default function Contact() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [emailAdd, setEmailAdd] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidFullName, setIsValidFullName] = useState(true);
  const [isValidEmailAdd, setIsValidEmailAdd] = useState(true);
  const [isValidCity, setIsValidCity] = useState(true);
  const [isValidPhoneNum, setIsValidPhoneNum] = useState(true);
  const [isValidNotes, setIsValidNotes] = useState(true);
  const [fullNameErrMsg, setFullNameErrMsg] = useState("");
  const [emailErrMsg, setEmailErrMsg] = useState("");
  const [notesErrMsg, setNotesErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [loggedinUser, setLoggedInUser] = useState({});
  const { MainState, dispatch } = useContext(MainContext);

  useEffect(() => {
    // let userdetails = localStorage.getItem("userData");
    let userdetails = MainState?.userData;

    if (!_.isNull(userdetails)) {
      //   let data = JSON.parse(userdetails);
      let data = userdetails;

      setLoggedInUser(data);
      setFullName(data?.user_name);
      setCity(data?.user_city?.name);
      if (!_.isNull(data?.phone_number)) {
        setPhoneNum(data?.phone_number);
      }
      setEmailAdd(data?.user_email);
    }
  }, []);

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const notesRef = useRef(null);
  const cityRef = useRef(null);
  const phoneNumRef = useRef(null);

  const validateForm = () => {
    let isValid = true;

    setIsValidFullName;
    setIsValidEmailAdd(true);
    setIsValidNotes(true);
    setIsValidPhoneNum(true);
    setIsValidCity(true);

    // required check

    if (_.isEmpty(fullName)) {
      fullNameRef.current.focus();
      setFullNameErrMsg(REQUIRED_NAME);
      setIsValidFullName(false);
      isValid = false;
    } else if (!Util.isValidName(fullName)) {
      fullNameRef.current.focus();
      setIsValidFullName(false);
      setFullNameErrMsg(INVALID_NAME);
      isValid = false;
    }

    if (_.isEmpty(emailAdd)) {
      emailRef.current.focus();
      setIsValidEmailAdd(false);
      setEmailErrMsg(REQUIRED_EMAIL);
      isValid = false;
    } else if (!Util.isEmailValid(emailAdd)) {
      emailRef.current.focus();
      setIsValidEmailAdd(false);
      setEmailErrMsg(INVALID_EMAIL);
      isValid = false;
    }

    if (_.isEmpty(phoneNum) || phoneNum === "+") {
      setIsValidPhoneNum(false);
      isValid = false;
    }

    if (_.isEmpty(city)) {
      setIsValidCity(false);
      isValid = false;
    }

    if (_.isEmpty(notes)) {
      setIsValidNotes(false);
      setNotesErrMsg(INVALID_EMPTY_NOTES);
      isValid = false;
    } else if (_.size(notes) > 255) {
      setIsValidNotes(false);
      setNotesErrMsg(INVALID_NOTES);
      isValid = false;
    }

    return isValid;
  };

  const contactInfoSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const payload = {
        fullName: fullName,
        email: emailAdd,
        notes: notes,
        phone: phoneNum,
        city: city,
      };

      fetch(`${BASE_URL}/api/contact`, {
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
            setEmailAdd("");
            setFullName("");
            setCity("");
            setPhoneNum("");
            setNotes("");
            Toast.fire({
              icon: `${"success"}`,
              title: `${data.message}`,
            });

            setLoading(false);
          }
          //
        });
    }
  };

  return (
    <>
      <HeadMeta
        title={"Dent247 | Contact"}
        description="description"
        content={"Dent247 | Contact"}
      />
      <Navbar isPageTitleInfo={true} />

      <PageTitleInfo title={"Contact"} />

      <div className="bg-light-blue">
        <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-8 lg:pt-16 pb-8 md:pb-12 lg:pb-20">
          <div className="flex flex-col lg:flex-row justify-between gap-10 mt-8 sm:mt-12 md:mt-16">
            <div className="flex flex-col gap-4 flex-1">
              <h2 className="text-dark text-lg font-bold uppercase md:text-xl">
                GET IN TOUCH WITH US
              </h2>
              <p className="font-light text-gray-600 dark:text-gray-400 text-base">
                Got a technical issue? Want to send feedback about a feature?
                Need details about our Business plan? Let us know.
              </p>

              <div className="my-4 flex w-full">
                <div className="bg-primary text-primary mr-6 flex overflow-hidden rounded bg-opacity-5">
                  <PhoneIcon className="w-10 h-10" />
                </div>
                <div className="w-full">
                  <h4 className="text-dark mb-1 text-xl font-bold">
                    Phone Number
                  </h4>
                  <Link href={"tel:+18448003368"}>
                    <span className="cursor-pointer text-body-color text-base hover:underline">
                      +1 844-800-3368
                    </span>
                  </Link>
                </div>
              </div>
              <div className="my-4 flex w-full">
                <div className="bg-primary text-primary mr-6 flex overflow-hidden rounded bg-opacity-5">
                  <MailIcon className="w-10 h-10" />
                </div>
                <div className="w-full">
                  <h4 className="text-dark mb-1 text-xl font-bold">
                    Email Address
                  </h4>
                  <Link href={"mailto:info@dent247.com"}>
                    <span className="cursor-pointer text-body-color text-base hover:underline">
                      info@dent247.com
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-4 md:p-8 rounded-3xl border border-solid border-gray-700 flex-1">
              <form onSubmit={contactInfoSubmit} className={"mt-8"}>
                <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                  <div className="flex flex-col gap-2 my-2 flex-1">
                    <label
                      for="full_name"
                      className="block text-sm font-normal text-gray-900 dark:text-gray-300"
                    >
                      Name *
                    </label>

                    <input
                      id="full_name"
                      className={`${
                        loggedinUser?.auth_token
                          ? "cursor-not-allowed"
                          : "cursor-normal"
                      } bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="Type Here"
                      onChange={(e) =>
                        setFullName(e.target.value, setIsValidFullName(true))
                      }
                      value={fullName}
                      ref={fullNameRef}
                      maxLength={100}
                      disabled={loggedinUser?.auth_token ? true : false}
                    />

                    {!isValidFullName ? (
                      <span className={"text-sm text-red-500"}>
                        {fullNameErrMsg}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex flex-col gap-2 my-2 flex-1">
                    <label
                      for="email"
                      className="block text-sm font-normal text-gray-900 dark:text-gray-300"
                    >
                      Email *
                    </label>

                    <input
                      id="email"
                      className={`${
                        loggedinUser?.auth_token
                          ? "cursor-not-allowed"
                          : "cursor-normal"
                      } bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="Type Here"
                      onChange={(e) =>
                        setEmailAdd(e.target.value, setIsValidEmailAdd(true))
                      }
                      value={emailAdd}
                      ref={emailRef}
                      maxLength={150}
                      disabled={loggedinUser?.auth_token ? true : false}
                    />

                    {!isValidEmailAdd ? (
                      <span className={"text-sm text-red-500"}>
                        {emailErrMsg}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
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
                      placeholder="Type Here"
                      onChange={(value) => {
                        setPhoneNum(`+${value}`, setIsValidPhoneNum(true));
                      }}
                      value={phoneNum}
                      ref={phoneNumRef}
                      disabled={
                        !_.isNull(loggedinUser?.phone_number) &&
                        !_.isUndefined(loggedinUser?.phone_number)
                          ? true
                          : false
                      }
                    />

                    {!isValidPhoneNum ? (
                      <span className={"text-sm text-red-500"}>
                        {INVALID_PHONE_NUM}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="flex flex-col gap-2 my-2 flex-1">
                    <label
                      for="city"
                      className="block text-sm font-normal text-gray-900 dark:text-gray-300"
                    >
                      City *
                    </label>

                    <input
                      id="city"
                      className={`${
                        !_.isNull(loggedinUser?.user_city) &&
                        !_.isUndefined(loggedinUser?.user_city)
                          ? "cursor-not-allowed"
                          : "cursor-normal"
                      } bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="Type Here"
                      onChange={(e) =>
                        setCity(e.target.value, setIsValidCity(true))
                      }
                      value={city}
                      ref={cityRef}
                      maxLength={30}
                      disabled={
                        !_.isNull(loggedinUser?.user_city) &&
                        !_.isUndefined(loggedinUser?.user_city)
                          ? true
                          : false
                      }
                    />

                    {!isValidCity ? (
                      <span className={"text-sm text-red-500"}>
                        {INVALID_CITY}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 my-2 flex-1">
                  <label
                    for="notes"
                    className="block text-sm font-normal text-gray-900 dark:text-gray-300"
                  >
                    Notes
                  </label>

                  <textarea
                    id="notes"
                    rows="6"
                    className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-64 resize-none"
                    placeholder="Type Here"
                    onChange={(e) =>
                      setNotes(e.target.value, setIsValidNotes(true))
                    }
                    value={notes}
                    ref={notesRef}
                  />

                  {!isValidNotes ? (
                    <span className={"text-sm text-red-500"}>
                      {notesErrMsg}
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading ? true : false}
                  className={`${
                    loading ? "cursor-not-allowed" : "cursor-pointer"
                  } w-full h-14 mt-8 md:mt-12 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {loading ? (
                    <BeatLoader color="#fff" sizeunit={"px"} size={8} />
                  ) : (
                    ""
                  )}
                  {loading ? "" : "submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
