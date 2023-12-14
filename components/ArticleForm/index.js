import { Switch } from "@headlessui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
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
  REQUIRED_CATEGORY_FILTER,
  REQUIRED_SHORT_DESC_MAX_LENGTH,
  REQUIRED_SHORT_DESC_MIN_LENGTH,
} from "../../constants";
import { supabase, supabase_admin_secret } from "../../lib/supabaseClient";
import { ComboBoxComponent } from "../ComboBoxComponent";
import { ListBoxComponents } from "../ListBoxComponents";

import _ from "lodash";

const CustomEditor = dynamic(() => import("../CustomJoditEditor"), {
  ssr: false,
});

export default function ArticleForm({ isEditData, loggedinUser }) {
  const router = useRouter();

  const [isEdited, setIsEdited] = useState(null);
  const [loggedInUserID, setIsLoggedInUserID] = useState(null);
  const [title, setTitle] = useState("");
  const [thumbnailImg, setThumbnailImg] = useState(() => "");
  const [thumbnailImgObj, setThumbnailImgObj] = useState(() => null);
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [orgsData, setOrgsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [categoryFilterData, setCategoryFilterData] = useState([]);

  //validation States
  const [isValidTitle, setIsValidTitle] = useState(true);
  const [isValidThumbnail, setIsValidThumbnail] = useState(true);
  const [isValidShortDesc, setIsValidShortDesc] = useState(true);
  const [isValidLongDesc, setIsValidLongDesc] = useState(true);
  const [isValidOrganization, setIsValidOrganization] = useState(true);
  const [isValidCategory, setIsValidCategory] = useState(true);
  const [isValidCategoryFilter, setIsValidCategoryFilter] = useState(true);

  //error messages
  const [titleErrMsg, setTitleErrMsg] = useState("");
  const [imgErrMsg, setImgErrMsg] = useState("");
  const [shortDescErrMsg, setShortDescErrMsg] = useState("");
  const [longDescErrMsg, setLongDescErrMsg] = useState("");
  const [orgErrMsg, setOrgErrMsg] = useState("");
  const [categoryErrMsg, setCategoryErrMsg] = useState("");
  const [categoryFilterErrMsg, setCategoryFilterErrMsg] = useState("");

  const [loading, setLoading] = useState(false);
  // form refs
  const titleRef = useRef(null);
  const thumbnailRef = useRef(null);
  const shortDescRef = useRef(null);
  const longDescRef = useRef(null);
  const orgRef = useRef(null);
  const categoryRef = useRef(null);
  const categoryFilterRef = useRef(null);

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

    setIsValidTitle(true);
    setIsValidThumbnail(true);
    setIsValidShortDesc(true);
    setIsValidLongDesc(true);
    setIsValidOrganization(true);
    setIsValidCategory(true);
    setIsValidCategoryFilter(true);

    if (_.isEmpty(title)) {
      titleRef.current.focus();
      setIsValidTitle(false);
      setTitleErrMsg(REQUIRED_TITLE);
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
    if (_.isEmpty(categoryFilterData)) {
      categoryFilterRef.current.focus();
      setIsValidCategoryFilter(false);
      setCategoryFilterErrMsg(REQUIRED_CATEGORY_FILTER);
      isValid = false;
    }

    return isValid;
  };

  const createUpdateProduct = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);

      let payload = {
        entity_type: "articles",
        user_id: loggedInUserID,
        title: title,
        thumbnail: "",
        category_id: categoryData.id,
        category_filter_id: categoryFilterData.id,
        organization_id: orgsData.id,
        description: shortDesc,
        article_body: longDesc,
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
          payload.thumbnail = `${UPLOAD_BASE_URL}/${response.data.Key}`;
        }
      } else {
        if (thumbnailImg) {
          payload.thumbnail = isEditData?.thumbnail;
        } else {
          payload.thumbnail = null;
        }
      }

      let createUpdateArticleURL;
      if (isEditData) {
        createUpdateArticleURL = `${BASE_URL}/api/items/update`;
        payload.id = isEditData?.id;
      } else {
        createUpdateArticleURL = `${BASE_URL}/api/items/create`;
      }

      fetch(createUpdateArticleURL, {
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
          entity_type: "articles",
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
                  return item?.label;
                }
              );
              setCategories(categoryName);
              setCategoriesList(response?.data?.categoryList);

              /* organizations data */
              const organizationName = _.filter(
                response?.data?.organizations,
                (item) => {
                  return item?.name;
                }
              );
              setOrganizations(organizationName);

              /* category filters data */
              const categoryFilterName = _.filter(
                response?.data?.filters,
                (item) => {
                  return item?.filter_name;
                }
              );
              setCategoryFilters(categoryFilterName);
            }
          });
      }
    };
    formDropdownValuesFunc();
  }, [loggedInUserID]);

  useEffect(() => {
    if (!_.isNull(isEditData)) {
      setTitle(isEditData?.title);
      setOrgsData(isEditData?.organization_data);
      setCategoryData(isEditData?.category_data);
      setCategoryFilterData(isEditData?.category_filter_data);
      setShortDesc(isEditData?.description);
      setLongDesc(isEditData?.article_body);
      setThumbnailImg(isEditData?.hero_image);
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [isEditData]);

  return (
    <form onSubmit={createUpdateProduct} className={"mt-8 px-5"}>
      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
        <div className={"flex flex-col gap-2 my-2"}>
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
      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
        {/* title input field */}
        <div className="flex flex-col gap-2 my-2 flex-1">
          <label
            for="title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Type Here"
            onChange={(e) => setTitle(e.target.value, setIsValidTitle(true))}
            value={title}
            ref={titleRef}
            maxLength={100}
          />
          {!isValidTitle ? (
            <span className={"text-sm text-red-500"}>{titleErrMsg}</span>
          ) : (
            ""
          )}
        </div>

        {/* organization input field */}
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
            isDisable={
              isEditData
                ? isEditData?.organization_data
                  ? true
                  : false
                : false
            }
          />
          {!isValidOrganization ? (
            <span className={"text-sm text-red-500"}>{orgErrMsg}</span>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
        {/* categories input field */}
        <div className="flex flex-col gap-2 my-2 flex-1">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Categories *
          </label>

          <ListBoxComponents
            valueKey={categoryData}
            valueSetter={setCategoryData}
            optionsList={categoriesList}
            type={"article_category"}
            isRef={true}
            refType={categoryRef}
          />

          {!isValidCategory ? (
            <span className={"text-sm text-red-500"}>{categoryErrMsg}</span>
          ) : (
            ""
          )}
        </div>

        {/* categories filter input field */}
        <div className="flex flex-col gap-2 my-2 flex-1">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Categories Filters *
          </label>

          <ListBoxComponents
            valueKey={categoryFilterData}
            valueSetter={setCategoryFilterData}
            optionsList={categoryFilters}
            type={"article_category_filter"}
            isRef={true}
            refType={categoryFilterRef}
          />

          {!isValidCategoryFilter ? (
            <span className={"text-sm text-red-500"}>
              {categoryFilterErrMsg}
            </span>
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
          {loading ? "" : isEditData ? "Update" : " Create"}
        </button>
      </div>
    </form>
  );
}
