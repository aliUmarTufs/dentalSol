import { Switch } from "@headlessui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { BeatLoader } from "react-spinners";
import {
  COURSE_MODE,
  REQUIRED_TITLE,
  REQUIRED_PRICE,
  INVALID_PRICE,
  REQUIRED_DATE,
  REQUIRED_VIDEO,
  REQUIRED_SHORT_DESC,
  REQUIRED_LONG_DESC,
  REQUIRED_ORGANIZATION,
  REQUIRED_CATEGORY,
  REQUIRED_TEACHER,
  UPLOAD_BASE_URL,
  BASE_URL,
  ROUTES,
  Toast,
  getLoggedInUser,
  isLoggedInIndication,
  INVALID_IMAGE,
  REQUIRED_IMAGE,
  REQUIRED_NAME,
  REQUIRED_URL,
  REQUIRED_ATTRS,
  INVALID_PHONE_NUM,
  REQUIRED_EMAIL,
  INVALID_EMAIL,
  REQUIRED_SHORT_DESC_MIN_LENGTH,
  REQUIRED_SHORT_DESC_MAX_LENGTH,
} from "../../constants";
import { supabase, supabase_admin_secret } from "../../lib/supabaseClient";
import Util from "../../services/Util";
import { ComboBoxComponent } from "../ComboBoxComponent";
import { ListBoxComponents } from "../ListBoxComponents";
import _ from "lodash";

const CustomEditor = dynamic(() => import("../CustomJoditEditor"), {
  ssr: false,
});

export default function DirectoryForm({ isEditData, loggedinUser }) {
  const router = useRouter();

  const [isEdited, setIsEdited] = useState(null);
  const [loggedInUserID, setIsLoggedInUserID] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [emailAdd, setEmailAdd] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [attributes, setAttributes] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [thumbnailImg, setThumbnailImg] = useState(() => "");
  const [thumbnailImgObj, setThumbnailImgObj] = useState(() => null);
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [orgsData, setOrgsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  //validation States
  const [isValidCompanyName, setIsValidCompanyName] = useState(true);
  const [isValidAttributes, setIsValidAttributes] = useState(true);
  const [isValidWebUrl, setIsValidWebUrl] = useState(true);
  const [isValidEmailAdd, setIsValidEmailAdd] = useState(true);
  const [isValidPhoneNum, setIsValidPhoneNum] = useState(true);
  const [isValidThumbnail, setIsValidThumbnail] = useState(true);
  const [isValidShortDesc, setIsValidShortDesc] = useState(true);
  const [isValidLongDesc, setIsValidLongDesc] = useState(true);
  const [isValidOrganization, setIsValidOrganization] = useState(true);
  const [isValidCategory, setIsValidCategory] = useState(true);

  //error messages
  const [companyNameErrMsg, setCompanyNameErrMsg] = useState("");
  const [emailErrMsg, setEmailErrMsg] = useState("");
  const [phoneErrMsg, setPhoneErrMsg] = useState("");
  const [attributesErrMsg, setAttributesErrMsg] = useState("");
  const [webUrlErrMsg, setWebUrlErrMsg] = useState("");
  const [imgErrMsg, setImgErrMsg] = useState("");
  const [shortDescErrMsg, setShortDescErrMsg] = useState("");
  const [longDescErrMsg, setLongDescErrMsg] = useState("");
  const [orgErrMsg, setOrgErrMsg] = useState("");
  const [categoryErrMsg, setCategoryErrMsg] = useState("");

  const [loading, setLoading] = useState(false);
  // form refs
  const companyNameRef = useRef(null);
  const attributesRef = useRef(null);
  const webUrlRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumRef = useRef(null);
  const thumbnailRef = useRef(null);
  const shortDescRef = useRef(null);
  const longDescRef = useRef(null);
  const orgRef = useRef(null);
  const categoryRef = useRef(null);

  function thumbnailHandler(evt) {
    const image = evt.target.files[0];

    if (image) {
      var pattern = /image-*/;

      if (!image.type.match(pattern)) {
        setIsValidThumbnail(false);
        setImgErrMsg(INVALID_IMAGE);
        return;
      }
      setThumbnailImgObj(image);
      const src = URL.createObjectURL(image);
      setThumbnailImg(src);
      setIsValidThumbnail(true);
      setImgErrMsg("");
    }
  }

  const validateForm = () => {
    let isValid = true;

    setIsValidCompanyName(true);
    setIsValidEmailAdd(true);
    setIsValidPhoneNum(true);
    setIsValidWebUrl(true);
    setIsValidAttributes(true);
    setIsValidThumbnail(true);
    setIsValidShortDesc(true);
    setIsValidLongDesc(true);
    setIsValidOrganization(true);
    setIsValidCategory(true);

    if (_.isEmpty(companyName)) {
      companyNameRef.current.focus();
      setIsValidCompanyName(false);
      setCompanyNameErrMsg(REQUIRED_NAME);
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
      setPhoneErrMsg(INVALID_PHONE_NUM);
      isValid = false;
    }
    if (_.isEmpty(webUrl)) {
      webUrlRef.current.focus();
      setIsValidWebUrl(false);
      setWebUrlErrMsg(REQUIRED_URL);
      isValid = false;
    }
    if (_.isEmpty(attributes)) {
      attributesRef.current.focus();
      setIsValidAttributes(false);
      setAttributesErrMsg(REQUIRED_ATTRS);
      isValid = false;
    }
    if (_.isEmpty(shortDesc)) {
      setIsValidShortDesc(false);
      setShortDescErrMsg(REQUIRED_SHORT_DESC);
      isValid = false;
    } else if (shortDesc.length < 150) {
      setIsValidShortDesc(false);
      setShortDescErrMsg(REQUIRED_SHORT_DESC_MIN_LENGTH);
      isValid = false;
    } else if (shortDesc.length > 250) {
      setIsValidShortDesc(false);
      setShortDescErrMsg(REQUIRED_SHORT_DESC_MAX_LENGTH);
      isValid = false;
    }
    if (_.isEmpty(longDesc)) {
      setIsValidLongDesc(false);
      setLongDescErrMsg(REQUIRED_LONG_DESC);
      isValid = false;
    }
    if (_.isEmpty(orgsData)) {
      orgRef.current.focus();
      setIsValidOrganization(false);
      setOrgErrMsg(REQUIRED_ORGANIZATION);
      isValid = false;
    }
    if (_.isEmpty(categoryData)) {
      categoryRef.current.focus();
      setIsValidCategory(false);
      setCategoryErrMsg(REQUIRED_CATEGORY);
      isValid = false;
    }

    return isValid;
  };

  const createUpdateDirectory = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);

      let attsIntoArr;
      if (!_.isEmpty(attributes)) {
        attsIntoArr = attributes?.split(",");
      }
      let payload = {
        entity_type: "services",
        company_name: companyName,
        contact_email: emailAdd,
        contact_phone: phoneNum,
        logo: "",
        website: webUrl,
        attrs: attsIntoArr,
        category: categoryData.id,
        company_id: orgsData.id,
        short_description: shortDesc,
        long_description: longDesc,
        user_id: loggedInUserID,
      };

      const body = new FormData();
      body.append("image", thumbnailImgObj);
      if (thumbnailImgObj) {
        const response = await supabase_admin_secret.storage
          .from("items")
          .upload(
            `upload/${Math.random() + "_" + thumbnailImgObj.name}`,
            thumbnailImgObj,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
        if (response.data) {
          if (thumbnailImg) {
            payload.logo = `${UPLOAD_BASE_URL}/${response.data.Key}`;
          } else {
            payload.logo = null;
          }
        }
      } else {
        payload.logo = isEditData?.logo;
      }

      let createUpdateServiceURL;
      if (isEditData) {
        createUpdateServiceURL = `${BASE_URL}/api/items/update`;
        payload.id = isEditData?.id;
      } else {
        createUpdateServiceURL = `${BASE_URL}/api/items/create`;
      }

      fetch(createUpdateServiceURL, {
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
            setTimeout(() => {
              router.push(ROUTES.ITEMS);
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
    if (isLoggedInIndication()) {
      let LoggedInUserData = async () => {
        let getUser = await getLoggedInUser();
        if (!_.isNull(getUser)) {
          let parsedUser = JSON.parse(getUser);
          setIsLoggedInUserID(parsedUser?.id);
        }
      };

      LoggedInUserData();
    }
  }, []);

  useEffect(() => {
    /* 	cities API call from supabase */
    const formDropdownValuesFunc = async () => {
      if (loggedInUserID) {
        let payload = {
          entity_type: "services",
          user_id: loggedInUserID,
        };
        fetch(`${BASE_URL}/api/items/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then((response) => {
            if (response?.status === true) {
              /* categories data */
              const categoryName = _.filter(
                response?.data?.category,
                (item) => {
                  return item?.id;
                }
              );
              setCategories(categoryName);
              setCategoriesList(response?.data?.categoryList)

              /* organizations data */
              const organizationName = _.filter(
                response?.data?.organizations,
                (item) => {
                  return item?.name;
                }
              );
              setOrganizations(organizationName);
            }
          });
      }
    };
    formDropdownValuesFunc();
  }, [loggedInUserID]);

  useEffect(() => {
    if (!_.isNull(isEditData)) {
      setCompanyName(isEditData?.company_name);
      setWebUrl(isEditData?.website);
      setEmailAdd(isEditData?.contact_email);
      setThumbnailImg(isEditData?.logo);
      setPhoneNum(isEditData?.contact_phone);
      setOrgsData(isEditData?.organization_data);
      setCategoryData(isEditData?.directory_frontend_categories);
      setShortDesc(isEditData?.short_description);
      setLongDesc(isEditData?.long_description);
      setAttributes(isEditData?.attrs?.join(","));

      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [isEditData]);

  return (
    <form onSubmit={createUpdateDirectory} className={"mt-8 px-5"}>
      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
        <div className={"flex flex-col gap-2 my-2"}>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Thumbnail
          </label>
          <div className="containers">
            <div className="imageWrapper">
              <img className="image" id="img" src={thumbnailImg} />
            </div>
            <div className="file-upload">
              <input
                id="fileInput"
                type="file"
                fullWidth
                className={"file-input"}
                onChange={thumbnailHandler}
                ref={thumbnailRef}
                accept="image/png, image/gif, image/jpeg, image/jpg"
              />
              <img
                src={"/choose-img.png"}
                alt="choose-img"
                className="choose-img"
              />
              <img
                onClick={() => {
                  setThumbnailImg("");
                  setThumbnailImgObj(null);
                }}
                src={"/close.png"}
                alt="remove"
                className="remove-img"
              />
            </div>
          </div>

          {!isValidThumbnail ? (
            <span className={"text-sm text-red-500"}>{imgErrMsg}</span>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* organizations input field */}
      <div className="flex flex-col gap-2 my-2 flex-1">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Organization *
        </label>
        <ListBoxComponents
          valueKey={orgsData}
          valueSetter={setOrgsData}
          optionsList={organizations}
          type={"organization"}
          isRef={true}
          refType={orgRef}
          isDisable={isEditData ? true : false}
        />
        {!isValidOrganization ? (
          <span className={"text-sm text-red-500"}>{orgErrMsg}</span>
        ) : (
          ""
        )}
      </div>

      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
        {/* CompanyName input field */}
        <div className="flex flex-col gap-2 my-2 flex-1">
          <label
            for="company_name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Company Name *
          </label>
          <input
            type="text"
            id="company_name"
            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Type Here"
            onChange={(e) =>
              setCompanyName(e.target.value, setIsValidCompanyName(true))
            }
            value={companyName}
            ref={companyNameRef}
            maxLength={100}
          />
          {!isValidCompanyName ? (
            <span className={"text-sm text-red-500"}>{companyNameErrMsg}</span>
          ) : (
            ""
          )}
        </div>
        {/* Web Url input field */}
        <div className="flex flex-col gap-2 my-2 flex-1">
          <label
            for="website_url"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Website *{" "}
          </label>
          <input
            type="url"
            id="website_url"
            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Type Here"
            onChange={(e) => setWebUrl(e.target.value, setIsValidWebUrl(true))}
            value={webUrl}
            ref={webUrlRef}
          />
          {!isValidWebUrl ? (
            <span className={"text-sm text-red-500"}>{webUrlErrMsg}</span>
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
              "block mb-2 text-sm font-normal text-gray-900 dark:text-gray-300"
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
            className="block mb-2 text-sm font-normal text-gray-900 dark:text-gray-300"
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
            <span className={"text-sm text-red-500"}>{phoneErrMsg}</span>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
        {/* attributes input field */}
        <div className="flex flex-col gap-2 my-2 flex-1">
          <label
            for="attrs"
            className={
              "block mb-2 text-sm font-normal text-gray-900 dark:text-gray-300"
            }
          >
            Attributes *
          </label>
          <input
            type={"text"}
            id="attrs"
            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Type Here"
            onChange={(e) =>
              setAttributes(e.target.value, setIsValidAttributes(true))
            }
            value={attributes}
            ref={attributesRef}
          />
          {!isValidAttributes ? (
            <span className={"text-sm text-red-500"}>{attributesErrMsg}</span>
          ) : (
            ""
          )}
        </div>

        {/* categories input field */}
        <div className="flex flex-col gap-2 my-2 flex-1">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Categories *
          </label>

          <ListBoxComponents
            valueKey={categoryData}
            valueSetter={setCategoryData}
            optionsList={categoriesList}
            type={"service_category"}
            isRef={true}
            refType={categoryRef}
          />

          {!isValidCategory ? (
            <span className={"text-sm text-red-500"}>{categoryErrMsg}</span>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* short description input field */}
      <div className="flex flex-col gap-2 my-2 flex-1">
        <label
          for="short_desc"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Short Description *{" "}
        </label>
        <input
          type="text"
          id="short_desc"
          className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Type Here"
          onChange={(e) =>
            setShortDesc(e.target.value, setIsValidShortDesc(true))
          }
          value={shortDesc}
          ref={shortDescRef}
        />
        {!isValidShortDesc ? (
          <span className={"text-sm text-red-500"}>{shortDescErrMsg}</span>
        ) : (
          ""
        )}
      </div>

      {/* long description input field */}
      <div className="flex flex-col gap-2 my-2 flex-1">
        <CustomEditor
          label={"Long Description *"}
          forAttr={"long_desc"}
          ref={longDescRef}
          value={longDesc}
          setValue={setLongDesc}
          isValidValue={isValidLongDesc}
          valueErrMsg={longDescErrMsg}
        />
      </div>

      <div className="flex items-stretch justify-end gap:2 md:gap-6 flex-col md:flex-row mt-4">
        <button
          type="submit"
          disabled={loading ? true : false}
          className={`${
            loading ? "cursor-not-allowed" : "cursor-pointer"
          } inline-flex justify-center items-center px-8 xl:px-12 py-3 border rounded-xl border-blue-600 shadow-sm text-sm font-medium w-auto h-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700`}
        >
          {loading ? <BeatLoader color="#fff" sizeunit={"px"} size={8} /> : ""}
          {loading ? "" : isEditData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
