import { Navbar, CustomButton, HeadMeta } from "../../../components";
import { useEffect, useState } from "react";
import {
  BASE_URL,
  getLoggedInUser,
  isLoggedInIndication,
  ROUTES,
} from "../../../constants";
import _ from "lodash";
import { useRouter } from "next/router";
import { BeatLoader } from "react-spinners";
import {
  CheckCircleIcon,
  PencilAltIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import Link from "next/link";

export default function Organizations() {
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(null);
  const [userOrganizations, SetUserOrganizations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isOffset, setIsOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [makeDisable, setMakeDisable] = useState(false);

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
  }, []);

  let getOrganizations = async () => {
    if (loggedinUser?.id) {
      setMakeDisable(true);

      let userOrganization = await fetch(
        `${BASE_URL}/api/organization/get?user_id=${loggedinUser?.id}&offset=${isOffset}`
      )
        .then((res) => res.json())
        .then((response) => {
          if (response.status == true) {
            SetUserOrganizations((prevState) => [
              ...prevState,
              ...response.data,
            ]);
            setIsOffset(response.offset);
            setTotalCount(response.totalcount);
            setLoading(false);
            setMakeDisable(false);
          }
        });
    }
  };

  useEffect(() => {
    getOrganizations();
  }, [loggedinUser]);

  return (
    <>
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
        <div>
          <Navbar isDashboard={true} />
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-2 mb-8 md:mb-6 lg:mb-10 mt-44">
              <div className="flex flex-col-reverse sm:flex-row items-stretch gap-6 sm:gap-0 sm:items-center justify-between my-3 sm:my-5">
                <h2 className="text-2xl font-semibold capitalize font-inter">
                  Organizations
                </h2>
                <div className="ml-auto sm:ml-0">
                  {loggedinUser?.role_type === "Vendor" ? (
                    <CustomButton
                      redirectURL={ROUTES.DASHBOARD_ORGANIZATIONS_ADD}
                      isPrimary={true}
                      btnText={"Create Organizations"}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div
                className={`overflow-x-auto ${
                  _.size(userOrganizations) >= 8 ? "tableHeight" : ""
                } relative md:shadow-md sm:rounded-lg md:border md:border-gray-200`}
              >
                <table className="w-full text-sm text-left tableWrapperStyle">
                  <thead className="text-sm md:text-base font-medium text-white capitalize bg-blue-600 font-inter">
                    <tr>
                      <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                        Name
                      </th>
                      {loggedinUser?.role_type == "Admin" ? (
                        <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                          Vendor
                        </th>
                      ) : (
                        ""
                      )}
                      <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                        Provider Type
                      </th>
                      <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                        Balance
                      </th>
                      <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                        Credits Used
                      </th>
                      {loggedinUser?.role_type === "Vendor" ? (
                        <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                          Action
                        </th>
                      ) : (
                        ""
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {userOrganizations && userOrganizations?.length > 0 ? (
                      userOrganizations?.map((e) => {
                        return (
                          <tr className="mt-4 md:my-0 pt-4 md:p-0 bg-white shadow-md md:shadow-none rounded-lg md:rounded-none border md:border-0 border-gray-200 md:border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td
                              data-label={"Name"}
                              className="py-3 px-4 md:py-4 md:px-6 capitalize"
                            >
                              {e?.name}
                            </td>
                            {loggedinUser?.role_type == "Admin" ? (
                              <td
                                data-label={"Vendor"}
                                className="py-2 px-3 md:py-3 md:px-6"
                              >
                                {e?.organization_user?.user_name}
                              </td>
                            ) : (
                              ""
                            )}
                            <td
                              data-label={"Provider Type"}
                              className="py-3 px-4 md:py-4 md:px-6 capitalize"
                            >
                              {e?.organization_type === "product_provider" ||
                              e?.organization_type === "products_provider"
                                ? "Products"
                                : e?.organization_type === "course_provider" ||
                                  e?.organization_type === "courses_provider"
                                ? "Courses"
                                : e?.organization_type === "service_provider" ||
                                  e?.organization_type === "services_provider"
                                ? "Services"
                                : "N/A"}
                            </td>
                            <td
                              data-label={"Balance:"}
                              className="py-3 px-4 md:py-4 md:px-6 capitalize"
                            >
                              {e?.balance ?? "N/A"}
                            </td>
                            <td
                              data-label={"Credits Used:"}
                              className="py-3 px-4 md:py-4 md:px-6 capitalize"
                            >
                              {e?.credits_used === true ? (
                                <CheckCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-blue-600 m-0" />
                              ) : (
                                <XCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-red-600 m-0" />
                              )}
                            </td>
                            {loggedinUser?.role_type === "Vendor" ? (
                              <Link
                                href={`${ROUTES.DASHBOARD_ORGANIZATIONS_ADD}#edit/${e?.id}`}
                              >
                                <td
                                  data-label={""}
                                  className="py-3 px-4 md:py-4 md:px-6 capitalize"
                                >
                                  <PencilAltIcon className="w-8 h-8 md:w-6 md:h-6 cursor-pointer text-blue-600 hover:text-blue-800 m-0" />
                                </td>
                              </Link>
                            ) : (
                              ""
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>

                {userOrganizations?.length > 0 ? (
                  <></>
                ) : (
                  <div className="p-6">
                    <p className="capitalize text-center text-lg font-inter">
                      no organization found
                    </p>
                  </div>
                )}
              </div>

              {!loading &&
              userOrganizations.length > 0 &&
              totalCount > isOffset ? (
                // <button className="bg-blue-600 text-white p-4" onClick={fetchDeal}>
                // 	Load More
                // </button>

                <div className="mt-10 mb-4 flex items-center justify-center">
                  <CustomButton
                    btnText={"Load More"}
                    isPrimary={true}
                    clickHandler={() => getOrganizations()}
                    isDisabled={makeDisable}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      )}
      ;
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      isProtected: true,
    },
  };
}
