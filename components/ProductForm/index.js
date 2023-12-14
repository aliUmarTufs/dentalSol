import { Switch } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/solid";
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
  REQUIRED_SHORT_DESC_MIN_LENGTH,
  REQUIRED_SHORT_DESC_MAX_LENGTH,
} from "../../constants";
import { supabase, supabase_admin_secret } from "../../lib/supabaseClient";
import AlertBox from "../AlertBox";
import { ComboBoxComponent } from "../ComboBoxComponent";
import { ListBoxComponents } from "../ListBoxComponents";

const CustomEditor = dynamic(() => import("../CustomJoditEditor"), {
  ssr: false,
});

export default function ProductForm({ isEditData, loggedinUser }) {
  const router = useRouter();

  const [isEdited, setIsEdited] = useState(null);
  const [loggedInUserID, setIsLoggedInUserID] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnailImg, setThumbnailImg] = useState(() => "");
  const [thumbnailImgObj, setThumbnailImgObj] = useState(() => null);
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [isBuyable, setIsBuyable] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [orgsData, setOrgsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  //validation States
  const [isValidTitle, setIsValidTitle] = useState(true);
  const [isValidPrice, setIsValidPrice] = useState(true);
  const [isValidThumbnail, setIsValidThumbnail] = useState(true);
  const [isValidShortDesc, setIsValidShortDesc] = useState(true);
  const [isValidLongDesc, setIsValidLongDesc] = useState(true);
  const [isValidOrganization, setIsValidOrganization] = useState(true);
  const [isValidCategory, setIsValidCategory] = useState(true);

  //error messages
  const [titleErrMsg, setTitleErrMsg] = useState("");
  const [priceErrMsg, setPriceErrMsg] = useState("");
  const [imgErrMsg, setImgErrMsg] = useState("");
  const [shortDescErrMsg, setShortDescErrMsg] = useState("");
  const [longDescErrMsg, setLongDescErrMsg] = useState("");
  const [orgErrMsg, setOrgErrMsg] = useState("");
  const [categoryErrMsg, setCategoryErrMsg] = useState("");

  const [loading, setLoading] = useState(false);
  // form refs
  const titleRef = useRef(null);
  const priceRef = useRef(null);
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

    setIsValidTitle(true);
    setIsValidPrice(true);
    setIsValidThumbnail(true);
    setIsValidShortDesc(true);
    setIsValidLongDesc(true);
    setIsValidOrganization(true);
    setIsValidCategory(true);

    if (_.isEmpty(title)) {
      titleRef.current.focus();
      setIsValidTitle(false);
      setTitleErrMsg(REQUIRED_TITLE);
      isValid = false;
    }
    if (_.isEmpty(price)) {
      priceRef.current.focus();
      setIsValidPrice(false);
      setPriceErrMsg(REQUIRED_PRICE);
      isValid = false;
    } else if (price <= 0) {
      setIsValidPrice(false);
      setPriceErrMsg(INVALID_PRICE);
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

  const createUpdateProduct = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);

      let payload = {
        entity_type: "products",
        name: title,
        thumbnail: "",
        price: price,
        category: categoryData.id,
        organization: orgsData.id,
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
          payload.thumbnail = `${UPLOAD_BASE_URL}/${response.data.Key}`;
        }
      } else {
        if (thumbnailImg) {
          payload.thumbnail = isEditData?.thumbnail;
        } else {
          payload.thumbnail = null;
        }
      }

      let createUpdateProductsURL;
      if (isEditData) {
        createUpdateProductsURL = `${BASE_URL}/api/items/update`;
        payload.id = isEditData?.id;
      } else {
        createUpdateProductsURL = `${BASE_URL}/api/items/create`;
      }

      fetch(createUpdateProductsURL, {
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
          setLoggedInUser(parsedUser);
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
          entity_type: "products",
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

              setCategoriesList(response?.data?.categoryList);

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
      setTitle(isEditData?.name);
      setPrice(String(isEditData?.price));
      setOrgsData(isEditData?.organization_data);
      setCategoryData(isEditData?.product_category);
      setShortDesc(isEditData?.short_description);
      setLongDesc(isEditData?.long_description);
      setThumbnailImg(isEditData?.thumbnail);

      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [isEditData]);

  return (
    <>
      {loggedInUser?.account_setup !== 1 ? (
        <div className="px-5">
          <AlertBox
            type={"info"}
            text="Vendor should be registered from stripe before creating products."
          />
        </div>
      ) : (
        ""
      )}
      <form className={"mt-8 px-5"}>
        <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
          <div className={"flex flex-col gap-2 my-2"}>
            <label
              for="thumbnail"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
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

        <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
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
              isDisable={isEditData ? true : false}
            />
            {!isValidOrganization ? (
              <span className={"text-sm text-red-500"}>{orgErrMsg}</span>
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
              type={"product_category"}
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
          {/* price input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            <label
              for="price"
              className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white relative"
            >
              Price *{" "}
              <span className="group px-2">
                <InformationCircleIcon className="w-4 h-4" />{" "}
                <span className="group-hover:opacity-100 z-50 transition-opacity bg-gray-600 p-2 text-xs text-gray-100 rounded-md absolute -top-7 left-auto opacity-0 m-4 m-auto">
                  {loggedInUser?.account_setup === 1
                    ? "5% amount of percentage will be deduct from transaction"
                    : "You should first register with stripe account"}
                </span>
              </span>{" "}
            </label>
            <input
              type="number"
              id="price"
              className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type Here"
              onChange={(e) => setPrice(e.target.value, setIsValidPrice(true))}
              value={price}
              ref={priceRef}
            />
            {!isValidPrice ? (
              <span className={"text-sm text-red-500"}>{priceErrMsg}</span>
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
            type="button"
            onClick={
              loggedInUser?.account_setup === 1
                ? createUpdateProduct
                : undefined
            }
            disabled={
              loggedInUser?.account_setup !== 1 || loading ? true : false
            }
            className={`${
              loggedInUser?.account_setup !== 1 || loading
                ? "cursor-not-allowed"
                : "cursor-pointer"
            } inline-flex justify-center items-center px-8 xl:px-12 py-3 border rounded-xl border-blue-600 shadow-sm text-sm font-medium w-auto h-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700`}
          >
            {loading ? (
              <BeatLoader color="#fff" sizeunit={"px"} size={8} />
            ) : (
              ""
            )}
            {loading ? "" : isEditData ? "Update" : " Create"}
          </button>
        </div>
      </form>
    </>
  );
}
