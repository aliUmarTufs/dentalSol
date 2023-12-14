import PhoneInput from "react-phone-input-2";
import { BeatLoader } from "react-spinners";
import { CustomButton, Footer, HeadMeta, Navbar } from "../../../components";
import { useState, useEffect, useRef, useContext } from "react";
import cookie from "cookie";

import {
  BASE_URL,
  COUNTRY_OPTIONS,
  INVALID_COUNTRY,
  INVALID_STATE_PROVINCE,
  isLoggedInIndication,
  getLoggedInUser,
  ROLE_TYPE,
  ROUTES,
  REQUIRED_EMAIL,
  INVALID_EMAIL,
  REQUIRED_USERNAME,
  INVALID_USERNAME,
  REQUIRED_PRACTICE_ADDRESS,
  INVALID_PRACTICE_ADDRESS,
  REQUIRED_PRACTICE_NUM,
  INVALID_PRACTICE_NUMBER,
  INVALID_USER_TYPE,
  INVALID_PHONE_NUM,
  INVALID_CITY,
  INVALID_AREA_OF_INTERESTS,
  Toast,
  REQUIRED_PASSWORD,
  INVALID_PASSWORD,
  UPLOAD_BASE_URL,
  REQUIRED_SHORT_BIO,
  INVALID_BIO_LENGTH,
  REQUIRED_OLD_PASSWORD,
  REQUIRED_NEW_PASSWORD,
  REQUIRED_CONFIRM_PASSWORD,
  REQUIRED_ZIP_CODE,
  INVALID_ZIP_CODE,
  USER_INFO_TEXT,
  AREA_OF_INT_INFO_TEXT,
  REQUIRED_ORGANIZATION,
  VENDOR_BIO_TEXT,
} from "../../../constants";
import {
  EyeIcon,
  EyeOffIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid";
import { ListBoxComponents } from "../../../components/ListBoxComponents";
import { useRouter } from "next/router";
import _ from "lodash";
import { ComboBoxComponent } from "../../../components/ComboBoxComponent";
import Util from "../../../services/Util";
import { supabase_admin_secret } from "../../../lib/supabaseClient";
import { MainContext } from "../../../context-api/MainContext";
import { SET_USER_DATA } from "../../../context-api/action-types";

export default function Profile({ pageData }) {
  const router = useRouter();
  const { MainState, dispatch } = useContext(MainContext);

  const [setupAccountLoading, setSetupAccountLoading] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [accountMode, setAccountMode] = useState("");
  const [isSuccessLoading, setIsSuccessLoading] = useState(false);

  //Name Field States and Refs
  const [fullName, setFullName] = useState("");
  const [isValidFullName, setIsValidFullName] = useState(true);
  const [nameErrMsg, setNameErrMsg] = useState("");
  const fullNameRef = useRef(null);

  //Email Field States and Refs
  const [emailAdd, setEmailAdd] = useState("");
  const [isValidEmailAdd, setIsValidEmailAdd] = useState(true);
  const [emailErrMsg, setEmailErrMsg] = useState("");
  const emailRef = useRef(null);

  //Username Fields States and Refs
  const [userName, setUserName] = useState("");
  const [isValidUserName, setIsValidUserName] = useState(true);
  const [usernameErrMsg, setUserNameErrMsg] = useState("");
  const userNameRef = useRef(null);

  //Old password states and refs
  const [oldPswd, setOldPswd] = useState("");
  const [isValidOldPswd, setIsValidOldPswd] = useState(true);
  const [oldPswdErrMsg, setOldPswdErrMsg] = useState("");
  const [showOldPswd, setShowOldPswd] = useState(false);
  const oldPswdRef = useRef(null);

  //New password states and refs
  const [newPswd, setnewPswd] = useState("");
  const [isValidnewPswd, setIsValidnewPswd] = useState(true);
  const [newPswdErrMsg, setnewPswdErrMsg] = useState("");
  const [shownewPswd, setShownewPswd] = useState(false);
  const newPswdRef = useRef(null);

  //Confirm password states and refs
  const [confirmPswd, setconfirmPswd] = useState("");
  const [isValidconfirmPswd, setIsValidconfirmPswd] = useState(true);
  const [confirmPswdErrMsg, setconfirmPswdErrMsg] = useState("");
  const [showconfirmPswd, setShowconfirmPswd] = useState(false);
  const confirmPswdRef = useRef(null);

  //Practice Number Fields States and Refs
  const [PracticeName, setPracticeName] = useState(null);
  const [isValidPracticeName, setIsValidPracticeName] = useState(true);
  const [PracticeNameErrMsg, setPracticeNameErrMsg] = useState("");
  const PracticeNameRef = useRef(null);

  //Practice Address
  const [practiceAdd, setPracticeAdd] = useState("");
  const [isValidPracticeAdd, setIsValidPracticeAdd] = useState(true);
  const [practiceAddErrMsg, setPracticeAddErrMsg] = useState("");
  const practiceAddRef = useRef(null);

  //User Type Fiels States and Refs
  const [userType, setUserType] = useState([]);
  const [userTypeData, setUserTypeData] = useState([]);
  const [isValidUserType, setIsValidUserType] = useState(true);
  const [userQuery, setUserQuery] = useState("");
  const userTypeRef = useRef(null);

  //Phone Number fiels States and Refs
  const [phoneNum, setPhoneNum] = useState("");
  const [isValidPhoneNum, setIsValidPhoneNum] = useState(true);
  const phoneNumRef = useRef(null);

  //Country Fields states and refs
  const [country, setCountry] = useState(COUNTRY_OPTIONS[0]);
  const [isValidCountry, setIsValidCountry] = useState(true);
  const countryRef = useRef(null);

  //States fields states and refs
  const [stateProvince, setStateProvince] = useState([]);
  const [stateProvinceData, setStateProvinceData] = useState([]);
  const [isValidStateProvince, setIsValidStateProvince] = useState(true);
  const stateProvinceRef = useRef(null);

  //City Fields States and refs
  const [cities, setCities] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [isValidCities, setIsValidCities] = useState(true);
  const citiesRef = useRef(null);

  //Area of Interest States and refs
  const [areasOfInterest, setareasOfInterest] = useState([]);
  const [areaOfIntQuery, setAreaOfIntQuery] = useState("");
  const [areaOfInt, setAreaOfInt] = useState([]);
  const [isValidAreaOfInt, setIsValidAreaOfInt] = useState(true);
  const areaOfIntRef = useRef(null);

  // ROle Type States and Refs
  const [roleType, setRoleType] = useState(ROLE_TYPE[0]);
  const [isValidRoleType, setIsValidRoleType] = useState(true);
  const roleTypeRef = useRef(null);

  //Profile Image States and refs
  const [profileImg, setProfileImg] = useState(() => "");
  const [profileImgObj, setProfileImgObj] = useState(() => null);
  const [isValidProfileImg, setIsValidProfileImg] = useState(true);
  const [imgErrMsg, setImgErrMsg] = useState("");
  const profileImgRef = useRef(null);

  //Zip code States and refs
  const [zipCode, setZipCode] = useState("");
  const [isValidZipCode, setIsValidZipCode] = useState(true);
  const [zipCodeErrMsg, setZipCodeErrMsg] = useState("");
  const zipCodeRef = useRef(null);

  //Short Bio States and Refs
  const [shortBio, setShortBio] = useState("");
  const [isValidShortBio, setIsValidShortBio] = useState(true);
  const [shortBioErrMsg, setShortBioErrMsg] = useState("");
  const shortBioRef = useRef(null);

  //Short Bio States and Refs
  const [LongBio, setLongBio] = useState("");
  const [isValidLongBio, setIsValidLongBio] = useState(true);
  const [LongBioErrMsg, setLongBioErrMsg] = useState("");
  const LongBioRef = useRef(null);

  //Vendor Cateories States and Refs
  const [vendorCategory, setVendorCategory] = useState([]);
  const [vendorCatData, setVendorCatData] = useState([]);
  const [vendorCatQuery, setVendorCatQuery] = useState("");
  const [isValidVendorCat, setIsValidVendorCat] = useState(true);
  const [vendorCatErrMsg, setVendorCatErrMsg] = useState("");
  const vendorCategoryRef = useRef(null);

  //Services List States and Refs
  const [servicesList, setServicesList] = useState([]);
  const [servicesListData, setServicesListData] = useState([]);
  const [servicesListQuery, setServicesListQuery] = useState("");
  const [isValidServicesList, setIsValidServicesList] = useState(true);
  const [servicesListErrMsg, setServicesListErrMsg] = useState("");
  const servicesListRef = useRef(null);

  //Organization Name Fields States and Refs
  const [orgName, setOrgName] = useState("");
  const [isValidOrgName, setIsValidOrgName] = useState(true);
  const [orgNameErrMsg, setOrgNameErrMsg] = useState("");
  const orgNameRef = useRef(null);

  //Organization Url Fields States and Refs
  const [orgUrl, setOrgUrl] = useState("");
  const [isValidOrgUrl, setIsValidOrgUrl] = useState(true);
  const [orgUrlErrMsg, setOrgUrlErrMsg] = useState("");
  const orgUrlRef = useRef(null);

  //Remaining Validations and States ANd Refs

  const [isSuccess, setIsSuccess] = useState(false);
  const [isUpdateOrgSuccess, setIsUpdateOrgSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changePswdLoading, setChangePswdLoading] = useState(false);
  const [changeOrgLoading, setChangeOrgLoading] = useState(false);
  const [changePlanLoading, setChangePlanLoading] = useState(false);
  const [cancelPlanLoading, setCancelPlanLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(null);

  useEffect(() => {
    const AuthUser = async () => {
      if (!isLoggedInIndication()) {
        router.push(ROUTES.LOGIN);
      } else {
        if (pageData?.userTypeList) {
          //   const userInfo = getLoggedInUser();
          const userInfo = MainState?.userData;

          if (userInfo) {
            let parseData = JSON.parse(userInfo);
            const filteredUserType = _.filter(
              pageData?.userTypeList,
              (item) => {
                return (
                  item?.type?.toLowerCase() ===
                  parseData?.role_type?.toLowerCase()
                );
              }
            );
            const filteredVendorCategories = _.filter(
              pageData?.vendor_categories,
              (item) => {
                return item?.category_name;
              }
            );
            const filteredServicesList = _.filter(
              pageData?.services_list,
              (item) => {
                return item?.service_name;
              }
            );
            setVendorCategory(filteredVendorCategories);
            setServicesList(filteredServicesList);
            setUserType(filteredUserType);
            setFullName(parseData?.user_name);
            setUserName(parseData?.username);
            setEmailAdd(parseData?.user_email);
            setPracticeName(parseData?.office_number);
            setPracticeAdd(parseData?.office_address);
            setPhoneNum(parseData?.phone_number);
            setProfileImg(parseData?.image);
            setZipCode(parseData?.zip_code);
            setShortBio(parseData?.short_bio);
            setLongBio(parseData?.long_bio);
            setOrgName(pageData?.userOrgData?.name);
            setOrgUrl(pageData?.userOrgData?.url);

            const setUserCountry = _.filter(COUNTRY_OPTIONS, (item) => {
              if (item?.title == parseData?.user_city?.country) {
                setCountry(item);
              }
            });
            let arr = [];
            const setUserTypeList = _.map(parseData?.user_type_list, (item) => {
              let d = _.filter(pageData?.userTypeList, (i) => {
                return i?.name == item;
              });
              if (d?.length > 0) {
                arr.push(d[0]);
              }
              return d;
            });
            let arrAreasOfInteres = [];
            const setUserAreaOfInterestList = _.map(
              parseData?.areas_of_interest,
              (item) => {
                let d = _.filter(pageData?.areasOfInterest, (i) => {
                  return i?.label == item;
                });
                if (d?.length > 0) {
                  arrAreasOfInteres.push(d[0]);
                }
                return d;
              }
            );
            setAreaOfInt(arrAreasOfInteres);
            setUserTypeData(arr);
            setCitiesData(parseData?.user_city);
            setStateProvinceData(parseData?.user_city);
          }
          setLoggedInUser(JSON.parse(userInfo));
          setIsLoggedInUser(true);
        }
        if (pageData?.areasOfInterest) {
          setareasOfInterest(pageData?.areasOfInterest);
        }
      }
    };
    AuthUser();

    setAccountType(router?.query?.type);
    setAccountMode(router?.query?.mode);
  }, []);

  useEffect(() => {
    let stripeAccountDetails = localStorage.getItem("stripeAccountObject");
    if (
      !_.isEmpty(accountType) &&
      // !_.isEmpty(accountMode) &&
      !_.isNull(isLoggedInUser) &&
      !_.isNull(stripeAccountDetails)
    ) {
      const getUpdatedUserData = async () => {
        setIsSuccessLoading(true);
        await fetch(`${BASE_URL}/api/accounts/setup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: loggedInUser?.id,
          }),
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.status == true) {
              setIsSuccessLoading(false);
              localStorage.removeItem("stripeAccountObject");
              if (loggedInUser) {
                setLoggedInUser(response?.data);
                // localStorage.setItem(
                //   "userData",
                //   JSON.stringify(response?.data)
                // );
                dispatch({ type: SET_USER_DATA, userData: response?.data });
              }
              Toast.fire({
                icon: `${"success"}`,
                title: `${`Your account has been ${
                  loggedInUser?.account_setup == 1 ? "updated" : "created"
                } sucessfully`}`,
              });
            }
          });
      };
      getUpdatedUserData();
    }
  }, [accountType, accountMode, router, isLoggedInUser]);

  useEffect(() => {
    if (isSuccessLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSuccessLoading]);

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
          // return item?.state?.toLowerCase() === stateProvinceData?.state?.toLowerCase();
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

  const filteredVendorCategory =
    vendorCatQuery === ""
      ? vendorCategory
      : vendorCategory.filter((item) => {
          return item.category_name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(vendorCatQuery.toLowerCase().replace(/\s+/g, ""));
        });

  const filteredServicesList =
    servicesListQuery === ""
      ? servicesList
      : servicesList.filter((item) => {
          return item.service_name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(servicesListQuery.toLowerCase().replace(/\s+/g, ""));
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

  const filteredUsersType =
    userQuery === ""
      ? userType
      : userType.filter((person) => {
          return person.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(userQuery.toLowerCase().replace(/\s+/g, ""));
        });

  const validateForm = () => {
    let isValid = true;

    setIsValidEmailAdd(true);
    setIsValidFullName(true);
    setIsValidUserName(true);
    setIsValidPracticeName(true);
    setIsValidPracticeAdd(true);
    setIsValidPhoneNum(true);
    setIsValidUserType(true);
    setIsValidCountry(true);
    setIsValidStateProvince(true);
    setIsValidCities(true);
    setIsValidAreaOfInt(true);
    setIsValidProfileImg(true);
    setIsValidZipCode(true);
    setIsValidVendorCat(true);
    setIsValidServicesList(true);

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

    // if (_.isEmpty(fullName)) {
    //   fullNameRef.current.focus();
    //   setNameErrMsg(REQUIRED_NAME);
    //   setIsValidFullName(false);
    //   isValid = false;
    // } else if (!Util.isValidName(fullName)) {
    //   fullNameRef.current.focus();
    //   setIsValidFullName(false);
    //   setNameErrMsg(INVALID_NAME);
    //   isValid = false;
    // }
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
    if (loggedInUser?.roleType == "Vendor") {
      if (_.isEmpty(practiceAdd)) {
        practiceAddRef.current.focus();
        setIsValidPracticeAdd(false);
        setPracticeAddErrMsg(REQUIRED_PRACTICE_ADDRESS);
        isValid = false;
      } else if (!Util.isValidUsaAdd(practiceAdd)) {
        practiceAddRef.current.focus();
        setIsValidPracticeAdd(false);
        setPracticeAddErrMsg(INVALID_PRACTICE_ADDRESS);
        isValid = false;
      }
      if (_.isNil(PracticeName)) {
        PracticeNameRef.current.focus();
        setIsValidPracticeName(false);
        setPracticeNameErrMsg(REQUIRED_PRACTICE_NUM);
        isValid = false;
      } else if (
        !Util.isValidPracticeName(PracticeName) ||
        _.size(PracticeName) > 10
      ) {
        PracticeNameRef.current.focus();
        setIsValidPracticeName(false);
        setPracticeNameErrMsg(INVALID_PRACTICE_NUMBER);
        isValid = false;
      }
      if (_.isEmpty(phoneNum) || phoneNum === "+") {
        setIsValidPhoneNum(false);
        isValid = false;
      }
    }
    // Short Bio
    // if (_.isEmpty(shortBio)) {
    // 	shortBioRef.current.focus();
    // 	setIsValidShortBio(false);
    // 	setShortBioErrMsg(REQUIRED_SHORT_BIO);
    // 	isValid = false;
    // } else
    if (_.size(shortBio) > 250) {
      shortBioRef.current.focus();
      setIsValidShortBio(false);
      setShortBioErrMsg(INVALID_BIO_LENGTH);
      isValid = false;
    }

    // Long Bio
    // if (_.isEmpty(LongBio)) {
    //   LongBioRef.current.focus();
    //   setIsValidLongBio(false);
    //   setLongBioErrMsg(REQUIRED_LONG_BIO);
    //   isValid = false;
    // } else if (_.size(LongBio) > 1000) {
    //   LongBioRef.current.focus();
    //   setIsValidLongBio(false);
    //   setLongBioErrMsg(INVALID_BIO_LENGTH);
    //   isValid = false;
    // }

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
    if (_.isEmpty(areaOfInt)) {
      areaOfIntRef.current.focus();
      setIsValidAreaOfInt(false);
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
    if (_.isEmpty(vendorCatData)) {
      vendorCategoryRef.current.focus();
      setIsValidVendorCat(false);
      setVendorCatErrMsg("Vendor category is required.");
      isValid = false;
    }
    if (_.isEmpty(servicesListData)) {
      servicesListRef.current.focus();
      setIsValidServicesList(false);
      setServicesListErrMsg("Service is required.");
      isValid = false;
    }

    return isValid;
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    // return false
    if (validateForm()) {
      setLoading(true);

      let payload = {
        name: fullName,
        // profileImg: `${UPLOAD_BASE_URL}/${response.data.Key}`,
        profileImg: "",
        email: emailAdd,
        practiceName: PracticeName,
        practiceAddress: practiceAdd,
        phoneNumber: phoneNum,
        city: citiesData.id,
        cityName: citiesData.name,
        country: country.title,
        state: stateProvinceData.state,
        userTypeList: _.map(userTypeData, "name"),
        username: userName,
        areasOfInterest: _.map(areaOfInt, "label"),
        id: loggedInUser?.id,
        zip_code: zipCode,
        short_bio: shortBio,
        long_bio: LongBio,
        vendor_categories: _.map(vendorCatData, "category_name"),
        services_list: _.map(servicesListData, "service_name"),
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

      fetch(`${BASE_URL}/api/auth/profile/update`, {
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
            // localStorage.setItem("userData", JSON.stringify(data?.data));
            dispatch({ type: SET_USER_DATA, userData: data?.data });

            setIsSuccess(true);
            Toast.fire({
              icon: `${"success"}`,
              title: `${data.message}`,
            });
            setTimeout(() => {
              router.reload();
            }, 3000);
          } else {
            setIsSuccess(false);
            setLoading(false);
            Toast.fire({
              icon: `${"error"}`,
              title: `${data.message}`,
            });
          }
        });
    }
  };

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

  const validateChangePasswordForm = () => {
    let isValid = true;

    setIsValidOldPswd(true);
    setIsValidnewPswd(true);
    setIsValidconfirmPswd(true);

    if (_.isEmpty(oldPswd)) {
      oldPswdRef.current.focus();
      setIsValidOldPswd(false);
      setOldPswdErrMsg(REQUIRED_OLD_PASSWORD);
      isValid = false;
    } else if (!Util.isValidPassword(oldPswd)) {
      oldPswdRef.current.focus();
      setIsValidOldPswd(false);
      setOldPswdErrMsg(INVALID_PASSWORD);
      isValid = false;
    }

    if (_.isEmpty(newPswd)) {
      newPswdRef.current.focus();
      setIsValidnewPswd(false);
      setnewPswdErrMsg(REQUIRED_NEW_PASSWORD);
      isValid = false;
    } else if (!Util.isValidPassword(newPswd)) {
      newPswdRef.current.focus();
      setIsValidnewPswd(false);
      setnewPswdErrMsg(INVALID_PASSWORD);
      isValid = false;
    } else if (oldPswd === newPswd) {
      newPswdRef.current.focus();
      setIsValidnewPswd(false);
      setnewPswdErrMsg("New password can not be your old password");
      isValid = false;
    }

    if (_.isEmpty(confirmPswd)) {
      confirmPswdRef.current.focus();
      setIsValidconfirmPswd(false);
      setconfirmPswdErrMsg(REQUIRED_CONFIRM_PASSWORD);
      isValid = false;
    } else if (newPswd !== confirmPswd) {
      confirmPswdRef.current.focus();
      setIsValidconfirmPswd(false);
      setconfirmPswdErrMsg("Password should be matched");
      isValid = false;
    }

    return isValid;
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (validateChangePasswordForm()) {
      setChangePswdLoading(true);
      let payload = {
        old_password: oldPswd,
        new_password: newPswd,
      };
      fetch(`${BASE_URL}/api/auth/password/change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${loggedInUser?.auth_token}`,
          Refreshtoken: `${loggedInUser?.refresh_token}`,
          Userid: `${loggedInUser?.id}`,
          email: `${loggedInUser?.user_email}`,
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
            setTimeout(() => {
              router.reload();
            }, 3000);
          } else {
            setIsSuccess(false);
            setChangePswdLoading(false);
            Toast.fire({
              icon: `${"error"}`,
              title: `${data.message}`,
            });
          }
        });
    }
  };

  const validateOrgForm = () => {
    let isValid = true;

    setIsValidOrgName(true);
    setIsValidOrgUrl(true);

    if (_.isEmpty(orgName)) {
      orgNameRef.current.focus();
      setIsValidOrgName(false);
      setOrgNameErrMsg(REQUIRED_ORGANIZATION);
      isValid = false;
    }

    if (!_.isEmpty(orgUrl) && !Util.isValidURL(orgUrl)) {
      orgUrlRef.current.focus();
      setIsValidOrgUrl(false);
      setOrgUrlErrMsg("Url should be valid.");
      isValid = false;
    }

    return isValid;
  };

  // update organization API handler
  const updateOrganization = async (e) => {
    e.preventDefault();
    if (validateOrgForm()) {
      setChangeOrgLoading(true);
      let payload = {
        organization_id: pageData?.userOrgData?.id,
        user_id: loggedInUser?.id,
        organization_name: orgName,
        url: orgUrl,
      };
      fetch(`${BASE_URL}/api/organization/edit`, {
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
            setIsUpdateOrgSuccess(true);
            Toast.fire({
              icon: `${"success"}`,
              title: `${data.message}`,
            });
            setTimeout(() => {
              router.reload();
            }, 3000);
          } else {
            setIsUpdateOrgSuccess(false);
            setChangeOrgLoading(false);
            Toast.fire({
              icon: `${"error"}`,
              title: `${data.message}`,
            });
          }
        });
    }
  };

  /* 	stripe setup account handler */
  const stripeAccountHandler = async () => {
    setSetupAccountLoading(true);

    let payload = {
      email: loggedInUser?.user_email,
    };

    fetch(`${BASE_URL}/api/accounts/create`, {
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
          localStorage.setItem("stripeAccountObject", data?.data);
          router.push(data?.data?.url);
        } else {
          setSetupAccountLoading(false);
          Toast.fire({
            icon: `${"error"}`,
            title: `${data.message}`,
          });
        }
      });
  };

  /* 	cancel subscription handler */
  const cancelSubscriptionAccount = async () => {
    setCancelPlanLoading(true);

    let payload = {
      user_id: loggedInUser?.id,
    };

    fetch(`${BASE_URL}/api/subscriptions/cancel`, {
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

          //   localStorage.setItem("userData", JSON.stringify(data?.data?.user));

          dispatch({ type: SET_USER_DATA, userData: data?.data?.user });

          router.push(ROUTES.PROFILE);
        } else {
          setCancelPlanLoading(false);
          Toast.fire({
            icon: `${"error"}`,
            title: `${data.message}`,
          });
        }
      });
  };

  console.log({ citiesData, isLoggedInUser });
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
        title="Dent247 | Dashboard | Edit Profile"
        description="description"
        content="Dent247 | Dashboard | Edit Profile"
      />
      {_.isNull(isLoggedInUser) || !isLoggedInUser ? (
        <div className="my-2 flex justify-center w-full h-screen items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <div>
          <Navbar isDashboard={true} />
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 ">
              <div className="max-w-4xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
                <img
                  src="/logo.png"
                  alt="Dent247"
                  className="w-8 sm:w-12 md:w-16 h-auto mx-auto mb-4 md:mb-8"
                />
                <div className="p-4 md:p-8 rounded-3xl border border-solid border-gray-700">
                  <h1 className="text-xl tracking-tight font-extrabold text-gray-900 sm:text-2xl md:text-3xl">
                    <span className="block inline">Edit</span>{" "}
                    <span className="block text-blue-600 inline">Profile</span>
                  </h1>

                  <form onSubmit={updateProfile} className={"mt-8"}>
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
                            setFullName(
                              e.target.value,
                              setIsValidFullName(true)
                            )
                          }
                          value={fullName}
                          ref={fullNameRef}
                          maxLength={100}
                        />
                        {!isValidFullName ? (
                          <span className={"text-sm text-red-500"}>
                            {nameErrMsg}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      {/* userName input field */}
                      <div className="flex flex-col gap-2 my-2 flex-1 relative">
                        <div className="flex flex-row flex-wrap gap-2 items-center">
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
                        </div>
                        <input
                          type="text"
                          id="user_name"
                          className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Type Here"
                          onChange={(e) =>
                            setUserName(
                              e.target.value,
                              setIsValidUserName(true)
                            )
                          }
                          value={userName}
                          ref={userNameRef}
                          maxLength={100}
                        />
                        {!isValidUserName ? (
                          <span className={"text-sm text-red-500"}>
                            {usernameErrMsg}
                          </span>
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
                          id="email"
                          className="cursor-not-allowed bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Type Here"
                          onChange={(e) =>
                            setEmailAdd(
                              e.target.value,
                              setIsValidEmailAdd(true)
                            )
                          }
                          value={emailAdd}
                          ref={emailRef}
                          disabled={true}
                        />
                        {!isValidEmailAdd ? (
                          <span className={"text-sm text-red-500"}>
                            {emailErrMsg}
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
                    {/* SHORT BIO START */}
                    {loggedInUser?.role_type == "Vendor" ? (
                      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                        {/* short bio input field */}
                        <div className="flex flex-col gap-2 my-2 flex-1">
                          <label
                            for="short_bio"
                            className={
                              "flex flex-col md:flex-row items-stretch md:items-center text-sm font-normal text-gray-900 dark:text-gray-300 relative"
                            }
                          >
                            Short Bio
                            <span className="mt-2 md:mt-0 ml-0 md:ml-2 text-xs font-normal text-gray-700">
                              {VENDOR_BIO_TEXT}
                            </span>
                          </label>

                          <input
                            type="text"
                            id="short_bio"
                            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Type Here"
                            onChange={(e) =>
                              setShortBio(
                                e.target.value,
                                setIsValidShortBio(true)
                              )
                            }
                            value={shortBio}
                            ref={shortBioRef}
                            maxLength={250}
                          />
                          {!isValidShortBio ? (
                            <span className={"text-sm text-red-500"}>
                              {shortBioErrMsg}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {/* SHORT BIO END */}
                    {/* LONG BIO START */}
                    {loggedInUser?.role_type == "Vendor" ? (
                      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                        {/* fullName input field */}
                        <div className="flex flex-col gap-2 my-2 flex-1">
                          <label
                            for="long_bio"
                            className={
                              "flex flex-col md:flex-row items-stretch md:items-center text-sm font-normal text-gray-900 dark:text-gray-300 relative"
                            }
                          >
                            Long Bio
                            <span className="mt-2 md:mt-0 ml-0 md:ml-2 text-xs font-normal text-gray-700">
                              {VENDOR_BIO_TEXT}
                            </span>
                          </label>
                          <input
                            type="text"
                            id="long_bio"
                            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Type Here"
                            onChange={(e) =>
                              setLongBio(
                                e.target.value,
                                setIsValidLongBio(true)
                              )
                            }
                            value={LongBio}
                            ref={LongBioRef}
                            maxLength={1000}
                          />
                          {!isValidLongBio ? (
                            <span className={"text-sm text-red-500"}>
                              {LongBioErrMsg}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {/*LONG BIO END */}
                    {loggedInUser?.role_type == "Vendor" ? (
                      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                        {/* PracticeNameber input field */}
                        <div className="flex flex-col gap-2 my-2 flex-1">
                          <label
                            for="practice_num"
                            className={
                              "block text-sm font-normal text-gray-900 dark:text-gray-300"
                            }
                          >
                            Name Of Practice *
                          </label>
                          <input
                            type="text"
                            id="practice_num"
                            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Type Here"
                            onChange={(e) =>
                              setPracticeName(
                                e.target.value,
                                setIsValidPracticeName(true)
                              )
                            }
                            value={PracticeName}
                            ref={PracticeNameRef}
                          />
                          {!isValidPracticeName ? (
                            <span className={"text-sm text-red-500"}>
                              {PracticeNameErrMsg}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                        {/* practice address input field */}
                        <div className="flex flex-col gap-2 my-2 flex-1">
                          <label
                            for="practice_add"
                            className={
                              "block text-sm font-normal text-gray-900 dark:text-gray-300"
                            }
                          >
                            Practice Address *
                          </label>
                          <input
                            type="text"
                            id="practice_add"
                            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Type Here"
                            onChange={(e) =>
                              setPracticeAdd(
                                e.target.value,
                                setIsValidPracticeAdd(true)
                              )
                            }
                            value={practiceAdd}
                            ref={practiceAddRef}
                          />
                          {!isValidPracticeAdd ? (
                            <span className={"text-sm text-red-500"}>
                              {practiceAddErrMsg}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
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
                          <span className={"text-sm text-red-500"}>
                            {INVALID_COUNTRY}
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
                          <span className={"text-sm text-red-500"}>
                            {INVALID_CITY}
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
                          placeholder="Type Here"
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
                    {loggedInUser?.role_type == "Vendor" ? (
                      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                        {/* vendor categories input field */}
                        <div className="flex flex-col gap-2 my-2 flex-1">
                          <label className="block text-sm font-normal text-gray-900 dark:text-gray-300">
                            Vendor Categories *
                          </label>
                          <ComboBoxComponent
                            valueKey={vendorCatData}
                            valueSetter={setVendorCatData}
                            optionsList={filteredVendorCategory}
                            itemQuery={vendorCatQuery}
                            setItemQuery={setVendorCatQuery}
                            isRef={true}
                            refType={vendorCategoryRef}
                          />
                          {!isValidVendorCat ? (
                            <span className={"text-sm text-red-500"}>
                              {vendorCatErrMsg}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                        {/* services list input field */}
                        <div className="flex flex-col gap-2 my-2 flex-1">
                          <label className="block text-sm font-normal text-gray-900 dark:text-gray-300">
                            Services List *
                          </label>
                          <ComboBoxComponent
                            valueKey={servicesListData}
                            valueSetter={setServicesListData}
                            optionsList={filteredServicesList}
                            itemQuery={servicesListQuery}
                            setItemQuery={setServicesListQuery}
                            isRef={true}
                            refType={servicesListRef}
                          />
                          {!isValidServicesList ? (
                            <span className={"text-sm text-red-500"}>
                              {servicesListErrMsg}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
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
                      {loading ? (
                        <BeatLoader color="#fff" sizeunit={"px"} size={8} />
                      ) : (
                        ""
                      )}
                      {loading ? "" : "update profile"}
                    </button>{" "}
                  </form>
                </div>
              </div>
            </div>

            {/* UPDATE ORGANIZATION */}
            <div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 ">
              <div className="max-w-4xl mx-auto px-4 lg:px-2  pb-8 md:pb-12 lg:pb-20">
                <div className="p-4 md:p-8 rounded-3xl border border-solid border-gray-700">
                  <h1 className="text-xl tracking-tight font-extrabold text-gray-900 sm:text-2xl md:text-3xl">
                    <span className="block inline">Edit</span>{" "}
                    <span className="block text-blue-600 inline">
                      Organization
                    </span>
                  </h1>

                  <form onSubmit={updateOrganization} className={"mt-8"}>
                    <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                      {/* org name input field */}
                      <div className="flex flex-col gap-2 my-2 flex-1">
                        <label
                          for="orgName"
                          className={
                            "block text-sm font-normal text-gray-900 dark:text-gray-300"
                          }
                        >
                          Organization Name *
                        </label>
                        <div className="relative">
                          <input
                            id="orgName"
                            type={"text"}
                            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Type Here"
                            onChange={(e) =>
                              setOrgName(
                                e.target.value,
                                setIsValidOrgName(true)
                              )
                            }
                            value={orgName}
                            ref={orgNameRef}
                          />
                        </div>
                        {!isValidOrgName ? (
                          <span className={"text-sm text-red-500"}>
                            {orgNameErrMsg}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                      {/* org url input field */}
                      <div className="flex flex-col gap-2 my-2 flex-1">
                        <label
                          for="orgUrl"
                          className={
                            "block text-sm font-normal text-gray-900 dark:text-gray-300"
                          }
                        >
                          Organization Url
                        </label>
                        <div className="relative">
                          <input
                            id="orgUrl"
                            type={"text"}
                            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Type Here"
                            onChange={(e) =>
                              setOrgUrl(e.target.value, setIsValidOrgUrl(true))
                            }
                            value={orgUrl}
                            ref={orgUrlRef}
                          />
                        </div>
                        {!isValidOrgUrl ? (
                          <span className={"text-sm text-red-500"}>
                            {orgUrlErrMsg}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={changeOrgLoading ? true : false}
                      className={`${
                        changeOrgLoading
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      } w-full h-14 mt-8 md:mt-12 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    >
                      {changeOrgLoading ? (
                        <BeatLoader color="#fff" sizeunit={"px"} size={8} />
                      ) : (
                        ""
                      )}
                      {changeOrgLoading ? "" : "Update Organization"}
                    </button>{" "}
                  </form>
                </div>
              </div>
            </div>

            {/* CHANGE PASSWORD */}
            <div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 ">
              <div className="max-w-4xl mx-auto px-4 lg:px-2  pb-8 md:pb-12 lg:pb-20">
                <div className="p-4 md:p-8 rounded-3xl border border-solid border-gray-700">
                  <h1 className="text-xl tracking-tight font-extrabold text-gray-900 sm:text-2xl md:text-3xl">
                    <span className="block inline">Change</span>{" "}
                    <span className="block text-blue-600 inline">Password</span>
                  </h1>

                  <form onSubmit={changePassword} className={"mt-8"}>
                    <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                      {/* old password input field */}
                      <div className="flex flex-col gap-2 my-2 flex-1">
                        <label
                          for="password"
                          className={
                            "block text-sm font-normal text-gray-900 dark:text-gray-300"
                          }
                        >
                          Old Password *
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type={!showOldPswd ? "password" : "text"}
                            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Type Here"
                            onChange={(e) =>
                              setOldPswd(
                                e.target.value,
                                setIsValidOldPswd(true)
                              )
                            }
                            value={oldPswd}
                            ref={oldPswdRef}
                          />
                          {showOldPswd ? (
                            <EyeOffIcon
                              className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                              onClick={() => setShowOldPswd(false)}
                            />
                          ) : (
                            <EyeIcon
                              className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                              onClick={() => setShowOldPswd(true)}
                            />
                          )}
                        </div>
                        {!isValidOldPswd ? (
                          <span className={"text-sm text-red-500"}>
                            {oldPswdErrMsg}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      {/* password input field */}
                    </div>
                    <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                      {/* new password input field */}
                      <div className="flex flex-col gap-2 my-2 flex-1">
                        <label
                          for="password"
                          className={
                            "block text-sm font-normal text-gray-900 dark:text-gray-300"
                          }
                        >
                          New Password *
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type={!shownewPswd ? "password" : "text"}
                            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Type Here"
                            onChange={(e) =>
                              setnewPswd(
                                e.target.value,
                                setIsValidnewPswd(true)
                              )
                            }
                            value={newPswd}
                            ref={newPswdRef}
                          />
                          {shownewPswd ? (
                            <EyeOffIcon
                              className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                              onClick={() => setShownewPswd(false)}
                            />
                          ) : (
                            <EyeIcon
                              className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                              onClick={() => setShownewPswd(true)}
                            />
                          )}
                        </div>
                        {!isValidnewPswd ? (
                          <span className={"text-sm text-red-500"}>
                            {newPswdErrMsg}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      {/* password input field */}
                    </div>
                    <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
                      {/* confirm password input field */}
                      <div className="flex flex-col gap-2 my-2 flex-1">
                        <label
                          for="password"
                          className={
                            "block text-sm font-normal text-gray-900 dark:text-gray-300"
                          }
                        >
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type={!showconfirmPswd ? "password" : "text"}
                            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Type Here"
                            onChange={(e) =>
                              setconfirmPswd(
                                e.target.value,
                                setIsValidconfirmPswd(true)
                              )
                            }
                            value={confirmPswd}
                            ref={confirmPswdRef}
                          />
                          {showconfirmPswd ? (
                            <EyeOffIcon
                              className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                              onClick={() => setShowconfirmPswd(false)}
                            />
                          ) : (
                            <EyeIcon
                              className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                              onClick={() => setShowconfirmPswd(true)}
                            />
                          )}
                        </div>
                        {!isValidconfirmPswd ? (
                          <span className={"text-sm text-red-500"}>
                            {confirmPswdErrMsg}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      {/* password input field */}
                    </div>
                    <button
                      type="submit"
                      disabled={changePswdLoading ? true : false}
                      className={`${
                        changePswdLoading
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      } w-full h-14 mt-8 md:mt-12 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    >
                      {changePswdLoading ? (
                        <BeatLoader color="#fff" sizeunit={"px"} size={8} />
                      ) : (
                        ""
                      )}
                      {changePswdLoading ? "" : "Change Password"}
                    </button>{" "}
                  </form>
                </div>
              </div>
            </div>

            {/* PAYMENT UPDATE */}
            {loggedInUser?.role_type == "Vendor" ? (
              <div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 ">
                <div className="max-w-4xl mx-auto px-4 lg:px-2  pb-8 md:pb-12 lg:pb-20">
                  <div className="p-4 md:p-8 rounded-3xl border border-solid border-gray-700">
                    {/* SUBSCRIPTION DETAILS */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between">
                      <div className="flex flex-col items-stretch gap-1 flex-1">
                        <h1 className="text-lg tracking-tight text-bluish-600 sm:text-2xl font-semibold font-inter capitalize">
                          subscription
                        </h1>
                        <h6 className="text-base tracking-tight text-bluish-600 font-medium font-inter capitalize">
                          {loggedInUser?.subscription_id
                            ? `${loggedInUser?.subscription_id?.subscription_title} - ${loggedInUser?.plan_type}`
                            : "Basic Account Plan"}
                        </h6>
                      </div>

                      <div className="flex flex-col sm:flex-row mt-4 md:mt-0 md:items-center gap-2.5 justify-end md:justify-between flex-1">
                        <button
                          disabled={cancelPlanLoading ? true : false}
                          onClick={
                            loggedInUser?.subscription_id || cancelPlanLoading
                              ? cancelSubscriptionAccount
                              : undefined
                          }
                          className={`${
                            loggedInUser?.subscription_id || cancelPlanLoading
                              ? "cursor-pointer hover:bg-blue-600 hover:text-white focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                              : "cursor-not-allowed"
                          } w-full h-14 flex items-center justify-center text-blue-600 rounded-md border border-blue-600 text-sm capitalize`}
                        >
                          {cancelPlanLoading ? (
                            <BeatLoader color="#fff" sizeunit={"px"} size={8} />
                          ) : (
                            ""
                          )}
                          {cancelPlanLoading ? "" : "Cancel Plan"}
                        </button>

                        <button
                          disabled={changePlanLoading ? true : false}
                          onClick={() => router.push(ROUTES.PRICING)}
                          className={`${
                            changePlanLoading
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          } w-full h-14 mt-2 sm:mt-0 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        >
                          {changePlanLoading ? (
                            <BeatLoader color="#fff" sizeunit={"px"} size={8} />
                          ) : (
                            ""
                          )}
                          {changePlanLoading ? "" : "Change Plan"}
                        </button>
                      </div>
                    </div>

                    <hr className="w-full h-px mx-auto my-8 bg-greyish-600 border-0" />

                    {/* CARD DETAILS */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between">
                      <div className="flex flex-col items-stretch gap-1 flex-2">
                        <h1 className="text-md tracking-tight text-bluish-600 sm:text-lg font-semibold font-inter capitalize">
                          payment method stripe
                        </h1>
                        {loggedInUser?.accounts &&
                        loggedInUser?.accounts?.length > 0 ? (
                          <>
                            {loggedInUser?.accounts?.map((e) => {
                              return (
                                <div className="flex items-center gap-3 mt-2">
                                  <img
                                    src={"/payment-card.png"}
                                    alt="payment-card"
                                    className="w-8 h-6"
                                  />
                                  <span className="text-dark-bluish-100 text-sm font-inter font-medium">
                                    **********{e?.last4}
                                  </span>
                                  <img
                                    src={"/info-icon.png"}
                                    alt="info"
                                    className="w-5 h-5"
                                  />
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            <span className="text-dark-bluish-100 text-base font-inter font-medium capitalize">
                              no card found
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row mt-4 sm:mt-0 sm:items-center gap-2.5 sm:justify-end flex-1">
                        {loggedInUser?.account_setup == 1 ? (
                          <button
                            disabled={setupAccountLoading ? true : false}
                            onClick={stripeAccountHandler}
                            className={`${
                              setupAccountLoading
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            } w-full h-14 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                          >
                            {setupAccountLoading ? (
                              <BeatLoader
                                color="#fff"
                                sizeunit={"px"}
                                size={8}
                              />
                            ) : (
                              ""
                            )}
                            {setupAccountLoading ? "" : "Update Card"}
                          </button>
                        ) : (
                          <button
                            disabled={setupAccountLoading ? true : false}
                            onClick={stripeAccountHandler}
                            className={`${
                              setupAccountLoading
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            } w-full h-14 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                          >
                            {setupAccountLoading ? (
                              <BeatLoader
                                color="#fff"
                                sizeunit={"px"}
                                size={8}
                              />
                            ) : (
                              ""
                            )}
                            {setupAccountLoading ? "" : "Setup Account"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  // Pass data to the page via props
  let user_token_info;
  let pageData = null;
  let obj = {
    user_id: null,
  };

  if (context?.req?.headers?.cookie) {
    const cookies = cookie?.parse(context?.req?.headers?.cookie);
    user_token_info = cookies?.user_token;
    obj.user_id = user_token_info;
  }

  const getPageData = await fetch(`${BASE_URL}/api/edit_profile/getdata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  const data = await getPageData.json();
  if (data?.status === true) {
    pageData = data?.data;
  }

  return {
    props: {
      pageData,
      isProtected: true,
    },
  };
}
