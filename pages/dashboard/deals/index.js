import {
  Navbar,
  CustomButton,
  ConfirmationModal,
  DealDetailModal,
  HeadMeta,
} from "../../../components";
import { Fragment, useEffect, useState } from "react";
import {
  BASE_URL,
  getLoggedInUser,
  isLoggedInIndication,
  ROLES_CHARACTER,
  ROUTES,
  Toast,
} from "../../../constants";
import _ from "lodash";
import { useRouter } from "next/router";
import { BeatLoader } from "react-spinners";
import Link from "next/link";
import {
  ChartSquareBarIcon,
  CheckCircleIcon,
  PencilAltIcon,
  TagIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import { Tab } from "@headlessui/react";

export default function Deals() {
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(null);
  const [availUsersList, setAvailUsersList] = useState(null);
  const [dealDetail, setDealDetail] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [acceptIsOpen, setAcceptIsOpen] = useState(false);
  const [rejectIsOpen, setRejectIsOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isOffset, setIsOffset] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const clickConfirmationHandler = async (id) => {
    setDeleteItemId(id);
    setIsOpen(true);
  };
  const clickConfirmationCloseHandler = async () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = `auto`;
  };

  const acceptHandler = async () => {
    setAcceptIsOpen(true);
  };
  const acceptCloseHandler = async () => {
    setAcceptIsOpen(false);
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = `auto`;
  };

  const rejectHandler = async () => {
    setRejectIsOpen(true);
  };

  const rejectCloseHandler = async () => {
    setRejectIsOpen(false);
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = `auto`;
  };

  const clickDetailHandler = async (detail, availUsers) => {
    setIsOpenDetail(true);
    setAvailUsersList(availUsers);
    setDealDetail(detail);
  };
  const clickDetailCloseHandler = async () => {
    setIsOpenDetail(false);
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = `auto`;
  };

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

  return (
    <>
      <HeadMeta
        title="Dent247 | Dashboard | Deals"
        description="description"
        content="Dent247 | Dashboard | Deals"
      />
      {_.isNull(isLoggedInUser) || !isLoggedInUser ? (
        <div className="my-2 flex justify-center w-full h-screen items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <div>
          <Navbar isDashboard={true} />
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 mt-44">
              <div className="flex flex-col-reverse sm:flex-row items-stretch gap-6 sm:gap-0 sm:items-center justify-between my-3 sm:my-5">
                <h2 className="text-2xl font-semibold capitalize font-inter">
                  deals
                </h2>
                <div className="ml-auto sm:ml-0">
                  {ROLES_CHARACTER.includes(loggedinUser?.role_type) ? (
                    <CustomButton
                      redirectURL={ROUTES.DEALS_ADD}
                      isPrimary={true}
                      btnText={"Create Deals"}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <Tab.Group>
                <div className="flex flex-col items-end">
                  <div className="p-1 border rounded-lg my-4 md:w-96 max-sm:w-64">
                    <Tab.List className="focus:outline-none">
                      <div className="flex">
                        <Tab as={Fragment}>
                          {({ selected }) => (
                            <button
                              className={
                                selected
                                  ? "bg-blue-100 text-blue-700 px-3 py-2 font-medium text-sm rounded-md w-1/2 flex justify-center items-center"
                                  : "flex justify-center items-center text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md w-1/2"
                              }
                            >
                              <TagIcon className="h-5 w-5 mr-2" />
                              Discounted
                            </button>
                          )}
                        </Tab>
                        <Tab as={Fragment}>
                          {({ selected }) => (
                            <button
                              className={
                                selected
                                  ? "flex justify-center items-center bg-blue-100 text-blue-700 px-3 py-2 font-medium text-sm rounded-md w-1/2"
                                  : "flex justify-center items-center text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md w-1/2"
                              }
                            >
                              <ChartSquareBarIcon className="h-5 w-5 mr-2" />
                              Free Item
                            </button>
                          )}
                        </Tab>
                      </div>
                    </Tab.List>
                  </div>
                </div>
                <Tab.Panels>
                  <Tab.Panel>
                    <DealsTable
                      loggedinUser={loggedinUser}
                      type={"discounted"}
                      isOpenDetail={isOpenDetail}
                      clickConfirmationHandler={clickConfirmationHandler}
                      isOpen={isOpen}
                      clickDetailHandler={clickDetailHandler}
                      clickDetailCloseHandler={clickDetailCloseHandler}
                      dealDetail={dealDetail}
                      availUsersList={availUsersList}
                      clickConfirmationCloseHandler={
                        clickConfirmationCloseHandler
                      }
                      acceptIsOpen={acceptIsOpen}
                      acceptCloseHandler={acceptCloseHandler}
                      rejectIsOpen={rejectIsOpen}
                      rejectHandler={rejectHandler}
                      acceptHandler={acceptHandler}
                      rejectCloseHandler={rejectCloseHandler}
                      deleteItemId={deleteItemId}
                    />
                  </Tab.Panel>
                  <Tab.Panel>
                    <DealsTable
                      loggedinUser={loggedinUser}
                      type={"free_item"}
                      isOpenDetail={isOpenDetail}
                      clickConfirmationHandler={clickConfirmationHandler}
                      isOpen={isOpen}
                      clickDetailHandler={clickDetailHandler}
                      clickDetailCloseHandler={clickDetailCloseHandler}
                      dealDetail={dealDetail}
                      availUsersList={availUsersList}
                      clickConfirmationCloseHandler={
                        clickConfirmationCloseHandler
                      }
                      acceptIsOpen={acceptIsOpen}
                      acceptCloseHandler={acceptCloseHandler}
                      rejectIsOpen={rejectIsOpen}
                      rejectHandler={rejectHandler}
                      acceptHandler={acceptHandler}
                      rejectCloseHandler={rejectCloseHandler}
                      deleteItemId={deleteItemId}
                    />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DealsTable({
  loggedinUser,
  type,
  isOpen,
  isOpenDetail,
  clickConfirmationHandler,
  clickDetailHandler,
  clickDetailCloseHandler,
  dealDetail,
  availUsersList,
  clickConfirmationCloseHandler,
  acceptIsOpen,
  acceptCloseHandler,
  rejectIsOpen,
  rejectHandler,
  acceptHandler,
  rejectCloseHandler,
  deleteItemId,
}) {
  const [loading, setLoading] = useState(true);
  const [dealList, setDealList] = useState([]);
  const [isOffset, setIsOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [makeDisable, setMakeDisable] = useState(false);

  const router = useRouter();
  //   useEffect(() => {
  //     if (!_.isEmpty(dealList) || dealList) {
  //       setLoading(false);
  //     }
  //   }, [dealList]);

  const fetchDeal = async (dealtype = null) => {
    // setLoading(true);
    setMakeDisable(true);
    dealtype = type;
    fetch(
      `${BASE_URL}/api/deals/userdeal?user_id=${loggedinUser?.id}&offset=${isOffset}&type=${dealtype}`
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          //   setDealList();
          setDealList((prevState) => [...prevState, ...response.data]);
          setIsOffset(response.offset);
          setTotalCount(response.totalCount);
          setLoading(false);
          setMakeDisable(false);
        } else {
          setDealList([]);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (loggedinUser?.id) {
      fetchDeal();
    }
  }, [type]);

  function deleteDeal(id) {
    if (!_.isNull(id) || !_.isUndefined(id)) {
      fetch(`${BASE_URL}/api/deals/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deal_id: deleteItemId,
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

  const dealApproval = async (approval, id) => {
    if (loggedinUser?.role_type == "Admin") {
      let payload = {
        deal_id: id,
        approval: approval,
      };
      fetch(`${BASE_URL}/api/deals/approval`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.status === true) {
            Toast.fire({
              icon: `${"success"}`,
              title: `${response.message}`,
            });

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
  };
  return (
    <>
      <HeadMeta
        title="Dent247 | Dashboard | Deals"
        description="description"
        content="Dent247 | Dashboard | Deals"
      />
      {loading ? (
        <div className="my-2 flex justify-center items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <div
          className={`overflow-x-auto ${
            _.size(dealList) >= 8 ? "tableHeight" : ""
          } relative md:shadow-md sm:rounded-lg md:border md:border-gray-200`}
        >
          <table className="w-full text-sm text-center tableWrapperStyle">
            <thead className="text-sm md:text-base font-medium text-white capitalize bg-blue-600 font-inter">
              <tr>
                <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                  Item
                </th>
                <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                  Entity Type
                </th>
                <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                  Deal Type
                </th>
                <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                  Expiry Date
                </th>
                <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                  Detail
                </th>
                {ROLES_CHARACTER.includes(loggedinUser?.role_type) ? (
                  <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                    Action
                  </th>
                ) : (
                  ""
                )}
                {loggedinUser?.role_type == "Admin" ? (
                  <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                    Edit/Update
                  </th>
                ) : (
                  ""
                )}
              </tr>
            </thead>
            {_.size(dealList) > 0 ? (
              <tbody>
                {_.filter(dealList, (items) => {
                  if (items.deal_type === type) return items;
                }).length > 0 ? (
                  _.filter(dealList, (items) => {
                    if (items.deal_type === type) return items;
                  }).map((e) => (
                    <tr className="mt-4 text-gray-500 md:my-0 pt-4 md:p-0 bg-white shadow-md md:shadow-none rounded-lg md:rounded-none border md:border-0 border-gray-200 md:border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td
                        data-label={"Item:"}
                        className="py-3 px-4 md:py-4 md:px-6"
                      >
                        <div className="h-12 w-12 md:m-auto overflow-hidden border border-blue-600 rounded-lg">
                          <img
                            src={`${
                              e?.itemDetails[0]?.thumbnail
                                ? e?.itemDetails[0]?.thumbnail
                                : e?.type === "courses"
                                ? "/courseFallBackImg.png"
                                : e?.type === "products"
                                ? "/productFallBackImg.png"
                                : "/serviceFallBackImg.png"
                            }`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td
                        data-label={"Entity Type:"}
                        className="py-3 px-4 md:py-4 md:px-6 capitalize"
                      >
                        {e?.type}
                      </td>
                      <td
                        data-label={"Deal Type:"}
                        className="py-3 px-4 md:py-4 md:px-6"
                      >
                        {e?.deal_type == "free_item"
                          ? "Free Item"
                          : e?.deal_type == "discounted"
                          ? "Discounted"
                          : "N/A"}
                      </td>
                      <td
                        data-label={"Location:"}
                        className="py-3 px-4 md:py-4 md:px-6"
                      >
                        {e?.expiry_data ?? "N/A"}
                      </td>

                      <td data-label={""} className="py-3 px-4 md:py-4 md:px-6">
                        <div
                          className="flex justify-center items-center gap-3 bg-blue-600 cursor-pointer p-4 w-28 h-11 m-0 ml-auto md:m-auto rounded-md"
                          onClick={() => clickDetailHandler(e, e?.availUsers)}
                        >
                          <span className="text-white">
                            {e?.availUsersCount ?? "0"}
                          </span>
                          <img src="/eye-icon.png" />
                        </div>

                        {isOpenDetail === true && (
                          <DealDetailModal
                            isOpen={isOpenDetail}
                            closeModalHandler={clickDetailCloseHandler}
                            detailTitle={"Deal Detail"}
                            detailObj={dealDetail}
                            availUserTitle={"Avail Users"}
                            availUsersArr={availUsersList}
                          />
                        )}
                      </td>

                      {ROLES_CHARACTER.includes(loggedinUser?.role_type) ? (
                        <td
                          data-label={""}
                          className="py-3 px-4 md:py-4 md:px-6"
                        >
                          <div className="flex items-center justify-end md:justify-center ml-auto md:ml-0 gap-4">
                            <div className="h-11 flex items-center">
                              {e?.is_expire === 0 ? (
                                <Link
                                  href={`${ROUTES.DEALS_ADD}/#edit/${e?.id}`}
                                >
                                  <PencilAltIcon className="w-8 h-8 md:w-6 md:h-6 cursor-pointer text-blue-600 hover:text-blue-800" />
                                </Link>
                              ) : (
                                <div className="w-8 h-8 md:w-6 md:h-6"></div>
                              )}
                            </div>
                            <div
                              onClick={() => clickConfirmationHandler(e?.id)}
                              className="h-11 flex items-center"
                            >
                              <TrashIcon className="w-8 h-8 md:w-6 md:h-6 cursor-pointer text-red-600 hover:text-red-800" />
                            </div>

                            {isOpen === true && (
                              <ConfirmationModal
                                isOpen={isOpen}
                                closeModalHandler={
                                  clickConfirmationCloseHandler
                                }
                                title={"Delete Deal"}
                                description={
                                  "Are you sure you want to delete this deal?"
                                }
                                successBtnText={"Sure"}
                                cancelBtnText={"Cancel"}
                                successHandler={() => deleteDeal(e?.id)}
                              />
                            )}
                          </div>
                        </td>
                      ) : (
                        ""
                      )}

                      {loggedinUser?.role_type == "Admin" ? (
                        <td data-label="" className="py-3 px-4 md:py-4 md:px-6">
                          <div className="flex items-center justify-end md:justify-center ml-auto md:ml-0 gap-4">
                            {e?.is_approved === true ? (
                              <div className="text-base text-green-600 font-semibold h-11 flex items-center uppercase">
                                <CheckCircleIcon className={"w-6 h-6 mr-2"} />{" "}
                                approved
                              </div>
                            ) : e?.is_approved === false ? (
                              <div className="text-base text-red-600 font-semibold h-11 flex items-center uppercase">
                                <XCircleIcon className={"w-6 h-6 mr-2"} />{" "}
                                rejected
                              </div>
                            ) : (
                              <>
                                <CustomButton
                                  btnText={"Reject"}
                                  isDanger={true}
                                  clickHandler={rejectHandler}
                                />
                                <CustomButton
                                  btnText={"Approve"}
                                  isPrimary={true}
                                  clickHandler={acceptHandler}
                                />
                              </>
                            )}
                            {acceptIsOpen === true && (
                              <ConfirmationModal
                                isOpen={acceptIsOpen}
                                closeModalHandler={acceptCloseHandler}
                                title={"Approve Deal"}
                                description={
                                  "Are you sure you want to approve this deal?"
                                }
                                successBtnText={"Sure"}
                                cancelBtnText={"Cancel"}
                                successHandler={() => dealApproval(true, e?.id)}
                              />
                            )}

                            {rejectIsOpen === true && (
                              <ConfirmationModal
                                isOpen={rejectIsOpen}
                                closeModalHandler={rejectCloseHandler}
                                title={"Reject Deal"}
                                description={
                                  "Are you sure you want to reject this deal?"
                                }
                                successBtnText={"Sure"}
                                cancelBtnText={"Cancel"}
                                successHandler={() =>
                                  dealApproval(false, e?.id)
                                }
                              />
                            )}
                          </div>
                        </td>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))
                ) : (
                  <div className="p-6">
                    <p className="capitalize text-center text-lg font-inter">
                      no deal found
                    </p>
                  </div>
                )}
              </tbody>
            ) : (
              <div className="p-6">
                <p className="capitalize text-center text-lg font-inter">
                  no deal found
                </p>
              </div>
            )}
          </table>
        </div>
      )}

      {!loading &&
      _.filter(dealList, (items) => {
        if (items.deal_type === type) return items;
      }).length > 0 &&
      totalCount > isOffset ? (
        // <button className="bg-blue-600 text-white p-4" onClick={fetchDeal}>
        // 	Load More
        // </button>

        <div className="mt-10 mb-4 flex items-center justify-center">
          <CustomButton
            btnText={"Load More"}
            isPrimary={true}
            clickHandler={() => fetchDeal(type)}
            isDisabled={makeDisable}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export async function getStaticProps() {
  return {
    props: {
      isProtected: true,
      isVendor: true,
    },
  };
}
