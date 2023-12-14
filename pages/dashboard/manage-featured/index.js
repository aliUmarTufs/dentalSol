import { Tab } from "@headlessui/react";
import _ from "lodash";
import { ChartSquareBarIcon, CheckCircleIcon } from "@heroicons/react/solid";
import { useState, useEffect } from "react";
import { Fragment } from "react";
import cookie from "cookie";

import {
  AlertBox,
  HeadMeta,
  ManageFeaturedCardBox,
  Navbar,
} from "../../../components";
import {
  BASE_URL,
  ENTITY_TYPE_OPTIONS,
  ROUTES,
  getLoggedInUser,
  isLoggedInIndication,
} from "../../../constants";
import { ListBoxForDeal } from "../deals/add";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/router";

let FEATURED_ARR = {
  data: [
    {
      id: 1,
      title: "Physiotherapy",
      startDateTime: "Wed Apr 05 2023 11:59:23",
      slotNumber: "01",
      duration: 24,
      price: 10,
    },
  ],
};
export default function ManageFeatured({
  typeSlotsList,
  isComplete,
  user_token_info,
}) {

  const router = useRouter()

  const [entityType, setEntityType] = useState(ENTITY_TYPE_OPTIONS[0]);
  const [typeSlots, setTypeSlots] = useState(typeSlotsList);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(null);

  useEffect(() => {
    if (isLoggedInIndication()) {
      let LoggedInUserData = async () => {
        let getuser = await getLoggedInUser();
        if (!_.isNull(getuser)) {
          setLoggedinUser(JSON.parse(getuser));
          setIsLoggedInUser(true);
        }
      };

      LoggedInUserData();
    } else {
      setIsLoggedInUser(false);
      router.push(ROUTES.LOGIN);
    }
  }, []);
  useEffect(() => {
    let manageSlots = async () => {
      setLoadingStatus(true);
      await fetch(`${BASE_URL}/api/items/manage-featured`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_token_info,
          item_type: entityType?.key,
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.status == true) {
            setLoadingStatus(false);
            setTypeSlots(response?.data);
          }
        });
    };
    manageSlots();
  }, [entityType]);

  return (
    <>
      <HeadMeta
        title={"Dent247 | Dashboard | Manage Featured"}
        description="description"
        content={"Dent247 | Dashboard | Manage Featured"}
      />
      {_.isNull(isLoggedInUser) || !isLoggedInUser ? (
        <div className="my-2 flex justify-center w-full h-screen items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <div>
          <Navbar isDashboard={true} />
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-2 mb-8 md:mb-6 lg:mb-10 mt-44">
              <div className="flex flex-col sm:flex-row items-stretch gap-6 sm:gap-0 sm:items-center justify-between my-3 sm:my-5">
                <h2 className="flex-2 text-2xl font-semibold capitalize font-inter">
                  Manage Featured
                </h2>

                <div
                  className={`my-4 md:my-6 flex flex-col gap-2 my-2 mr-0 sm:ml-auto flex-1 w-full sm:w-96`}
                >
                  <ListBoxForDeal
                    valueKey={entityType}
                    valueSetter={setEntityType}
                    optionsList={ENTITY_TYPE_OPTIONS}

                    // isDisable={_.isNull(isEditData) ? false : true}
                  />
                </div>
              </div>

              <FeaturedPlanPanel
                featuredPlanArr={typeSlots}
                loadingStatus={loadingStatus}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const FeaturedPlanPanel = ({
  featuredPlanArr,
  loggedinUser,
  loadingStatus,
}) => {
  const [index, setIndex] = useState(0);
  const featuredData = featuredPlanArr?.data || featuredPlanArr;
  const expireFeaturedData = _.filter(featuredData, (items) => {
    if (items.is_expire == 1) return items;
  });
  const activeFeaturedData = _.filter(featuredData, (items) => {
    if (items.is_expire == 0) return items;
  });
  return (
    <>
      <Tab.Group selectedIndex={index} onChange={setIndex}>
        <div className="flex flex-col items-end">
          <div className="p-2 bg-bluish-400 bg-opacity-5 rounded-md my-4 md:w-96 max-sm:w-64">
            <Tab.List className="focus:outline-none">
              <div className="flex">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`flex justify-center items-center px-3 py-2 font-medium text-sm rounded-md w-1/2 ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "text-light-blue-300"
                      }`}
                    >
                      Active
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`flex justify-center items-center px-3 py-2 font-medium text-sm rounded-md w-1/2 ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "text-light-blue-300"
                      }`}
                    >
                      Expired
                    </button>
                  )}
                </Tab>
              </div>
            </Tab.List>
          </div>
        </div>
        <Tab.Panels className={"pt-0 md:pb-5 pb-2"}>
          <Tab.Panel>
            {loadingStatus ? (
              <div className="flex justify-center items-center">
                <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
              </div>
            ) : (
              <div
                className={`mt-8 ${
                  _.size(activeFeaturedData) > 0
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex"
                }`}
              >
                {_.size(activeFeaturedData) > 0 ? (
                  activeFeaturedData.map((item) => {
                    return (
                      <ManageFeaturedCardBox
                        planStatus={"active"}
                        featuredPlanObj={item}
                      />
                    );
                  })
                ) : (
                  <AlertBox type={"info"} text="No Listing Found." />
                )}
              </div>
            )}
          </Tab.Panel>
          <Tab.Panel>
            {loadingStatus ? (
              <div className="flex justify-center items-center">
                <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
              </div>
            ) : (
              <div
                className={`mt-8 ${
                  _.size(expireFeaturedData) > 0
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex"
                }`}
              >
                {_.size(expireFeaturedData) > 0 ? (
                  expireFeaturedData.map((item) => {
                    return (
                      <ManageFeaturedCardBox
                        planStatus={"expired"}
                        featuredPlanObj={item}
                      />
                    );
                  })
                ) : (
                  <AlertBox type={"info"} text="No Items Found." />
                )}
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export async function getServerSideProps(context) {
  let slotData = [];
  let isComplete = false;
  let user_token_info;
  const cookies = cookie.parse(context?.req?.headers?.cookie);
  if (cookies?.user_token) {
    user_token_info = cookies?.user_token;
    const res = await fetch(`${BASE_URL}/api/items/manage-featured`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: cookies?.user_token,
        item_type: "courses",
      }),
    });
    const data = await res.json();
    if (data?.status === true) {
      slotData = data?.data;
      isComplete = true;
    }
  }
  return {
    props: {
      typeSlotsList: { data: slotData },
      isComplete: isComplete,
      isProtected: true,
      user_token_info: user_token_info,
    },
  };
}
