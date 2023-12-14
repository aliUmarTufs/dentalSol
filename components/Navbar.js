import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { Fragment, useContext, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuAlt1Icon, MenuAlt2Icon, SearchIcon } from "@heroicons/react/solid";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { ROUTES, BASE_URL, getOrderItems } from "../constants";
import { route } from "next/dist/server/router";
import _ from "lodash";
import ConfirmationModal from "./ConfirmationModal";
import CustomButton from "./CustomButton";
import { MainContext } from "../context-api/MainContext";
import { LOGOUT_USER } from "../context-api/action-types";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({
  isDashboard,
  isPageTitleInfo,
  isItemAdded,
  isItemRemoved,
}) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isCartItem, setIsCartItem] = useState({
    isCartItem: false,
    cartCount: 0,
  });
  const { MainState, dispatch } = useContext(MainContext);

  const router = useRouter();

  useEffect(() => {
    let cartItemsData = async () => {
      let cartItems = await getOrderItems();
      if (!_.isNull(cartItems)) {
        let parseItem = JSON.parse(cartItems);
        if (_.isArray(parseItem) && parseItem?.length > 0) {
          setIsCartItem({ isCartItem: true, cartCount: parseItem?.length });
        } else {
          setIsCartItem({ isCartItem: false, cartCount: parseItem?.length });
        }
      } else {
        setIsCartItem({ isCartItem: false, cartCount: 0 });
      }
    };

    cartItemsData();
  }, [isItemAdded, isItemRemoved]);

  const logoutConfirmClickHandler = () => {
    setIsOpenModal(true);
    // document.documentElement.style.overflow = `auto`;
  };

  const closeModalHandler = () => {
    setIsOpenModal(false);
    // document.body.style.overflow = "auto";
    document.documentElement.style.overflow = `auto`;
  };

  const navigation = [
    {
      name: "Home",
      href: ROUTES.HOME,
    },
    {
      name: "Courses",
      href: ROUTES.COURSES,
    },
    {
      name: "Products",
      href: ROUTES.PRODUCTS,
    },
    {
      name: "Services",
      href: ROUTES.SERVICES,
    },
    {
      name: "Library",
      href: ROUTES.LIBRARY,
    },
    {
      name: "Deals",
      href: ROUTES.DEALS,
    },
  ];

  const dashboard_navigation = [
    {
      name: "Dashboard",
      href: ROUTES.DASHBOARD,
      roleType: ["Vendor", "Admin", "User"],
    },
    {
      name: "Deals",
      href: ROUTES.DASHBOARD_DEALS,
      roleType: ["Vendor", "Admin"],
    },
    {
      name: "Wishlist",
      href: ROUTES.DASHBOARD_WISHLIST,
      roleType: ["Vendor", "User"],
    },
    // {
    // 	name: "Organizations",
    // 	href: ROUTES.DASHBOARD_ORGANIZATIONS,
    // 	roleType: ["Vendor", "Admin"],
    // },
    {
      name: "Purchase",
      href: ROUTES.PURCHASE,
      roleType: ["Vendor", "User"],
    },
    {
      name: "Profile",
      href: ROUTES.PROFILE,
      roleType: ["Vendor", "User"],
    },
    {
      name: "Items",
      href: ROUTES.ITEMS,
      roleType: ["Vendor"],
    },
    {
      name: "Pricing",
      href: ROUTES.PRICING,
      roleType: ["Vendor"],
    },
  ];
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = supabase.auth.user();

    setUser({ loggedInUser });

    // const userDetails = localStorage.getItem("userData");
    // !_.isNull(userDetails) ? setUser(JSON.parse(userDetails)) : setUser(null);
    const userDetails = MainState.userData;
    !_.isNull(userDetails) ? setUser(userDetails) : setUser(null);

    document.body.style.overflow = "auto";
  }, [MainState.userData]);

  const onHamburgerClick = () => {
    setShowMobileMenu(true);
    document.body.style.overflow = "hidden";
  };

  const onHamburgeHide = () => {
    setShowMobileMenu(false);
    document.body.style.overflow = "auto";
  };
  return (
    <div>
      <div className="fixed w-full top-0 h-16 p-2 bg-blue-600 z-100 flex items-center justify-center">
        <span className="text-white text-xs text-xs md:text-sm text-center">
          Please be aware, we have relaunched our platform and will be
          continuously updating and checking for accuracy of data over the next
          few months
        </span>
      </div>
      <div
        className={`fixed w-full top-16 py-2 z-100 ${
          isDashboard
            ? "bg-white border-b border-gray-200"
            : isPageTitleInfo
            ? "bg-bluish-100"
            : "bg-light-blue border border-blue-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-2">
          <div className="relative h-16 flex items-center justify-between">
            <div className="flex items-center lg:px-0">
              <div className="flex-shrink-0">
                <Link href={ROUTES.HOME}>
                  <img
                    className="block h-8 w-8 cursor-pointer"
                    src="https://tailwindui.com/img/logos/workflow-mark-blue-600.svg"
                    alt="Workflow"
                  />
                </Link>
              </div>
              <div className="hidden lg:block lg:ml-10">
                <div className="flex space-x-2">
                  {isDashboard ? (
                    <>
                      {dashboard_navigation.map((item, index) => {
                        return (
                          <DashboardNavigationLink
                            item={item}
                            key={index}
                            userRoleType={user?.role_type}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {navigation.map((item, index) => (
                        <NavigationLink item={item} key={index} />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 px-2 flex justify-center lg:ml-6 lg:justify-end"></div>
            <div className="flex items-center lg:hidden">
              {!isDashboard ? (
                <Link href={ROUTES.CART_CHECKOUT}>
                  <div className="relative cursor-pointer mr-4">
                    <img
                      src="/cart.png"
                      alt="cart-icon"
                      className="object-contain"
                    />

                    {isCartItem?.isCartItem === true ? (
                      <div className="absolute inline-flex items-center justify-center p-2 w-2 h-2 bg-blue-600 border-2 border-white rounded-full -top-1 -right-2 dark:border-gray-900"></div>
                    ) : (
                      ""
                    )}
                  </div>
                </Link>
              ) : (
                ""
              )}

              {/* {user ? (
                <Link href={ROUTES.CHAT}>
                  <div className="relative w-6 h-6 cursor-pointer mr-4">
                    <img
                      src="/chat-icon.png"
                      alt="chat"
                      className="object-contain"
                    />
                    <div className="absolute inline-flex items-center justify-center p-2 w-5 h-5 bg-blue-600 border-1 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                      <span
                        className="font-bold text-white"
                        style={{ fontSize: 10 }}
                      >
                        20
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                ""
              )} */}

              {/* Mobile menu button */}
              <div className="text-blue-600 p-2 rounded-md inline-flex items-center justify-center">
                <span className="sr-only">Open main menu</span>
                {showMobileMenu ? (
                  <XIcon
                    className="block h-6 w-6 md:h-8 md:w-8"
                    aria-hidden="true"
                    onClick={onHamburgeHide}
                  />
                ) : (
                  <MenuAlt2Icon
                    className="block h-6 w-6 md:h-8 md:w-8"
                    aria-hidden="true"
                    onClick={onHamburgerClick}
                  />
                )}
              </div>
            </div>
            <div className="hidden lg:flex items-center lg:ml-4">
              {!isDashboard ? (
                <Link href={ROUTES.CART_CHECKOUT}>
                  <div className="relative cursor-pointer mr-4">
                    <img
                      src="/cart.png"
                      alt="cart-icon"
                      className="object-contain"
                    />
                    {isCartItem?.isCartItem === true ? (
                      <div className="absolute inline-flex items-center justify-center p-2 w-2 h-2 bg-blue-600 border-2 border-white rounded-full -top-1 -right-2 dark:border-gray-900"></div>
                    ) : (
                      ""
                    )}
                  </div>
                </Link>
              ) : (
                ""
              )}
              {/* {user ? (
                <Link href={ROUTES.CHAT}>
                  <div className="relative w-6 h-6 cursor-pointer mr-4">
                    <img
                      src="/chat-icon.png"
                      alt="chat"
                      className="object-contain"
                    />
                    <div className="absolute inline-flex items-center justify-center p-2 w-5 h-5 bg-blue-600 border-1 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                      <span
                        className="font-bold text-white"
                        style={{ fontSize: 10 }}
                      >
                        20
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                ""
              )} */}

              <div className="flex items-center">
                {/* Profile dropdown */}
                {user ? (
                  <>
                    <div className="flex items-center gap-4">
                      <CustomButton
                        btnText="Logout"
                        isPrimary={false}
                        clickHandler={logoutConfirmClickHandler}
                      />
                      <CustomButton
                        redirectURL={`${
                          isDashboard ? ROUTES.HOME : ROUTES.DASHBOARD
                        }`}
                        btnText={`${
                          isDashboard ? "Back To Home" : "Dashboard"
                        }`}
                        isPrimary={true}
                      />
                    </div>

                    {isOpenModal === true && (
                      <ConfirmationModal
                        isOpen={isOpenModal}
                        closeModalHandler={closeModalHandler}
                        title={"Logout"}
                        description={"Are you sure you want to logout?"}
                        successBtnText={"Sure"}
                        cancelBtnText={"Cancel"}
                        successHandler={() => {
                          //   localStorage.removeItem("userData");
                          dispatch({ type: LOGOUT_USER, userData: null });

                          router.reload(ROUTES.LOGIN);
                        }}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <CustomButton
                      redirectURL={ROUTES.REGISTER}
                      btnText="Register"
                      isPrimary={false}
                    />
                    <CustomButton
                      redirectURL={ROUTES.LOGIN}
                      btnText="Login"
                      isPrimary={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${showMobileMenu ? "menuBgOverlay" : ""}`}
          onClick={onHamburgeHide}
        ></div>
        <div
          className={`mobileMenuWrap lg:hidden ${
            showMobileMenu ? `mobileMenuListWrap` : ""
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="flex-shrink-0 mb-4">
              <Link href={ROUTES.HOME}>
                <img
                  className="block h-8 w-8 cursor-pointer"
                  src="https://tailwindui.com/img/logos/workflow-mark-blue-600.svg"
                  alt="Workflow"
                />
              </Link>
            </div>
            {isDashboard ? (
              <>
                {dashboard_navigation.map((item, index) => (
                  <DashboardNavigationLink
                    item={item}
                    key={index}
                    userRoleType={user?.role_type}
                  />
                ))}
              </>
            ) : (
              <>
                {navigation.map((item, index) => (
                  <NavigationLink item={item} key={index} />
                ))}
              </>
            )}
          </div>
          <div className="pt-4 pb-3">
            <div className="px-5 flex items-center"></div>
            <div className="block lg:hidden">
              <div className="flex items-center">
                {/* Profile dropdown */}
                {user ? (
                  <>
                    <div className="flex items-stretch flex-col gap-4">
                      <CustomButton
                        btnText="Logout"
                        isPrimary={false}
                        clickHandler={logoutConfirmClickHandler}
                      />
                      <CustomButton
                        redirectURL={`${
                          isDashboard ? ROUTES.HOME : ROUTES.DASHBOARD
                        }`}
                        btnText={`${
                          isDashboard ? "Back To Home" : "Dashboard"
                        }`}
                        isPrimary={true}
                      />
                    </div>

                    {isOpenModal === true && (
                      <ConfirmationModal
                        isOpen={isOpenModal}
                        closeModalHandler={closeModalHandler}
                        title={"Logout"}
                        description={"Are you sure you want to logout?"}
                        successBtnText={"Sure"}
                        cancelBtnText={"Cancel"}
                        successHandler={() => {
                          //   localStorage.removeItem("userData");
                          dispatch({ type: LOGOUT_USER, userData: null });

                          document.documentElement.style.overflow = `auto`;
                          router.reload(ROUTES.LOGIN);
                        }}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-stretch gap-4">
                    <CustomButton
                      redirectURL={ROUTES.REGISTER}
                      btnText="Register"
                      isPrimary={false}
                    />
                    <CustomButton
                      redirectURL={ROUTES.LOGIN}
                      btnText="Login"
                      isPrimary={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const DashboardNavigationLink = ({ item, userRoleType }) => {
  const router = useRouter();

  const checkRoleType = !_.isUndefined(item.roleType)
    ? item?.roleType?.includes(userRoleType)
    : "";

  return (
    <Link href={item.href} key={item.href}>
      <span
        className={`block ${
          checkRoleType === true ? "" : "hidden"
        } rounded-md px-2 py-3 pl-0 lg:py-2 lg:px-2 text-sm font-medium uppercase cursor-pointer ${
          router.pathname === item.href
            ? "activeClassLine text-blue-600"
            : "text-gray-600 hover:text-blue-600 relative"
        }`}
      >
        {item.name}
      </span>
    </Link>
  );
};

export const NavigationLink = ({ item }) => {
  const router = useRouter();
  const checkRoleType = !_.isUndefined(item.roleType);

  return (
    <Link href={item.href} key={item.href}>
      <span
        className={`block rounded-md px-2 py-3 pl-0 lg:py-2 lg:px-2 text-sm font-medium uppercase cursor-pointer ${
          router.pathname.includes(`${item.href}/`) === true ||
          router.pathname === item.href
            ? "activeClassLine text-blue-600"
            : "text-gray-600 hover:text-blue-600 relative"
        }`}
      >
        {item.name}
      </span>
    </Link>
  );
};
