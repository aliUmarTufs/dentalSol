import { useEffect, useState, Fragment } from "react";
import _ from "lodash";
import { HeadMeta, Navbar } from "../../../../components";
import {
  BASE_URL,
  getLoggedInUser,
  ORGANIZATION_TYPE_OPTIONS,
  REQUIRED_EMAIL,
  REQUIRED_ITEM_PROVIDER,
  REQUIRED_ORGANIZATION,
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
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/router";

export default function OrganizationForm() {
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
          organization_id: hash[1],
        };
        fetch(`${BASE_URL}/api/organization/getone`, {
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

  return (
    <>
      <HeadMeta
        title={`Dent247 | Dashboard | Organizations | ${
          _.isNull(editData) ? "Add" : "Edit"
        }`}
        description="description"
        content={`Dent247 | Dashboard | Organizations | ${
          _.isNull(editData) ? "Add" : "Edit"
        }`}
      />
      {_.isNull(loggedinUser) || !loggedinUser ? (
        <div className="my-2 flex justify-center w-full h-screen items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <div>
          <Navbar isDashboard={true} />
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 mt-44 border border-gray-200 rounded-md">
              <div className="border-b-2 p-3 px-5">
                <h1 className="text-2xl font-bold">
                  {`${_.isNull(editData) ? `Create` : `Edit`} Organization`}{" "}
                </h1>
              </div>
              <div className="p-5">
                <OrganizationCreation
                  userID={loggedinUser?.id}
                  isEditData={editData}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export const OrganizationCreation = ({ userID, isEditData }) => {
  const router = useRouter();
  const [organizaionType, setOrganizationType] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [webUrl, setWebUrl] = useState(null);

  const [organizationName, setCorrectOrganizationName] = useState(null);
  const [organizaionErrMsg, setOrganizationErrMsg] = useState("");

  const [validprovider, setRequiredValidProvider] = useState(null);
  const [validProviderErrMsg, setValidProviderErrMsg] = useState("");
  const [orgId, setOrgId] = useState(null);

  const [isEdited, setIsEdited] = useState(null);

  useEffect(() => {
    if (!_.isNull(isEditData)) {
      let filterOrganizationType = _.filter(
        ORGANIZATION_TYPE_OPTIONS,
        (item) => {
          return item.key == isEditData?.organization_type;
        }
      );
      if (filterOrganizationType && filterOrganizationType?.length > 0) {
        setOrganizationType(filterOrganizationType[0]);
      }

      setOrganization(isEditData?.name);
      setWebUrl(isEditData?.url);
      setOrgId(isEditData?.id);
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [isEditData]);

  const validateForm = () => {
    let isValid = true;

    setCorrectOrganizationName(true);
    setRequiredValidProvider(true);

    // required check
    if (_.isEmpty(organization)) {
      setCorrectOrganizationName(false);
      setOrganizationErrMsg(REQUIRED_ORGANIZATION);
      isValid = false;
    }

    if (_.isEmpty(organizaionType)) {
      setRequiredValidProvider(false);
      setValidProviderErrMsg(REQUIRED_ITEM_PROVIDER);
      isValid = false;
    }
    return isValid;
  };

  const createOrganization = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      // setLoading(true);
      const payload = {
        user_id: userID,
        organization_name: organization,
        organization_type: organizaionType?.key,
        url: webUrl,
      };
      if (!_.isNull(orgId)) {
        payload.org_id = orgId;
      }

      let url;
      if (_.isNull(isEditData)) {
        url = `${BASE_URL}/api/organization/create`;
      } else {
        url = `${BASE_URL}/api/organization/update`;
        payload.organization_id = isEditData?.id;
      }

      fetch(url, {
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
            if (!isEditData) {
              setOrganization("");
              setWebUrl("");
            }
            // setIsSuccess(true);
            Toast.fire({
              icon: `${"success"}`,
              title: `${data.message}`,
            });
            setTimeout(() => {
              router.push(ROUTES.DASHBOARD_ORGANIZATIONS);
            }, 5000);
          } else {
            // setIsSuccess(false);
            // setLoading(false);
            Toast.fire({
              icon: `${"error"}`,
              title: `${data.message}`,
            });
          }
          //
        });
    }
  };

  return (
    <form onSubmit={createOrganization}>
      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
        <div className="mb-3 md:mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
          <label
            for="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Organization Name
          </label>
          <input
            type="text"
            id="organizationName"
            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="XYZ Organization"
            value={organization}
            onChange={(e) => {
              setOrganization(e.target.value);
            }}
          />

          {!organizationName ? (
            <span className={"text-sm text-red-500"}>{organizaionErrMsg}</span>
          ) : (
            ""
          )}
        </div>
        <div className="mb-3 md:mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
          <label
            for="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Item
          </label>
          <ListBoxForDeal
            valueKey={organizaionType}
            valueSetter={setOrganizationType}
            optionsList={ORGANIZATION_TYPE_OPTIONS}
            isDisable={_.isNull(isEditData) ? false : true}

            // relaventState={setOrganizationID}
          />
          {!validprovider ? (
            <span className={"text-sm text-red-500"}>
              {validProviderErrMsg}
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
        <div className="mb-3 md:mb-3 md:mb-6 flex flex-col gap-2 my-2 flex-1">
          <label
            for="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Url
          </label>
          <input
            type="url"
            id="websiteUrl"
            className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Website Url"
            value={webUrl}
            onChange={(e) => {
              setWebUrl(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="flex items-stretch justify-end gap:2 md:gap-6 flex-col md:flex-row mt-4">
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isEditData && !_.isNull(isEditData) ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export const ListBoxForDeal = ({
  valueKey,
  valueSetter,
  optionsList,
  isDisable = false,
}) => {
  return (
    <Listbox
      value={valueKey}
      disabled={isDisable}
      onChange={(e) => valueSetter(e)}
    >
      <div className="relative">
        <Listbox.Button
          // ref={countryRef}
          className="relative bg-white h-12 border border-gray-400 text-left text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {/* <span className="block truncate">{country.title}</span> */}
          <span className="block truncate">
            {valueKey?.name || valueKey?.title}
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
            {optionsList?.map((o) => {
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
                        {o.name || o?.title}
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
            })}
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
    },
  };
}
