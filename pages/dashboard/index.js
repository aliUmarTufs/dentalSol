import { useState, useEffect, useContext } from "react";
import { Navbar, HeadMeta, Footer, CustomCharts } from "../../components";

// Import components
import _ from "lodash";
import { useRouter } from "next/router";
import {
  BASE_URL,
  OPTIONS_FOR_LINE_CHART,
  OPTIONS_FOR_SALES_CHART,
  ROUTES,
  SALES_DATA,
} from "../../constants";
import { BeatLoader } from "react-spinners";
import {
  UserCircleIcon,
  ViewListIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
} from "@heroicons/react/solid";
import { useSockets } from "../../context/socket.context";
import ItemDetailModal from "../../components/ItemDetailModal";
import { MainContext } from "../../context-api/MainContext";

export default function Account() {
  const [productsCount, setProductsCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [articlesCount, setArticlesCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [revenueCount, setRevenueCount] = useState(0);
  const [chargesCount, setChargesCount] = useState(0);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [salesList, setSalesList] = useState([]);
  const [salesData, setSalesData] = useState({
    labels: "",
    datasets: [
      {
        data: "",
        borderColor: "#4e17e8",
        backgroundColor: "#4e17e8",
        borderRadius: 41,
      },
    ],
  });
  const [revenueData, setRevenueData] = useState({
    labels: SALES_DATA.map((data) => data.month),
    datasets: [
      {
        data: SALES_DATA.map((data) => data.cost),
        borderColor: "#3B82F6",
        borderWidth: 0.6,
        backgroundColor: "#e2e8fd",
        borderRadius: 41,
        fill: true,
      },
    ],
  });

  const [dent247Charges, setDent247Charges] = useState({
    labels: SALES_DATA.map((data) => data.month),
    datasets: [
      {
        data: SALES_DATA.map((data) => data.cost),
        borderColor: "#3B82F6",
        borderWidth: 0.6,
        backgroundColor: "#e2e8fd",
        borderRadius: 41,
        fill: true,
      },
    ],
  });

  const [user, setUser] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [showRequest, setShowRequest] = useState([]);
  const [userType, setUserType] = useState("");
  const router = useRouter();
  const { socket } = useSockets();

  const [details, setDetails] = useState(null);
  const [itemDetail, setItemDetail] = useState(null);
  const { MainState, dispatch } = useContext(MainContext);

  const clickDetailHandler = async (detail) => {
    setIsOpenDetail(true);
    // setAvailUsersList(availUsers);
    // setDealDetail(detail);
    setDetails(detail);
    setItemDetail(JSON.parse(detail?.items_id));
  };
  const clickDetailCloseHandler = async () => {
    setIsOpenDetail(false);
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = `auto`;
  };

  const fetchUser = () => {
    // const user = supabase.auth.user();
    // const userDetails = localStorage.getItem("userData");
    const userDetails = MainState?.userData;

    // const parseUserData = JSON.parse(userDetails);
    const parseUserData = userDetails;
    console.log({ parseUserData });
    if (!_.isNull(userDetails)) {
      setUser(parseUserData);
      setIsLoggedInUser(true);
      fetch(`${BASE_URL}/api/auth/get_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: parseUserData?.user_email,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === true) {
            setShowRequest(data.data);
          }
        });
    } else {
      setUser(false);
      setIsLoggedInUser(false);
    }
  };

  console.log({ MainState });

  useEffect(() => {
    if (MainState?.userData) {
      fetchUser();
    }
  }, [MainState?.userData]);

  // useEffect(() => {
  //   if (user == false) {
  //     router.push(ROUTES.LOGIN);
  //   }
  // }, [user]);

  useEffect(() => {
    if (isLoggedInUser === true) {
      const getVendorSalesData = async () => {
        await fetch(`${BASE_URL}/api/purchase/sales`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user?.id,
          }),
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.status == true) {
              setProductsCount(response?.data?.productListing);
              setCourseCount(response?.data?.courseListing);
              setServiceCount(response?.data?.serviceListing);
              setArticlesCount(response?.data?.articlesListing);

              setSalesCount(response?.data?.totalSales);
              setChargesCount(response?.data?.totalAppCharges);
              setRevenueCount(response?.data?.totalRevenue);
              setSalesList(response?.data?.salesList);
              setSalesData({
                labels: response?.data?.salesByMonth?.map((data) => data.month),
                datasets: [
                  {
                    data: response?.data?.salesByMonth?.map(
                      (data) => data.sales
                    ),
                    borderColor: "#4e17e8",
                    backgroundColor: "#4e17e8",
                    borderRadius: 41,
                  },
                ],
              });

              setRevenueData({
                labels: response?.data?.salesByMonth.map((data) => data.month),
                datasets: [
                  {
                    data: response?.data?.salesByMonth.map(
                      (data) => data.revenue
                    ),
                    borderColor: "#3B82F6",
                    borderWidth: 0.6,
                    backgroundColor: "#e2e8fd",
                    borderRadius: 41,
                    fill: true,
                  },
                ],
              });

              setDent247Charges({
                labels: response?.data?.salesByMonth.map((data) => data.month),
                datasets: [
                  {
                    data: response?.data?.salesByMonth.map(
                      (data) => data.app_amount
                    ),
                    borderColor: "#3B82F6",
                    borderWidth: 0.6,
                    backgroundColor: "#e2e8fd",
                    borderRadius: 41,
                    fill: true,
                  },
                ],
              });
            }
          });
      };
      getVendorSalesData();
    }
  }, [isLoggedInUser]);

  return _.isNull(user) || user == false ? (
    <div className="my-2 flex justify-center w-full h-screen items-center">
      <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
    </div>
  ) : (
    <>
      <HeadMeta
        title={"Dent247 | Dashboard"}
        description="description"
        content={"Dent247 | Dashboard"}
      />
      <div>
        <Navbar isDashboard={true} />
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 mt-44">
            <div className="mb-2 flex flex-col sm:flex-row h-full items-stretch sm:items-center gap-4 border-b border-black border-opacity-10 pb-8">
              {showRequest?.image ? (
                <div className="h-12 w-12">
                  <img
                    src={showRequest?.image}
                    alt={`${showRequest?.user_name ?? "user_image"}`}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
              ) : (
                <UserCircleIcon className="w-12 h-12 text-bluish-600" />
              )}
              <h1 className="font-semibold text-2xl text-bluish-600">
                <span className="mr-4 align-center">
                  {showRequest?.role_type == "Admin"
                    ? "Welcome Dent247 Admin"
                    : `Welcome ${
                        showRequest?.user_name ? showRequest?.user_name : "..."
                      } to your dashboard`}
                </span>
              </h1>
            </div>

            {user?.role_type === "Vendor" ? (
              <>
                <div className="mt-8">
                  <h2 className="font-inter font-bold text-bluish-600 text-3xl capitalize mb-5">
                    sales dashboard
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 my-5">
                    <SalesInfoCard
                      title={"Products Listing"}
                      amount={productsCount}
                      isListingAmount={true}
                      cardImg={
                        <ViewListIcon className="w-8 h-8 text-blue-600" />
                      }
                    />
                    <SalesInfoCard
                      title={"Course Listing"}
                      amount={courseCount}
                      isListingAmount={true}
                      cardImg={
                        <ViewListIcon className="w-8 h-8 text-blue-600" />
                      }
                    />

                    <SalesInfoCard
                      title={"Serices Listing"}
                      amount={serviceCount}
                      isListingAmount={true}
                      cardImg={
                        <ViewListIcon className="w-8 h-8 text-blue-600" />
                      }
                    />
                    <SalesInfoCard
                      title={"Articles Listing"}
                      amount={articlesCount}
                      isListingAmount={true}
                      cardImg={
                        <ViewListIcon className="w-8 h-8 text-blue-600" />
                      }
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
                    <SalesInfoCard
                      title={"total sales"}
                      amount={salesCount}
                      cardImg={
                        <ChartBarIcon className="w-8 h-8 text-blue-600" />
                      }
                    />
                    <SalesInfoCard
                      title={"Revenue"}
                      amount={revenueCount}
                      cardImg={
                        <TrendingUpIcon className="w-8 h-8 text-blue-600" />
                      }
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <CustomCharts
                    chartTitle={"Sales Report"}
                    chartData={salesData}
                    chartOptions={OPTIONS_FOR_SALES_CHART}
                    chartType={"bar"}
                  />
                  <div className="mt-12 mb-4">
                    <CustomCharts
                      chartTitle={"Total Revenue"}
                      chartData={revenueData}
                      chartOptions={OPTIONS_FOR_LINE_CHART}
                      chartType={"line"}
                    />
                  </div>
                </div>

                {/* Sales Table */}
                <div
                  className={`overflow-x-auto ${
                    _.size(salesList) >= 8 ? "tableHeight" : ""
                  } mt-8 relative md:shadow-md sm:rounded-lg md:border md:border-gray-200`}
                >
                  <table className="w-full text-sm text-left tableWrapperStyle">
                    <thead className="text-sm font-medium tracking-wider text-purplish-100 uppercase bg-greyish-800 font-inter">
                      <tr>
                        <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                          Organization
                        </th>
                        <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                          Sales
                        </th>
                        <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                          Revenue
                        </th>
                        <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                          Buyer
                        </th>
                        <th scope="col" className="py-2 px-3 md:py-3 md:px-6">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesList && salesList?.length > 0 ? (
                        salesList?.map((e) => {
                          return (
                            <tr className="font-inter font-normal text-purplish-100 text-sm mt-4 md:my-0 pt-4 md:p-0 bg-white shadow-md md:shadow-none rounded-lg md:rounded-none border md:border-0 border-gray-200 md:border-b">
                              <td
                                data-label={"Organization:"}
                                className="py-3 px-4 md:py-4 md:px-6 capitalize"
                              >
                                <div className="flex flex-row items-center md:items-stretch md:flex-col gap-1.5">
                                  <span className="font-inter font-normal text-purplish-200 text-sm">
                                    {e?.organization_id?.name}
                                  </span>
                                  <span className="font-inter font-normal text-greyish-900 text-xs">
                                    {e?.organization_id?.organization_type ===
                                    "product_provider"
                                      ? "Product"
                                      : e?.organization_id
                                          ?.organization_type ===
                                        "service_provider"
                                      ? "Service"
                                      : e?.organization_id
                                          ?.organization_type ===
                                        "course_provider"
                                      ? "Course"
                                      : "N/A"}
                                  </span>
                                </div>
                              </td>
                              <td
                                data-label={"Sales:"}
                                className="py-3 px-4 md:py-4 md:px-6 capitalize"
                              >
                                {e?.total_price}
                              </td>
                              <td
                                data-label={"Revenue:"}
                                className="py-3 px-4 md:py-4 md:px-6 capitalize"
                              >
                                {`${!_.isNull(e?.revenue) ? "$" : ""} ${
                                  !_.isNull(e?.revenue) ? e?.revenue : 0
                                }`}
                              </td>
                              <td
                                data-label={"Vendor:"}
                                className="py-3 px-4 md:py-4 md:px-6 capitalize"
                              >
                                {e?.buyer_id?.user_name}
                              </td>

                              <td
                                data-label={""}
                                className="py-3 px-4 md:py-4 md:px-6"
                              >
                                <div
                                  className="flex justify-center items-center gap-3 bg-blue-600 cursor-pointer p-4 w-28 h-11 m-0 ml-auto md:ml-0 rounded-md"
                                  onClick={() => clickDetailHandler(e)}
                                  //   onClick={() => alert("viwed")}
                                >
                                  <span className="text-white">View</span>
                                </div>

                                {isOpenDetail === true && (
                                  <ItemDetailModal
                                    isOpen={isOpenDetail}
                                    closeModalHandler={clickDetailCloseHandler}
                                    detailTitle={"Items Detail"}
                                    itemDetails={itemDetail}
                                    detailObj={details}
                                    sourceType={"dashboard"}
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </table>

                  {salesList?.length > 0 ? (
                    <></>
                  ) : (
                    <div className="p-6">
                      <p className="capitalize text-center text-lg font-inter">
                        no purchasing found
                      </p>
                    </div>
                  )}
                </div>

                {/* {!loading && salesList.length > 0 && totalCount > isOffset ? (
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
						)} */}
              </>
            ) : (
              ""
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

function SalesInfoCard({ title, amount, cardImg, isListingAmount = false }) {
  return (
    <div
      className={`bg-white rounded-md p-5 relative flex flex-col items-stretch justify-center gap-2.5`}
      style={{
        boxShadow:
          "0px 0.916364px 2.74909px rgba(0, 0, 0, 0.1), 0px 0.916364px 1.83273px rgba(0, 0, 0, 0.06)",
      }}
    >
      <div className="absolute top-auto bottom-auto right-5 m-auto">
        {cardImg}
      </div>

      <h6 className="text-sm text-purplish-100 font-inter font-medium capitalize">
        {title}
      </h6>
      <p className="text-3xl text-purplish-200 font-inter font-bold capitalize">{`${
        !isListingAmount ? "$" : ""
      }${amount}`}</p>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      isProtected: true,
    },
  };
}
