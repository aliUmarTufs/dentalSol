import {
  EyeIcon,
  EyeOffIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid";
import PhoneInput from "react-phone-input-2";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  AREA_OF_INT_INFO_TEXT,
  BASE_URL,
  COUNTRY_OPTIONS,
  INVALID_AREA_OF_INTERESTS,
  INVALID_CITY,
  INVALID_CONFIRM_PASSWORD,
  INVALID_COUNTRY,
  INVALID_EMAIL,
  INVALID_IMAGE,
  INVALID_NAME,
  INVALID_PASSWORD,
  INVALID_PHONE_NUM,
  INVALID_STATE_PROVINCE,
  INVALID_USERNAME,
  INVALID_USER_TYPE,
  INVALID_ZIP_CODE,
  REQUIRED_EMAIL,
  REQUIRED_NAME,
  REQUIRED_PASSWORD,
  REQUIRED_USERNAME,
  REQUIRED_ZIP_CODE,
  ROLE_TYPE,
  ROUTES,
  Toast,
  UPLOAD_BASE_URL,
  USER_INFO_TEXT,
} from "../../constants";
import { supabase, supabase_admin_secret } from "../../lib/supabaseClient";
import Util from "../../services/Util";
import { ComboBoxComponent } from "../ComboBoxComponent";
import { ListBoxComponents } from "../ListBoxComponents";
import { BeatLoader } from "react-spinners";
import { SET_USER_DATA } from "../../context-api/action-types";
import { MainContext } from "../../context-api/MainContext";

export default function VendorRegistration({ userRoleType }) {
  const router = useRouter();
  const { MainState, dispatch } = useContext(MainContext);
  const [profileImg, setProfileImg] = useState(() => "");
  const [profileImgObj, setProfileImgObj] = useState(() => null);
  const [emailAdd, setEmailAdd] = useState("");
  const [pswd, setPswd] = useState("");
  const [confirmPswd, setConfirmPswd] = useState("");
  const [showPswd, setShowPswd] = useState(false);
  const [showConfirmPswd, setShowConfirmPswd] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState([]);
  const [areasOfInterest, setareasOfInterest] = useState([]);
  const [userTypeData, setUserTypeData] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [country, setCountry] = useState(COUNTRY_OPTIONS[0]);
  const [cities, setCities] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [stateProvince, setStateProvince] = useState([]);
  const [stateProvinceData, setStateProvinceData] = useState([]);
  const [zipCode, setZipCode] = useState("");
  const [areaOfInt, setAreaOfInt] = useState([]);
  const [areaOfIntQuery, setAreaOfIntQuery] = useState("");

  //validation States
  const [isValidEmailAdd, setIsValidEmailAdd] = useState(true);
  const [isValidPswd, setIsValidPswd] = useState(true);
  const [isValidConfirmPswd, setIsValidConfirmPswd] = useState(true);
  const [isValidFullName, setIsValidFullName] = useState(true);
  const [isValidUserName, setIsValidUserName] = useState(true);
  const [isValidUserType, setIsValidUserType] = useState(true);
  const [isValidProfileImg, setIsValidProfileImg] = useState(true);
  const [isValidPhoneNum, setIsValidPhoneNum] = useState(true);
  const [isValidCountry, setIsValidCountry] = useState(true);
  const [isValidCities, setIsValidCities] = useState(true);
  const [isValidStateProvince, setIsValidStateProvince] = useState(true);
  const [isValidZipCode, setIsValidZipCode] = useState(true);
  const [isValidAreaOfInt, setIsValidAreaOfInt] = useState(true);

  //error messages
  const [imgErrMsg, setImgErrMsg] = useState("");
  const [nameErrMsg, setNameErrMsg] = useState("");
  const [usernameErrMsg, setUserNameErrMsg] = useState("");
  const [emailErrMsg, setEmailErrMsg] = useState("");
  const [pswdErrMsg, setPswdErrMsg] = useState("");
  const [confirmPswdErrMsg, setConfirmPswdErrMsg] = useState("");
  const [zipCodeErrMsg, setZipCodeErrMsg] = useState("");

  const [loading, setLoading] = useState(false);
  // form refs
  const profileImgRef = useRef(null);
  const emailRef = useRef(null);
  const pswdRef = useRef(null);
  const confirmPswdRef = useRef(null);
  const fullNameRef = useRef(null);
  const userNameRef = useRef(null);
  const userTypeRef = useRef(null);
  const phoneNumRef = useRef(null);
  const countryRef = useRef(null);
  const citiesRef = useRef(null);
  const stateProvinceRef = useRef(null);
  const zipCodeRef = useRef(null);
  const areaOfIntRef = useRef(null);

  function profileImgHandler(evt) {
    const image = evt.target.files[0];

    if (image) {
      var pattern = /image-*/;

      if (!image.type.match(pattern)) {
        setIsValidProfileImg(false);
        setImgErrMsg(INVALID_IMAGE);
        return;
      }
      setProfileImgObj(image);
      const src = URL.createObjectURL(image);
      setProfileImg(src);
      setIsValidProfileImg(true);
      setImgErrMsg("");
    }
  }

  const validateForm = () => {
    let isValid = true;

    setIsValidEmailAdd(true);
    setIsValidPswd(true);
    setIsValidConfirmPswd(true);
    setIsValidFullName(true);
    setIsValidUserName(true);
    setIsValidPhoneNum(true);
    setIsValidUserType(true);
    setIsValidCountry(true);
    setIsValidStateProvince(true);
    setIsValidCities(true);
    setIsValidZipCode(true);
    setIsValidAreaOfInt(true);
    setIsValidProfileImg(true);

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
    if (_.isEmpty(pswd)) {
      pswdRef.current.focus();
      setIsValidPswd(false);
      setPswdErrMsg(REQUIRED_PASSWORD);
      isValid = false;
    } else if (!Util.isValidPassword(pswd)) {
      pswdRef.current.focus();
      setIsValidPswd(false);
      setPswdErrMsg(INVALID_PASSWORD);
      isValid = false;
    }
    if (_.isEmpty(confirmPswd)) {
      confirmPswdRef.current.focus();
      setIsValidConfirmPswd(false);
      setConfirmPswdErrMsg(REQUIRED_PASSWORD);
      isValid = false;
    } else if (confirmPswd !== pswd) {
      confirmPswdRef.current.focus();
      setIsValidConfirmPswd(false);
      setConfirmPswdErrMsg(INVALID_CONFIRM_PASSWORD);
      isValid = false;
    }
    if (_.isEmpty(fullName)) {
      fullNameRef.current.focus();
      setNameErrMsg(REQUIRED_NAME);
      setIsValidFullName(false);
      isValid = false;
    } else if (!Util.isValidFullName(fullName)) {
      fullNameRef.current.focus();
      setIsValidFullName(false);
      setNameErrMsg(INVALID_NAME);
      isValid = false;
    }
    if (_.isEmpty(userName)) {
      userNameRef.current.focus();
      setUserNameErrMsg(REQUIRED_USERNAME);
      isValid = false;
      setIsValidUserName(false);
    } else if (!Util.isValidUserName(userName)) {
      userNameRef.current.focus();
      setUserNameErrMsg(INVALID_USERNAME);
      isValid = false;
      setIsValidUserName(false);
    }
    if (_.isEmpty(phoneNum) || phoneNum === "+") {
      setIsValidPhoneNum(false);
      isValid = false;
    }
    if (_.isEmpty(userTypeData)) {
      userTypeRef.current.focus();
      setIsValidUserType(false);
      isValid = false;
    }
    if (country.title === "Select Country") {
      countryRef.current.focus();
      setIsValidCountry(false);
      isValid = false;
    }
    if (_.isEmpty(stateProvinceData)) {
      stateProvinceRef.current.focus();
      setIsValidStateProvince(false);
      isValid = false;
    }
    if (_.isEmpty(citiesData)) {
      citiesRef.current.focus();
      setIsValidCities(false);
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
    if (_.isEmpty(areaOfInt)) {
      areaOfIntRef.current.focus();
      setIsValidAreaOfInt(false);
      isValid = false;
    }

    return isValid;
  };

  const signup = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);

      let payload = {
        name: fullName,
        profileImg: "",
        email: emailAdd,
        phoneNumber: phoneNum,
        city: citiesData.id,
        cityName: citiesData?.name,
        country: country.title,
        state: stateProvinceData.state,
        userTypeList: _.map(userTypeData, "name"),
        username: userName,
        areasOfInterest: _.map(areaOfInt, "label"),
        password: pswd,
        zip_code: zipCode,
        roleType: userRoleType,
      };

      const body = new FormData();
      body.append("image", profileImgObj);
      if (profileImgObj) {
        const response = await supabase_admin_secret.storage
          .from("users")
          .upload(
            `upload/${Math.random() + "_" + profileImgObj.name}`,
            profileImgObj,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
        if (response.data) {
          payload.profileImg = `${UPLOAD_BASE_URL}/${response.data.Key}`;
        }
      }

      fetch(`${BASE_URL}/api/auth/signup`, {
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
            // localStorage.setItem("userData", JSON.stringify(data.data));
            dispatch({ type: SET_USER_DATA, userData: data?.data });

            Toast.fire({
              icon: `${"success"}`,
              title: `${data.message}`,
            });
            setTimeout(() => {
              router.push(ROUTES.DASHBOARD);
            }, 5000);
          } else {
            setLoading(false);
            Toast.fire({
              icon: `${"error"}`,
              title: `${data.message}`,
            });
          }
        });
    }
  };

  useEffect(() => {
    const AreaofInterestFunc = async () => {
      let { data, error } = await supabase
        .from("areas_of_interest")
        .select("*");

      if (data) {
        if (data.length > 0) {
          data = [
            {
              id: "all_aoi",
              label: "All Options",
            },
            ...data,
          ];
        }
        setareasOfInterest(data);
      }
    };
    AreaofInterestFunc();

    const userTypeFunc = async () => {
      const { data, error } = await supabase.from("user_type_list").select("*");
      if (data) {
        const filteredUserData = _.filter(data, (item) => {
          return item.type.toLowerCase() === ROLE_TYPE[1].title.toLowerCase();
        });
        setUserType(filteredUserData);
      }
    };
    userTypeFunc();
  }, []);

  useEffect(() => {
    const countryTypeFunc = async () => {
      const { data, error } = await supabase.from("cities").select("*");
      if (data) {
        if (country.title != "Select Country") {
          const filteredStateData = _.filter(data, (item) => {
            if (
              item?.country?.toLowerCase() === country?.title?.toLowerCase()
            ) {
              return item?.state;
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
      }
    };
    countryTypeFunc();
  }, [country, stateProvinceData]);

  const filteredUsersType =
    userQuery === ""
      ? userType
      : userType.filter((person) => {
          return person.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(userQuery.toLowerCase().replace(/\s+/g, ""));
        });

  const filteredAreaOfInterests =
    areaOfIntQuery === ""
      ? areasOfInterest
      : areasOfInterest.filter((info) => {
          return info.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(areaOfIntQuery.toLowerCase().replace(/\s+/g, ""));
        });

  return (
    <div className="p-4 md:p-8 rounded-3xl border border-solid border-gray-700">
      <h1 className="text-xl tracking-tight font-extrabold text-gray-900 sm:text-2xl md:text-3xl">
        <span className="block inline">Create An</span>{" "}
        <span className="block text-blue-600 inline">Account</span>
      </h1>
      <h6 className="text-gray-900 text-md sm:text-lg md:text-xl mt-2">
        Already Have An Account?{" "}
        <Link href={ROUTES.LOGIN}>
          <span className="cursor-pointer block text-blue-600 inline opacity-80 font-bold hover:opacity-100">
            Sign In
          </span>
        </Link>
      </h6>
      <form onSubmit={signup} className={"mt-8"}>
        <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
          <div className={"flex flex-col gap-2 my-2"}>
            <div className="containers">
              <div className="imageWrapper">
                <img className="image" id="img" src={profileImg} />
              </div>
              <div className="file-upload">
                <input
                  id="fileInput"
                  type="file"
                  fullWidth
                  className={"file-input"}
                  onChange={profileImgHandler}
                  ref={profileImgRef}
                  accept="image/png, image/gif, image/jpeg, image/jpg"
                />
                <img
                  src={"/choose-img.png"}
                  alt="choose-img"
                  className="choose-img"
                />
                <img
                  onClick={() => {
                    setProfileImg("");
                    setProfileImgObj(null);
                  }}
                  src={"/close.png"}
                  alt="remove"
                  className="remove-img"
                />
              </div>
            </div>

            {!isValidProfileImg ? (
              <span className={"text-sm text-red-500"}>{imgErrMsg}</span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
          {/* fullName input field */}
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
              className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type Here"
              onChange={(e) =>
                setFullName(e.target.value, setIsValidFullName(true))
              }
              value={fullName}
              ref={fullNameRef}
              maxLength={100}
            />
            {!isValidFullName ? (
              <span className={"text-sm text-red-500"}>{nameErrMsg}</span>
            ) : (
              ""
            )}
          </div>
          {/* userName input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            {/* <div className="flex flex-row flex-wrap gap-2 items-center"> */}
            <label
              for="user_name"
              className={
                "flex flex-col md:flex-row items-stretch md:items-center text-sm font-normal text-gray-900 dark:text-gray-300 relative"
              }
            >
              Username *{" "}
              <span className="mt-2 md:mt-0 ml-0 md:ml-2 text-xs font-normal text-gray-700">
                {USER_INFO_TEXT}
              </span>
            </label>
            {/* </div> */}
            <input
              type="text"
              id="user_name"
              className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type Here"
              onChange={(e) =>
                setUserName(e.target.value, setIsValidUserName(true))
              }
              value={userName}
              ref={userNameRef}
              maxLength={100}
            />
            {!isValidUserName ? (
              <span className={"text-sm text-red-500"}>{usernameErrMsg}</span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
          {/* email input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            <label
              for="email"
              className={
                "block text-sm font-normal text-gray-900 dark:text-gray-300"
              }
            >
              Email *
            </label>
            <input
              type={"text"}
              id="email"
              className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type Here"
              onChange={(e) =>
                setEmailAdd(e.target.value, setIsValidEmailAdd(true))
              }
              value={emailAdd}
              ref={emailRef}
            />
            {!isValidEmailAdd ? (
              <span className={"text-sm text-red-500"}>{emailErrMsg}</span>
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
              placeholder="Type Here"
              onChange={(value) => {
                setPhoneNum(`+${value}`, setIsValidPhoneNum(true));
              }}
              value={phoneNum}
              ref={phoneNumRef}
            />

            {!isValidPhoneNum ? (
              <span className={"text-sm text-red-500"}>
                {INVALID_PHONE_NUM}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
          {/* password input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            <label
              for="password"
              className={
                "flex items-center text-sm font-normal text-gray-900 dark:text-gray-300 relative"
              }
            >
              Password *{" "}
              <span className="group px-2">
                <InformationCircleIcon className="w-4 h-4" />{" "}
                <span className="group-hover:opacity-100 z-50 transition-opacity bg-gray-600 p-2 text-xs text-gray-100 rounded-md absolute -top-7 left-auto opacity-0 m-4 m-auto">
                  {INVALID_PASSWORD}
                </span>
              </span>{" "}
            </label>
            <div className="relative">
              <input
                type={!showPswd ? "password" : "text"}
                id="password"
                className={
                  "bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-16 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                }
                placeholder="Type Here"
                onChange={(e) => setPswd(e.target.value, setIsValidPswd(true))}
                value={pswd}
                ref={pswdRef}
                maxLength={20}
              />
              {showPswd ? (
                <EyeOffIcon
                  className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                  onClick={() => setShowPswd(false)}
                />
              ) : (
                <EyeIcon
                  className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                  onClick={() => setShowPswd(true)}
                />
              )}
            </div>
            {!isValidPswd ? (
              <span className={"text-sm text-red-500"}>{pswdErrMsg}</span>
            ) : (
              ""
            )}
          </div>

          {/* retype password input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            <label
              for="confirm_password"
              className={
                "flex items-center text-sm font-normal text-gray-900 dark:text-gray-300 relative"
              }
            >
              Confirm Password *{" "}
              <span className="group px-2">
                <InformationCircleIcon className="w-4 h-4" />{" "}
                <span className="group-hover:opacity-100 z-50 transition-opacity bg-gray-600 p-2 text-xs text-gray-100 rounded-md absolute -top-7 left-auto opacity-0 m-4 m-auto">
                  {INVALID_PASSWORD}
                </span>
              </span>{" "}
            </label>
            <div className="relative">
              <input
                type={!showConfirmPswd ? "password" : "text"}
                id="confirm_password"
                className={
                  "bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-16 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                }
                placeholder="Type Here"
                onChange={(e) =>
                  setConfirmPswd(e.target.value, setIsValidConfirmPswd(true))
                }
                value={confirmPswd}
                ref={confirmPswdRef}
                maxLength={20}
              />
              {showConfirmPswd ? (
                <EyeOffIcon
                  className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPswd(false)}
                />
              ) : (
                <EyeIcon
                  className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPswd(true)}
                />
              )}
            </div>
            {!isValidConfirmPswd ? (
              <span className={"text-sm text-red-500"}>
                {confirmPswdErrMsg}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
          {/* userType input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            <label className="block text-sm font-normal text-gray-900 dark:text-gray-300">
              User Type? *
            </label>
            <ComboBoxComponent
              valueKey={userTypeData}
              valueSetter={setUserTypeData}
              optionsList={filteredUsersType}
              itemQuery={userQuery}
              setItemQuery={setUserQuery}
              isRef={true}
              refType={userTypeRef}
            />
            {!isValidUserType ? (
              <span className={"text-sm text-red-500"}>
                {INVALID_USER_TYPE}
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
              <span className={"text-sm text-red-500"}>{INVALID_COUNTRY}</span>
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
                {INVALID_STATE_PROVINCE}
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
              <span className={"text-sm text-red-500"}>{INVALID_CITY}</span>
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
              placeholder="Type Here"
              onChange={(e) =>
                setZipCode(e.target.value, setIsValidZipCode(true))
              }
              value={zipCode}
              ref={zipCodeRef}
            />
            {!isValidZipCode ? (
              <span className={"text-sm text-red-500"}>{zipCodeErrMsg}</span>
            ) : (
              ""
            )}
          </div>
        </div>
        {/* area of interests input field */}
        <div className="flex flex-col gap-2 my-2 flex-1">
          <label
            className={
              "flex flex-col md:flex-row items-stretch md:items-center text-sm font-normal text-gray-900 dark:text-gray-300 relative"
            }
          >
            Area Of Interests *
            <span className="mt-2 md:mt-0 ml-0 md:ml-2 text-xs font-normal text-gray-700">
              {AREA_OF_INT_INFO_TEXT}
            </span>
          </label>
          <ComboBoxComponent
            type={"areaOfInt"}
            valueKey={areaOfInt}
            valueSetter={setAreaOfInt}
            optionsList={filteredAreaOfInterests}
            itemQuery={areaOfIntQuery}
            setItemQuery={setAreaOfIntQuery}
            isRef={true}
            refType={areaOfIntRef}
          />

          {!isValidAreaOfInt ? (
            <span className={"text-sm text-red-500"}>
              {INVALID_AREA_OF_INTERESTS}
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
          {loading ? <BeatLoader color="#fff" sizeunit={"px"} size={8} /> : ""}
          {loading ? "" : " Create An Account"}
        </button>{" "}
      </form>
    </div>
  );
}
