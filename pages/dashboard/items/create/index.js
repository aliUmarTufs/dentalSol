import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import _ from "lodash";
import cookie from "cookie";
import {
  ArticleForm,
  CourseForm,
  DirectoryForm,
  HeadMeta,
  Navbar,
  ProductForm,
} from "../../../../components";
import {
  BASE_URL,
  ENTITY_TYPE_OPTIONS,
  getLoggedInUser,
  isLoggedInIndication,
  ROUTES,
} from "../../../../constants";
import { BeatLoader } from "react-spinners";
import { ListBoxForDeal } from "../../deals/add";
import { useSockets } from "../../../../context/socket.context";

export default function ItemCreate({ userData, props }) {
  const router = useRouter();
  const { socket } = useSockets();

  const [loggedinUser, setLoggedinUser] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(null);
  const [entityType, setEntityType] = useState(null);
  const [hash, setHash] = useState([]);
  const [editData, setEditData] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const [entityOptionsList, setEntityOptionsList] = useState([]);

  useEffect(() => {
    if (isLoggedInIndication()) {
      let LoggedInUserData = async () => {
        let getuser = await getLoggedInUser();
        if (!_.isNull(getuser)) {
          setLoggedinUser(JSON.parse(getuser));
          setIsLoggedInUser(true);
          let editOption = window.location.hash.replace(/^#/, "");
          editOption = editOption.split("/");
          if (editOption?.length > 0 && editOption?.length == 3) {
            setHash(editOption);
            // #edit/aaaa
          }
        }
      };

      LoggedInUserData();
    } else {
      setIsLoggedInUser(false);
      router.push(ROUTES.LOGIN);
    }
  }, []);

  useEffect(() => {
    let entityOptionsArr = _.cloneDeep(ENTITY_TYPE_OPTIONS);
    let filteredEntityList = entityOptionsArr?.filter((e) => {
      return userData?.user_data?.filterService?.includes(e?.key);
    });
    if (filteredEntityList?.length > 0) {
      setEntityOptionsList(filteredEntityList);
    }
  }, [userData]);

  useEffect(() => {
    if (hash?.length > 0) {
      if (hash[0] == "edit" && hash?.length == 3) {
        let payload = {
          id: hash[1],
          entity_type: hash[2],
        };
        fetch(`${BASE_URL}/api/items/getone`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then((response) => {
            if (response?.status === true) {
              setEditData(response?.data);
              setResponseData(response);
              let filterItemType = ENTITY_TYPE_OPTIONS.filter((e) => {
                return e?.key == response?.key;
              });
              if (filterItemType?.length > 0) {
                setEntityType(filterItemType[0]);
              }
            }
          });
      }
    }
  }, [hash]);

  return (
    <>
      <HeadMeta
        title={`Dent247 | Dashboard | ${editData ? "Update" : "Create"} Item`}
        description="description"
        content={`Dent247 | Dashboard | ${editData ? "Update" : "Create"} Item`}
      />

      {_.isNull(isLoggedInUser) ? (
        <div className="my-2 flex justify-center w-full h-screen items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <>
          <Navbar isDashboard={true} />
          <div className="bg-white">
            <div className="max-w-7xl mx-auto pb-8 md:pb-6 lg:pb-10 mt-44 my-20 border border-gray-200 rounded-md">
              <div className="border-b-2 p-5">
                <h1 className="text-2xl font-bold font-inter">
                  {_.isEmpty(hash)
                    ? "Create Item"
                    : !_.isEmpty(hash) && hash[0] == "edit"
                    ? "Edit Item"
                    : ""}
                </h1>
              </div>
              {/* <div className="p-5">
								{/* <OrganizationCreation
									userID={loggedinUser?.id}
									isEditData={editData}
								/> */}

              {/* </div> */}

              <div
                className={`my-4 px-5 md:my-6 flex flex-col gap-2 my-2 flex-1 ${
                  !_.isNull(entityType) ? "border-b-2 pb-10" : ""
                }`}
              >
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Item
                </label>
                <ListBoxForDeal
                  valueKey={entityType}
                  valueSetter={setEntityType}
                  // optionsList={ENTITY_TYPE_OPTIONS}
                  optionsList={entityOptionsList}
                  isDisable={_.isNull(editData) ? false : true}
                />
              </div>

              {!_.isNull(entityType) && entityType?.title === "Course" ? (
                <CourseForm isEditData={editData} />
              ) : entityType?.title === "Product" ? (
                <ProductForm isEditData={editData} />
              ) : entityType?.title === "Service" ? (
                <DirectoryForm isEditData={editData} />
              ) : entityType?.title === "Article" ? (
                <ArticleForm isEditData={editData} />
              ) : null}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  let cookies;
  let obj = {
    user_data: null,
  };
  if (context.req.headers.cookie) {
    cookies = cookie.parse(context.req.headers.cookie);
  }

  let details;
  if (cookies?.user_token) {
    details = await fetch(`${BASE_URL}/api/items/user/service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: cookies?.user_token }),
    });

    const data = await details.json();
    if (data && data?.data) {
      obj.user_data = data?.data;
    }
  }
  return {
    props: {
      isProtected: true,
      userData: obj,
      isVendor: true,
    },
  };
}
