import { useState, useEffect } from "react";
import _ from "lodash";
import { BeatLoader } from "react-spinners";
import cookie from "cookie";
import {
  ConfirmationModal,
  CustomButton,
  HeadMeta,
  Navbar,
} from "../../../components";
import {
  BASE_URL,
  ENTITY_TYPE_OPTIONS,
  getLoggedInUser,
  isLoggedInIndication,
  ROLES_CHARACTER,
  ROUTES,
  Toast,
} from "../../../constants";
import { useRouter } from "next/router";
import {
  CheckCircleIcon,
  DotsVerticalIcon,
  PencilAltIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import { ListBoxForDeal } from "../deals/add";
import { useSockets } from "../../../context/socket.context";
import ItemDetailModal from "../../../components/ItemDetailModal";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Items({ userData }) {
  const router = useRouter();
  const { socket } = useSockets();

  const [loggedinUser, setLoggedinUser] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffset, setIsOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [makeDisable, setMakeDisable] = useState(false);
  const [entityType, setEntityType] = useState([]);
  const [prevKey, setPrevKey] = useState("");
  const [itemDetail, setItemDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);

  const [entityOptionsList, setEntityOptionsList] = useState([]);

  /* 	handler for action options */
  const openActionHandler = async (id) => {
    setIsActionOpen(true);
  };

  const clickConfirmationHandler = async (id) => {
    setDeleteItemId(id);
    setIsOpen(true);
    document.documentElement.style.overflow = `initial`;
  };
  const clickConfirmationCloseHandler = async () => {
    setIsOpen(false);
    document.documentElement.style.overflow = `initial`;
  };

  const clickDetailHandler = async (detail) => {
    setIsOpenDetail(true);
    setItemDetail(detail);
    document.documentElement.style.overflow = `initial`;
  };
  const clickDetailCloseHandler = async () => {
    setIsOpenDetail(false);
    document.documentElement.style.overflow = `initial`;
  };

  useEffect(() => {
    if (isLoggedInIndication()) {
      let LoggedInUserData = async () => {
        let getuser = await getLoggedInUser();
        if (!_.isNull(getuser)) {
          setLoggedinUser(JSON.parse(getuser));
          setIsLoggedInUser(true);
          if (router?.query?.redirect) {
            setRedirectUrl(router?.query?.redirect);
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
    console.log({ filteredEntityList, userData });
    if (filteredEntityList?.length > 0) {
      setEntityOptionsList(filteredEntityList);
      setEntityType(filteredEntityList[0]);
    }
  }, [userData]);

  useEffect(() => {
    socket.emit("editChatMsgBody", { data: { id: "name" } }, (error) => {
      if (error) {
        console.log(
          "Something went wrong please try again later. (edit message error)",
          error
        );
        throw error;
      } else {
        console.log("SEND EMIT");
      }
    });
  }, [socket]);

  let getUserItems = async () => {
    if (loggedinUser?.id) {
      setMakeDisable(true);

      let offSetValue = isOffset;

      if (prevKey !== entityType?.key) {
        offSetValue = 0;
      }

      await fetch(
        `${BASE_URL}/api/items/list?user_id=${loggedinUser?.id}&offset=${offSetValue}&entity_type=${entityType?.key}`
      )
        .then((res) => res.json())
        .then((response) => {
          if (response.status == true) {
            console.log({ response });
            setPrevKey(response?.key);
            if (prevKey == entityType?.key) {
              setUserItems((prevState) => [...prevState, ...response.data]);
            } else {
              setUserItems(response.data);
            }
            setIsOffset(response?.offset);
            setTotalCount(response?.totalCount);
            setLoading(false);
            setMakeDisable(false);
          }
        });
    }
  };

  useEffect(() => {
    getUserItems();
  }, [loggedinUser, entityType]);

  /* 	Delete Item Handler */

  function deleteItem(id) {
    if (!_.isNull(id) || !_.isUndefined(id)) {
      fetch(`${BASE_URL}/api/items/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity_type: entityType?.key,
          id: deleteItemId,
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response?.status === true) {
            Toast.fire({
              icon: `${"success"}`,
              title: `${response.message}`,
            });
            clickConfirmationCloseHandler();
            setTimeout(() => {
              router.reload();
            }, 3000);
          } else {
            Toast.fire({
              icon: `${"error"}`,
              title: `${response.message}`,
            });
          }
        });
    }
  }

  return (
    <>
      <HeadMeta
        title="Dent247 | Dashboard | Items"
        description="description"
        content="Dent247 | Dashboard | Edit Profile"
      />
      {_.isNull(isLoggedInUser) ? (
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
                  Items
                </h2>
                <div
                  className={`my-4 md:my-6 flex flex-col gap-2 my-2 mr-0 sm:ml-auto flex-1 w-full sm:w-96`}
                >
                  <ListBoxForDeal
                    valueKey={entityType}
                    valueSetter={setEntityType}
                    optionsList={entityOptionsList}

                    // isDisable={_.isNull(isEditData) ? false : true}
                  />
                </div>
              </div>
              {loggedinUser?.role_type === "Vendor" ? (
                <div className="flex flex-col items-stretch md:flex-row md:items-center gap-3 justify-stretch md:justify-end mb-6 w-full md:w-auto">
                  <CustomButton
                    redirectURL={ROUTES.MANAGE_FEATURED}
                    isPrimary={true}
                    btnText={"Manage Featured"}
                  />
                  <CustomButton
                    redirectURL={ROUTES.ITEMS_CREATE}
                    isPrimary={true}
                    btnText={"Create Items"}
                  />
                </div>
              ) : (
                ""
              )}

              <div
                style={{ overflow: "initial" }}
                className={`overflow-x-auto${
                  _.size(userItems) >= 8 ? "tableHeight" : ""
                } relative md:shadow-md sm:rounded-lg md:border md:border-gray-200`}
              >
                <table className="w-full text-sm text-left tableWrapperStyle">
                  <thead className="text-sm md:text-base font-medium text-white capitalize bg-blue-600 font-inter">
                    <tr>
                      <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                        Thumbnail
                      </th>
                      <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                        Name
                      </th>
                      {entityType?.key == "courses" ? (
                        <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                          Provider Link
                        </th>
                      ) : entityType?.key == "services" ? (
                        <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                          Website
                        </th>
                      ) : (
                        ""
                      )}

                      <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                        Is Approved?
                      </th>

                      <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                        View Detail
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userItems && userItems?.length > 0 ? (
                      userItems?.map((e) => {
                        return (
                          <tr
                            className={`relative mt-4 md:my-0 pt-8 md:p-0 shadow-md md:shadow-none rounded-lg md:rounded-none border md:border-0 border-gray-200 md:border-b dark:bg-gray-800 dark:border-gray-700  ${
                              e?.blocked_item === true
                                ? "bg-black bg-opacity-30"
                                : "bg-white hover:bg-gray-50 dark:hover:bg-gray-600"
                            }`}
                          >
                            <td
                              data-label={"Thumbnail:"}
                              className="py-2 px-3 md:py-3 md:px-6"
                            >
                              <div className="flex flex-row gap-6 items-center">
                                {e?.featured_item === true ? (
                                  <img
                                    src="/featured-icon-highlighted.png"
                                    alt="featured"
                                    className="absolute left-2 top-2 md:relative md:top-0 md:left-0"
                                  />
                                ) : (
                                  <div className="absolute w-5 left-2 top-2 md:relative md:top-0 md:left-0"></div>
                                )}
                                <div className="h-12 w-12 overflow-hidden border border-blue-600 rounded-lg">
                                  <img
                                    src={`${
                                      e?.thumbnail || e?.logo
                                        ? e?.thumbnail || e?.logo
                                        : entityType?.key == "courses"
                                        ? "/courseFallBackImg.png"
                                        : entityType?.key != "products"
                                        ? "/productFallBackImg.png"
                                        : "/serviceFallBackImg.png"
                                    }`}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </div>
                            </td>
                            <td
                              data-label={"Name:"}
                              className="py-3 px-4 md:py-4 md:px-6 capitalize textTruncateOne"
                            >
                              {e?.title || e?.name || e?.company_name || "N/A"}
                            </td>

                            {entityType?.key == "courses" ? (
                              <td
                                data-label={"Provider Link:"}
                                className="py-3 px-4 md:py-4 md:px-6"
                              >
                                {!_.isNull(e?.provider_link) &&
                                !_.isEmpty(e?.provider_link) ? (
                                  <a
                                    className={`text-blue-600 underline`}
                                    target={"_blank"}
                                    href={e?.provider_link}
                                  >
                                    {e?.provider_link}
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                            ) : entityType?.key == "services" ? (
                              <td
                                data-label={"Website:"}
                                className="py-3 px-4 md:py-4 md:px-6"
                              >
                                {!_.isNull(e?.website) &&
                                !_.isEmpty(e?.website) ? (
                                  <a
                                    className={`text-blue-600 underline`}
                                    target={"_blank"}
                                    href={e?.website}
                                  >
                                    {e?.website}
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                            ) : (
                              ""
                            )}

                            <td
                              data-label={"Is Approved:"}
                              className="py-3 px-4 md:py-4 md:px-6 capitalize"
                            >
                              {e?.is_approved === 1 ? (
                                <CheckCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-blue-600 m-0" />
                              ) : (
                                <XCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-red-600 m-0" />
                              )}
                            </td>

                            <td
                              data-label={""}
                              className="py-3 px-4 md:py-4 md:px-6"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className="flex justify-center items-center gap-3 bg-blue-600 cursor-pointer p-4 w-28 h-11 m-0 ml-auto md:ml-0 rounded-md"
                                  onClick={() => clickDetailHandler(e)}
                                >
                                  <span className="text-white">View</span>
                                </div>

                                {isOpenDetail === true && (
                                  <ItemDetailModal
                                    isOpen={isOpenDetail}
                                    closeModalHandler={clickDetailCloseHandler}
                                    detailTitle={"Items Detail"}
                                    detailObj={itemDetail}
                                    entityType={entityType?.key}
                                    // sourceType={"dashboard"}
                                  />
                                )}
                                {ROLES_CHARACTER.includes(
                                  loggedinUser?.role_type
                                ) ? (
                                  <>
                                    {e?.blocked_item === false ? (
                                      <Menu
                                        as="div"
                                        className="absolute right-2 top-4 md:relative md: right-0 md:top-0 inline-block text-left"
                                      >
                                        <div>
                                          <Menu.Button className="inline-flex justify-center rounded-md bg-transparent">
                                            <DotsVerticalIcon className="w-6 h-6 text-light-blue-300 cursor-pointer" />
                                          </Menu.Button>
                                        </div>

                                        <Transition
                                          as={Fragment}
                                          enter="transition ease-out duration-100"
                                          enterFrom="transform opacity-0 scale-95"
                                          enterTo="transform opacity-100 scale-100"
                                          leave="transition ease-in duration-75"
                                          leaveFrom="transform opacity-100 scale-100"
                                          leaveTo="transform opacity-0 scale-95"
                                        >
                                          <Menu.Items className="p-4 shadow-4xl absolute right-2 z-50 w-36 origin-top-right rounded-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1 flex flex-col gap-3">
                                              <Menu.Item>
                                                <Link
                                                  href={`${ROUTES.DASHBOARD_ITEMS_ADD}/#edit/${e?.id}/${entityType?.key}`}
                                                >
                                                  <span className="text-light-blue-300 my-2 text-xs font-inter font-normal capitalize cursor-pointer">
                                                    edit
                                                  </span>
                                                </Link>
                                              </Menu.Item>
                                              <Menu.Item>
                                                <span
                                                  onClick={() =>
                                                    clickConfirmationHandler(
                                                      e?.id
                                                    )
                                                  }
                                                  className="text-light-blue-300 my-2 text-xs font-inter font-normal capitalize cursor-pointer"
                                                >
                                                  delete
                                                </span>
                                              </Menu.Item>
                                              {e?.is_approved == 1 &&
                                              e?.is_blocked == 0 ? (
                                                <Menu.Item>
                                                  <Link
                                                    href={`${ROUTES.GET_FEATURED}/${prevKey}/${e?.id}`}
                                                  >
                                                    <span className="text-light-blue-300 my-2 text-xs font-inter font-normal capitalize cursor-pointer">
                                                      get featured
                                                    </span>
                                                  </Link>
                                                </Menu.Item>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </Menu.Items>
                                        </Transition>
                                      </Menu>
                                    ) : (
                                      // <span className="bg-red-400 p-3 rounded-md">
                                      //   Disabled
                                      // </span>
                                      <></>
                                    )}

                                    {isOpen === true && (
                                      <ConfirmationModal
                                        isOpen={isOpen}
                                        closeModalHandler={
                                          clickConfirmationCloseHandler
                                        }
                                        title={"Delete Item"}
                                        description={
                                          "Are you sure you want to delete this item?"
                                        }
                                        successBtnText={"Sure"}
                                        cancelBtnText={"Cancel"}
                                        successHandler={() => deleteItem(e?.id)}
                                      />
                                    )}
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>

                {userItems?.length > 0 ? (
                  <></>
                ) : (
                  <div className="p-6">
                    <p className="capitalize text-center text-lg font-inter">
                      no items found
                    </p>
                  </div>
                )}
              </div>

              {!loading && userItems.length > 0 && totalCount > isOffset ? (
                <div className="mt-10 mb-4 flex items-center justify-center">
                  <CustomButton
                    btnText={"Load More"}
                    isPrimary={true}
                    clickHandler={() => getUserItems()}
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
    </>
  );
}

export async function getServerSideProps(context) {
  // let
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
