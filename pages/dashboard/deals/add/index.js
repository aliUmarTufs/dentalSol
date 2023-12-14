import { useEffect, useState, Fragment } from "react";
import _ from "lodash";
import {
  Navbar,
  DiscountedDealsForm,
  FreeItemDealsForm,
  HeadMeta,
} from "../../../../components";
import {
  BASE_URL,
  COUNTRY_OPTIONS,
  DEAL_COUNTRY_OPTIONS,
  getLoggedInUser,
  REQUIRED_COUPON_CODE,
  REQUIRED_DATE,
  REQUIRED_EMAIL,
  REQUIRED_FREE_ITEM,
  REQUIRED_FREE_QUANITITY,
  REQUIRED_LOCATION,
  REQUIRED_NET_SAVINGS,
  REQUIRED_ORGANIZATION,
  REQUIRED_PASSWORD,
  REQUIRED_PRODUCT,
  REQUIRED_PRODUCT_QUANTITY,
  REQUIRED_TAG_LINE,
  ROUTES,
  Toast,
} from "../../../../constants";
import { Listbox, Tab, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  HomeIcon,
  OfficeBuildingIcon,
} from "@heroicons/react/solid";
import { Router, useRouter } from "next/router";
import { BeatLoader } from "react-spinners";

export default function DealsForm() {
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [userOrganizations, setUserOrganizations] = useState(null);
  const [hash, setHash] = useState(false);
  const [editData, setEditData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let LoggedInUserData = async () => {
      let getuser = await getLoggedInUser();
      if (!_.isNull(getuser)) {
        setLoggedinUser(JSON.parse(getuser));
        let editOption = window.location.hash.replace(/^#/, "");
        editOption = editOption.split("/");
        if (editOption?.length > 0) {
          setHash(editOption);
          // #edit/aaaa
        }
      } else {
        setLoggedinUser(false);
        router.push(ROUTES.LOGIN);
      }
    };
    LoggedInUserData();
  }, []);

  useEffect(() => {
    if (hash?.length > 0) {
      if (hash[0] == "edit") {
        let payload = {
          deal_id: hash[1],
        };
        fetch(`${BASE_URL}/api/deals/list/getone`, {
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
            }
          });
      }
    }
  }, [hash]);

  useEffect(() => {
    if (loggedinUser?.id) {
      let getDealsData = async () => {
        let url;
        if (loggedinUser?.role_type == "Admin") {
          url = `${BASE_URL}/api/deals/create/get?user_id=${loggedinUser?.id}&isAdmin=1`;
        } else {
          url = `${BASE_URL}/api/deals/create/get?user_id=${loggedinUser?.id}`;
        }
        let apidata = await fetch(url)
          .then((res) => res.json())
          .then((response) => {
            if (response.status === true) {
              setUserOrganizations(response?.data);
            } else {
              setUserOrganizations([]);
            }
          });
      };
      getDealsData();
    }
  }, [loggedinUser]);

  return (
    <>
      <HeadMeta
        title={`Dent247 | Dashboard | Deals | ${
          _.isNull(editData) ? "Add" : "Edit"
        }`}
        description="description"
        content={`Dent247 | Dashboard | Deals | ${
          _.isNull(editData) ? "Add" : "Edit"
        }`}
      />
      {(_.isNull(loggedinUser) && _.isNull(userOrganizations)) ||
      !loggedinUser ? (
        <div className="my-2 flex justify-center w-full items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <div>
          <Navbar isDashboard={true} />
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 mt-44">
              <div className="border border-gray-200 rounded-md">
                <div className="border-b-2 py-3 md:py-8 px-2 md:px-5">
                  <h1 className="text-lg md:text-2xl font-semibold font-inter">
                    {`${_.isNull(editData) ? `Create` : `Edit`} Deal`}
                  </h1>
                </div>
                <div>
                  <DealsFormPanel
                    userOrganizations={userOrganizations}
                    editData={editData}
                    loggedinUser={loggedinUser}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const DealsFormPanel = ({
  userOrganizations,
  editData,
  loggedinUser,
}) => {
  const [index, setIndex] = useState(0);
  const [disableTab, setDisableTab] = useState(false);
  useEffect(() => {
    if (!_.isNull(editData)) {
      if (editData?.deal_type == "free_item") {
        setIndex(1);
      } else {
        setIndex(0);
      }
    }
  }, [editData]);
  return (
    <>
      <Tab.Group selectedIndex={index} onChange={setIndex}>
        <div className="flex flex-col p-2 md:p-5">
          <div className="p-4 mt-6 my-0 border-transparent rounded-2xl bg-bluish-400 bg-opacity-5">
            <Tab.List className="focus:outline-none">
              <div className="flex">
                <Tab
                  as={Fragment}
                  disabled={editData?.deal_type == "free_item" ? true : false}
                >
                  {({ selected }) => (
                    <button
                      className={`h-11 flex justify-center items-center px-3 py-2 font-inter font-medium text-base rounded-md w-1/2 ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Discounted
                    </button>
                  )}
                </Tab>
                <Tab
                  as={Fragment}
                  disabled={editData?.deal_type == "discounted" ? true : false}
                >
                  {({ selected }) => (
                    <button
                      className={`h-11 flex justify-center items-center px-3 py-2 font-inter font-medium text-base rounded-md w-1/2 ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Free Item
                    </button>
                  )}
                </Tab>
              </div>
            </Tab.List>
          </div>
        </div>
        <Tab.Panels className={"p-2 pb-4 md:p-5"}>
          <Tab.Panel>
            <DiscountedDealsForm
              organizations={userOrganizations}
              isEditData={editData}
              loggedinUser={loggedinUser}
            />
          </Tab.Panel>
          <Tab.Panel>
            <FreeItemDealsForm
              organizations={userOrganizations}
              isEditData={editData}
              loggedinUser={loggedinUser}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export const ListBoxForDeal = ({
  valueKey,
  valueSetter,
  optionsList,
  type,
  isDisable = false,
}) => {
  return (
    <Listbox
      value={valueKey}
      disabled={isDisable}
      onChange={(e) => {
        valueSetter(e);
      }}
    >
      <div className="relative">
        <Listbox.Button
          // ref={countryRef}
          className={`${
            isDisable ? "cursor-not-allowed" : "cursor-pointer"
          } bg-white h-12 border border-gray-400 text-left text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
        >
          {/* <span className="block truncate">{country.title}</span> */}
          <span className="block truncate">
            {valueKey?.name ||
              valueKey?.title ||
              valueKey?.company_name ||
              valueKey?.company?.name}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
            {_.size(optionsList) > 0 ? (
              optionsList?.map((o) => {
                return (
                  <Listbox.Option
                    key={o.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`
                    }
                    value={o}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {o.name ||
                            o?.title ||
                            o?.company_name ||
                            o?.company?.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                );
              })
            ) : (
              <Listbox.Option
                className={
                  "relative cursor-default select-none py-2 pl-10 pr-4"
                }
                disabled
              >
                No List Found
              </Listbox.Option>
            )}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
export async function getStaticProps() {
  return {
    props: {
      isProtected: true,
      isVendor: true,
    },
  };
}
