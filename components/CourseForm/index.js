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
  REQUIRED_COURSE_MODE,
  INVALID_CITY,
  VIDEO_SIZE_MSG,
  VIDEO_LENGTH_MSG,
  INVALID_VIDEO,
  REQUIRED_SHORT_DESC_MAX_LENGTH,
  REQUIRED_SHORT_DESC_MIN_LENGTH,
  REQUIRED_CATEGORY_FILTER,
} from "../../constants";
import { supabase, supabase_admin_secret } from "../../lib/supabaseClient";
import { ComboBoxComponent } from "../ComboBoxComponent";
import { ListBoxComponents } from "../ListBoxComponents";
import _ from "lodash";
import AlertBox from "../AlertBox";
import { InformationCircleIcon } from "@heroicons/react/solid";
import Link from "next/link";

const CustomEditor = dynamic(() => import("../CustomJoditEditor"), {
  ssr: false,
});

export default function CourseForm({ isEditData, loggedinUser }) {
  const router = useRouter();

  const [isEdited, setIsEdited] = useState(null);
  const [loggedInUserID, setIsLoggedInUserID] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [courseDate, setCourseDate] = useState("");
  const [video, setVideo] = useState("");
  const [videoObj, setVideoObj] = useState(() => null);
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [ceData, setCeData] = useState("");
  const [providerLink, setProviderLink] = useState("");
  const [isBuyable, setIsBuyable] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [orgsData, setOrgsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const [categoryData, setCategoryData] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [categoryFilterData, setCategoryFilterData] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [teachersQuery, setTeachersQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [courseMode, setCourseMode] = useState([]);
  const [courseModeData, setCourseModeData] = useState([]);
  const [videoLength, setVideoLength] = useState();

  //validation States
  const [isValidTitle, setIsValidTitle] = useState(true);
  const [isValidPrice, setIsValidPrice] = useState(true);
  const [isValidCourseDate, setIsValidCourseDate] = useState(true);
  const [isValidVideo, setIsValidVideo] = useState(true);
  const [isValidShortDesc, setIsValidShortDesc] = useState(true);
  const [isValidLongDesc, setIsValidLongDesc] = useState(true);
  const [isValidOrganization, setIsValidOrganization] = useState(true);
  const [isValidCategory, setIsValidCategory] = useState(true);
  const [isValidCategoryFilter, setIsValidCategoryFilter] = useState(true);
  const [isValidCities, setIsValidCities] = useState(true);
  const [isValidTeacher, setIsValidTeacher] = useState(true);
  const [isValidCourseMode, setIsValidCourseMode] = useState(true);

  //error messages
  const [titleErrMsg, setTitleErrMsg] = useState("");
  const [priceErrMsg, setPriceErrMsg] = useState("");
  const [courseDateErrMsg, setCourseDateErrMsg] = useState("");
  const [videoErrMsg, setVideoErrMsg] = useState("");
  const [shortDescErrMsg, setShortDescErrMsg] = useState("");
  const [longDescErrMsg, setLongDescErrMsg] = useState("");
  const [orgErrMsg, setOrgErrMsg] = useState("");
  const [categoryErrMsg, setCategoryErrMsg] = useState("");
  const [categoryFilterErrMsg, setCategoryFilterErrMsg] = useState("");
  const [cityErrMsg, setCityErrMsg] = useState("");
  const [courseModeErrMsg, setCourseModeErrMsg] = useState("");
  const [teacherErrMsg, setTeacherErrMsg] = useState("");

  const [loading, setLoading] = useState(false);
  const [dataLoad, setDataLoad] = useState(false);
  // form refs
  const titleRef = useRef(null);
  const priceRef = useRef(null);
  const courseDateRef = useRef(null);
  const videoRef = useRef(null);
  const shortDescRef = useRef(null);
  const longDescRef = useRef(null);
  const orgRef = useRef(null);
  const categoryRef = useRef(null);
  const categoryFilterRef = useRef(null);
  const teacherRef = useRef(null);
  const citiesRef = useRef(null);
  const courseModeRef = useRef(null);

  let checkFileType = videoObj?.type?.split("/")?.shift();

  function courseVideoHandler(evt) {
    const video = evt.target.files[0];

    if (video) {
      setVideoObj(video);
      const src = URL.createObjectURL(video);
      const audio = new Audio();
      audio.src = src;
      audio.onloadedmetadata = (_) => {
        setVideoLength(parseInt(audio.duration));
      };
      audio.onerror = (ev) => {
        // setIsValidVideo(false);
      };

      setVideo(src);
      setIsValidVideo(true);
      setVideoErrMsg("");
    }
  }

  const validateForm = () => {
    let isValid = true;

    setIsValidTitle(true);
    setIsValidPrice(true);
    setIsValidCourseDate(true);
    setIsValidVideo(true);
    setIsValidShortDesc(true);
    setIsValidLongDesc(true);
    setIsValidOrganization(true);
    setIsValidCategory(true);
    setIsValidCategoryFilter(true);
    setIsValidCities(true);
    setIsValidTeacher(true);
    setIsValidCourseMode(true);

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
    if (_.isEmpty(courseDate)) {
      courseDateRef.current.focus();
      setIsValidCourseDate(false);
      setCourseDateErrMsg(REQUIRED_DATE);
      isValid = false;
    }
    if (_.isEmpty(video)) {
      videoRef.current.focus();
      setIsValidVideo(false);
      setVideoErrMsg(REQUIRED_VIDEO);
      isValid = false;
    }

    if (videoObj) {
      if (checkFileType !== "video") {
        videoRef.current.focus();
        setIsValidVideo(false);
        setVideoErrMsg(INVALID_VIDEO);
        isValid = false;
      }
      if (videoObj.size / 1000 / 1000 > 10) {
        videoRef.current.focus();
        setIsValidVideo(false);
        setVideoErrMsg(VIDEO_SIZE_MSG);
        isValid = false;
      }

      if (videoLength > 180) {
        videoRef.current.focus();
        setIsValidVideo(false);
        setVideoErrMsg(VIDEO_LENGTH_MSG);
        isValid = false;
      }
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
    if (_.isEmpty(courseModeData)) {
      courseModeRef.current.focus();
      setIsValidCourseMode(false);
      setCourseModeErrMsg(REQUIRED_COURSE_MODE);
      isValid = false;
    }
    if (_.isEmpty(orgsData)) {
      orgRef.current.focus();
      setIsValidOrganization(false);
      setOrgErrMsg(REQUIRED_ORGANIZATION);
      isValid = false;
    }
    if (_.isEmpty(citiesData)) {
      citiesRef.current.focus();
      setIsValidCities(false);
      setCityErrMsg(INVALID_CITY);
      isValid = false;
    }
    if (_.isEmpty(teachersData)) {
      teacherRef.current.focus();
      setIsValidTeacher(false);
      setTeacherErrMsg(REQUIRED_TEACHER);
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

  const createUpdateCourse = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);

      let payload = {
        entity_type: "courses",
        title: title,
        video: video,
        Price: price,
        provider_link: providerLink,
        CE: ceData,
        date: courseDate,
        buyable: isBuyable,
        city: citiesData.id,
        category: categoryData.id,
        category_filters: categoryFilterData.name,
        organization: orgsData.id,
        course_mode: courseModeData.id,
        short_description: shortDesc,
        long_description: longDesc,
        teachers: _.map(teachersData, "id"),
        user_id: loggedInUserID,
      };

      const body = new FormData();
      body.append("image", videoObj);
      if (videoObj) {
        const response = await supabase_admin_secret.storage
          .from("courses-videos")
          .upload(`upload/${Math.random() + "_" + videoObj.name}`, videoObj, {
            cacheControl: "3600",
            upsert: false,
          });
        if (response.data) {
          payload.video = `${UPLOAD_BASE_URL}/${response.data.Key}`;
        }
      }
      let createUpdateCourseURL;
      if (isEditData) {
        createUpdateCourseURL = `${BASE_URL}/api/items/update`;
        payload.id = isEditData?.id;
      } else {
        createUpdateCourseURL = `${BASE_URL}/api/items/create`;
      }

      fetch(createUpdateCourseURL, {
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
    if (!_.isNull(isEditData)) {
      setTitle(isEditData?.title);
      setPrice(String(isEditData?.Price));
      setCeData(isEditData?.CE);
      setProviderLink(isEditData?.provider_link);
      setIsBuyable(isEditData?.buyable);
      setCourseDate(isEditData?.date);
      setCourseMode(isEditData?.course_mode_data);
      setOrgsData(isEditData?.organization_data);
      setCitiesData(isEditData?.cities);
      setCategoryData(isEditData?.course_categories);
      setCategoryFilterData(isEditData?.category_filters);
      setShortDesc(isEditData?.short_description);
      setLongDesc(isEditData?.long_description);
      setVideo(isEditData?.video);
      setCourseModeData(isEditData?.mode);
      // setTeachersData(isEditData?.teachers_data);
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [isEditData]);

  console.log({ isEditData });

  useEffect(() => {
    /* 	cities API call from supabase */
    const formDropdownValuesFunc = async () => {
      if (loggedInUserID) {
        let payload = {
          entity_type: "courses",
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
              console.log({ response });
              /* city data */
              const citiesName = _.filter(response?.data?.city, (item) => {
                return item?.name;
              });
              setCities(citiesName);

              /* categories data */
              const categoryName = _.filter(
                response?.data?.category,
                (item) => {
                  return item?.id;
                }
              );
              setCategories(categoryName);
              setCategoriesList(response?.data?.categoryList);

              /* category filters data */
              const categoryFilterName = _.filter(
                response?.data?.filters,
                (item) => {
                  console.log({ item });
                  return item?.name;
                }
              );
              setCategoryFilters(categoryFilterName);

              /* organizations data */
              const organizationName = _.filter(
                response?.data?.organizations,
                (item) => {
                  return item?.name;
                }
              );
              setOrganizations(organizationName);

              /* teachers data */
              const teachersName = _.filter(
                response?.data?.teachers,
                (item) => {
                  return item?.user_name;
                }
              );
              const duplicateTeachers = _.uniqBy(teachersName, "user_name");
              setTeachers(duplicateTeachers);

              let arr = [];
              const setTeachersListData = _.map(
                isEditData?.teachers_data,
                (item) => {
                  let d = _.filter(response?.data?.teachers, (i) => {
                    return i?.id == item?.id;
                  });
                  if (d?.length > 0) {
                    arr.push(d[0]);
                  }
                  return d;
                }
              );

              setTeachersData(arr);

              /* course mode data */
              const courseModeName = _.filter(
                response?.data?.course_mode,
                (item) => {
                  return item?.mode;
                }
              );
              setCourseMode(courseModeName);

              setDataLoad(true);
            }
          });
      }
    };
    formDropdownValuesFunc();
  }, [loggedInUserID]);

  const filteredTeachers =
    teachersQuery === ""
      ? teachers
      : _.filter(teachers, (item) => {
          return item.user_name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(teachersQuery.toLowerCase().replace(/\s+/g, ""));
        });

  return loggedInUser && dataLoad ? (
    <>
      {loggedInUser?.account_setup !== 1 ? (
        <div className="px-5">
          <AlertBox
            type={"info"}
            text="Vendor should be registered from stripe before creating courses."
          />
        </div>
      ) : (
        ""
      )}
      <form onSubmit={createUpdateCourse} className={"mt-8 px-5"}>
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
        <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
          {/* CE input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            <label
              for="ce"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              CE
            </label>
            <input
              type={"number"}
              id="ce"
              className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type Here"
              onChange={(e) => setCeData(e.target.value)}
              value={ceData}
            />
          </div>

          {/* providerLink input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            <label
              for="provider_link"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Provider Link
            </label>

            <input
              type={"url"}
              id="provider_link"
              className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type Here"
              onChange={(e) => setProviderLink(e.target.value)}
              value={providerLink}
            />
          </div>
        </div>
        <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
          {/* is Buyable input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Is Buyable?
            </label>
            <Switch
              checked={isBuyable}
              onChange={setIsBuyable}
              className={`${
                isBuyable ? "bg-blue-700" : "bg-gray-500"
              } relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span className="sr-only">Buyable</span>
              <span
                aria-hidden="true"
                className={`${
                  isBuyable ? "translate-x-6" : "translate-x-0"
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </div>

          {/* courseDate input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            <label
              for="course_date"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Date *
            </label>

            <input
              type="date"
              id="course_date"
              className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Type Here"
              onChange={(e) =>
                setCourseDate(e.target.value, setIsValidCourseDate(true))
              }
              value={courseDate}
              ref={courseDateRef}
            />
            {!isValidCourseDate ? (
              <span className={"text-sm text-red-500"}>{courseDateErrMsg}</span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
          {/* courseMode input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Course Mode *
            </label>

            <ListBoxComponents
              valueKey={courseModeData}
              valueSetter={setCourseModeData}
              optionsList={courseMode}
              type={"course_mode"}
              isRef={true}
              refType={courseModeRef}
            />
            {!isValidCourseMode ? (
              <span className={"text-sm text-red-500"}>{courseModeErrMsg}</span>
            ) : (
              ""
            )}
          </div>

          {/* cities input field */}
          <div className="flex flex-col gap-2 my-2 flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
              <span className={"text-sm text-red-500"}>{cityErrMsg}</span>
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
              type={"course_category"}
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
              type={"course_category_filter"}
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

        {/* teachers input field */}
        <div className="flex flex-col gap-2 my-2 flex-1">
          <label
            for="teachers"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Teachers *
          </label>

          <ComboBoxComponent
            type={"teacher"}
            valueKey={teachersData}
            valueSetter={setTeachersData}
            optionsList={filteredTeachers}
            itemQuery={teachersQuery}
            setItemQuery={setTeachersQuery}
            isRef={true}
            refType={teacherRef}
          />

          {!isValidTeacher ? (
            <span className={"text-sm text-red-500"}>{teacherErrMsg}</span>
          ) : (
            ""
          )}
        </div>

        {/* video input field */}
        <div className="flex flex-col gap-2 my-4 flex-1">
          <label
            for="video"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Video *
          </label>
          <section className="w-full h-full flex flex-col">
            <header className="relative flex flex-col text-gray-400 border border-gray-400 border-dashed rounded cursor-pointer">
              <input
                id="videoInput"
                type="file"
                fullWidth
                // className={"video-input"}
                className="absolute inset-0 z-20 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
                onChange={courseVideoHandler}
                ref={videoRef}
                accept="video/mp4,video/x-m4v,video/*"
              />
              {/* <img
							src={"/choose-img.png"}
							alt="choose-video"
							className="choose-video"
						/>
						<img
							onClick={() => {
								setVideo("");
								setVideoObj(null);
							}}
							src={"/close.png"}
							alt="remove-video"
							className="remove-video"
						/> */}
              <div class="flex flex-col items-center justify-center py-10 text-center">
                <svg
                  class="w-6 h-6 mr-1 text-current-50"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p class="m-0">Upload your video here.</p>
              </div>
            </header>

            {!_.isEmpty(video) ? (
              <div className="flex  py-2 ">
                <img
                  onClick={() => {
                    setVideo("");
                    setVideoObj(null);
                  }}
                  src={"/close.png"}
                  alt="remove-video"
                  className={`w-5 h-5 mr-2 cursor-pointer object-contain`}
                />
                <Link href={`${video}`} target="_blank">
                  <span
                    className={
                      "text-blue-600 block w-full text-sm font-semibold underline cursor-pointer"
                    }
                    style={{ wordBreak: "break-word" }}
                  >
                    {videoObj?.name ?? isEditData?.video}
                  </span>
                </Link>
              </div>
            ) : null}
          </section>
          {!isValidVideo ? (
            <span className={"text-sm text-red-500"}>{videoErrMsg}</span>
          ) : (
            ""
          )}

          <template id="file-template">
            <li class="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
              <article
                tabindex="0"
                class="group w-full h-full rounded-md focus:outline-none focus:shadow-outline elative bg-gray-100 cursor-pointer relative shadow-sm"
              >
                <img
                  alt="upload preview"
                  class="img-preview hidden w-full h-full sticky object-cover rounded-md bg-fixed"
                />

                <section class="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                  <h1 class="flex-1 group-hover:text-blue-800"></h1>
                  <div class="flex">
                    <span class="p-1 text-blue-800">
                      <i>
                        <svg
                          class="fill-current w-4 h-4 ml-auto pt-1"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                        </svg>
                      </i>
                    </span>
                    <p class="p-1 size text-xs text-gray-700"></p>
                    <button class="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800">
                      <svg
                        class="pointer-events-none fill-current w-4 h-4 ml-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          class="pointer-events-none"
                          d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                        />
                      </svg>
                    </button>
                  </div>
                </section>
              </article>
            </li>
          </template>
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

        {/* <div className="flex items-stretch justify-end gap:2 md:gap-6 flex-col md:flex-row mt-4">
          <button
            type="submit"
            disabled={loading ? true : false}
            className={`${
              loading ? "cursor-not-allowed" : "cursor-pointer"
            } inline-flex justify-center items-center px-8 xl:px-12 py-3 border rounded-xl border-blue-600 shadow-sm text-sm font-medium w-auto h-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700`}
          >
            {loading ? (
              <BeatLoader color="#fff" sizeunit={"px"} size={8} />
            ) : (
              ""
            )}
            {loading ? "" : isEditData ? " Update" : "Create"}
          </button>
        </div> */}
        <div className="flex items-stretch justify-end gap:2 md:gap-6 flex-col md:flex-row mt-4">
          <button
            type="button"
            onClick={
              loggedInUser?.account_setup === 1 ? createUpdateCourse : undefined
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
  ) : (
    <div className="my-2 flex justify-center items-center">
      <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
    </div>
  );
}
