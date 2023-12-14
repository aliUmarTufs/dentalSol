import { BeatLoader } from "react-spinners";
import _ from "lodash";
import { Fragment, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AlertBox, HeadMeta, Navbar, PricingCard } from "../../../components";
import {
  getLoggedInUser,
  isLoggedInIndication,
  ROUTES,
  BASE_URL,
  Toast,
} from "../../../constants";
import { Tab } from "@headlessui/react";
import { MainContext } from "../../../context-api/MainContext";
import { SET_USER_DATA } from "../../../context-api/action-types";

export default function Pricing({ subscriptionInfo }) {
  const [isLoggedInUser, setIsLoggedInUser] = useState(null);
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [pricingType, setPricingType] = useState("");
  const [pricingSuccess, setPricingSuccess] = useState("");
  const [isSuccessLoading, setIsSuccessLoading] = useState(false);
  const { MainState, dispatch } = useContext(MainContext);

  const router = useRouter();

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
    setPricingType(router?.query?.type);
    setPricingSuccess(router?.query?.success);
  }, []);

  useEffect(() => {
    let subscriptionDetail = localStorage.getItem("subscriptionObject");
    if (
      !_.isEmpty(pricingType) &&
      !_.isEmpty(pricingSuccess) &&
      !_.isNull(isLoggedInUser) &&
      !_.isNull(subscriptionDetail)
    ) {
      const getUpdatedUserData = async () => {
        setIsSuccessLoading(true);
        await fetch(`${BASE_URL}/api/auth/get_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loggedinUser?.user_email,
          }),
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.status == true) {
              setIsSuccessLoading(false);
              localStorage.removeItem("subscriptionObject");
              if (loggedinUser) {
                setLoggedinUser(response?.data);
                // localStorage.setItem(
                //   "userData",
                //   JSON.stringify(response?.data)
                // );
                dispatch({ type: SET_USER_DATA, userData: response?.data });
              }
              Toast.fire({
                icon: `${"success"}`,
                title: `${"You have subscribed sucessfully"}`,
              });
            }
          });
      };
      getUpdatedUserData();
    }
  }, [pricingType, pricingSuccess, router, isLoggedInUser]);

  useEffect(() => {
    if (isSuccessLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSuccessLoading]);

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
        title="Dent247 | Dashboard | Organizations"
        description="description"
        content="Dent247 | Dashboard | Organizations"
      />
      {_.isNull(isLoggedInUser) || !isLoggedInUser ? (
        <div className="my-2 flex justify-center w-full h-screen items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <div className="relative">
          <Navbar isDashboard={true} />
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-2 mb-8 md:mb-6 lg:mb-10 mt-48">
              <div className="flex flex-col gap-6 items-center justify-center my-3 sm:my-5">
                <h6 className="text-lg text-dark-bluish-500 text-center font-semibold capitalize font-inter">
                  pricing table
                </h6>

                <h2 className="text-2xl md:text-4xl text-blackish-900 text-center font-bold capitalize font-inter">
                  our pricing plan
                </h2>
              </div>

              <PricingPanel
                subscriptionDataArr={subscriptionInfo}
                loggedinUser={loggedinUser}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const PricingPanel = ({ subscriptionDataArr, loggedinUser }) => {
  const [index, setIndex] = useState(0);
  const pricingData = subscriptionDataArr?.data;
  return (
    <>
      <Tab.Group selectedIndex={index} onChange={setIndex}>
        <div className="flex flex-col p-2 md:p-5">
          <div className="p-4 mt-6 my-0 border-transparent rounded-2xl bg-bluish-400 bg-opacity-5">
            <Tab.List className="focus:outline-none">
              <div className="flex">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`h-11 flex justify-center items-center px-3 py-2 font-inter font-medium text-base rounded-md w-1/2 ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Monthly
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`h-11 flex justify-center items-center px-3 py-2 font-inter font-medium text-base rounded-md w-1/2 ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Annually
                    </button>
                  )}
                </Tab>
              </div>
            </Tab.List>
          </div>
        </div>
        <Tab.Panels className={"px-2 pt-0 md:pb-5 md:px-5 pb-2"}>
          <Tab.Panel>
            <div
              className={`mt-8 ${
                _.size(pricingData) > 0
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex"
              }`}
            >
              {_.size(pricingData) > 0 ? (
                pricingData.map((item) => {
                  return (
                    <PricingCard
                      planType={"monthly"}
                      pricingPlanObj={item}
                      loggedinUser={loggedinUser}
                    />
                  );
                })
              ) : (
                <AlertBox type={"info"} text="No Listing Found." />
              )}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div
              className={`mt-8 ${
                _.size(pricingData) > 0
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex"
              }`}
            >
              {_.size(pricingData) > 0 ? (
                pricingData.map((item) => {
                  return (
                    <PricingCard
                      planType={"annually"}
                      pricingPlanObj={item}
                      loggedinUser={loggedinUser}
                    />
                  );
                })
              ) : (
                <AlertBox type={"info"} text="No Listing Found." />
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${BASE_URL}/api/subscriptions`);
  const data = await res.json();

  // Pass data to the page via props
  return {
    props: {
      subscriptionInfo: data,
      isProtected: true,
      isVendor: true,
    },
  };
}
