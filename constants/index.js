import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@heroicons/react/solid";
import Swal from "sweetalert2";
import _ from "lodash";

export const stripe_payment = require("stripe")(
  process.env.STRIPE_SECRET_KEY_NEW
);

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  ARTICLES: "/article",
  PRIVACY_POLICY: "/privacy-policy",
  CONTACT_US: "/contact",
  FAQS: "/faqs",
  TERMS_OF_SERVICE: "/terms-of-service",
  PRODUCTS: "/products",
  CART_CHECKOUT: "/checkout",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  LIBRARY: "/library",
  SERVICES: "/services",
  DEALS: "/deals",
  DEALS_LISTING: "/deals/listing",
  CATEGORY_LISTING: "/category/listing",
  REGISTER: "/register",
  LOGIN: "/login",
  MULTI_SELECTION: "/multi-selection",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD_DEALS: "/dashboard/deals",
  DASHBOARD_WISHLIST: "/dashboard/wishlist",
  DEALS_ADD: "/dashboard/deals/add",
  DASHBOARD_ORGANIZATIONS: "/dashboard/organizations",
  DASHBOARD_ORGANIZATIONS_ADD: "/dashboard/organizations/add",
  PRICING: "/dashboard/pricing",
  PROFILE: "/dashboard/profile",
  CHAT: "/dashboard/chat",
  PURCHASE: "/dashboard/purchase",
  ITEMS: "/dashboard/items",
  ITEMS_CREATE: "/dashboard/items/create",
  DASHBOARD_ITEMS_ADD: "/dashboard/items/create",
  GET_FEATURED: "/dashboard/get-featured",
  MANAGE_FEATURED: "/dashboard/manage-featured",
};

export const NOT_FOUND = (
  <p className="text-md font-medium text-gray-900">Not Found</p>
);

export const dealsSliderSettings = {
  dots: false,
  infinite: true,
  arrows: true,
  prevArrow: <ArrowLeftIcon className="prev-course-arrow h-8 w-8" />,
  nextArrow: <ArrowRightIcon className="next-course-arrow h-8 w-8" />,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  centerPadding: "60px",
  responsive: [
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

export const courseSliderSettings = {
  dots: false,
  infinite: true,
  arrows: true,
  prevArrow: <ArrowLeftIcon className="prev-course-arrow h-8 w-8" />,
  nextArrow: <ArrowRightIcon className="next-course-arrow h-8 w-8" />,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerPadding: "60px",
  responsive: [
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

export const SET_USER_DATA_WHITE_LIST = (data) => {
  localStorage.setItem("userData", JSON.stringify(data));
};
export const SET_USER_DATA_EMPTY = () => {
  localStorage.removeItem("userData");
};

export const GET_USER_DATA_WHITE_LIST = () => {
  return JSON.parse(localStorage.getItem("userData"));
};
export const REQUEST_TYPE = {
  get: "get",
  post: "post",
  patch: "patch",
  put: "put",
  delete: "delete",
};

//apis
export const VERIFY_USER_URL = {
  url: "/api/auth/verify_user",
  accesstoken: false,
  headers: false,
  requestType: REQUEST_TYPE.post,
};

export const salesMonths = [
  {
    month: "Jan",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
  {
    month: "Feb",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
  {
    month: "Mar",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
  {
    month: "Apr",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
  {
    month: "Aug",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
  {
    month: "Sep",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
  {
    month: "May",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
  {
    month: "Jun",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
  {
    month: "Jul",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
  {
    month: "Oct",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
  {
    month: "Nov",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
  {
    month: "Dec",
    sales: 0,
    revenue: 0,
    app_amount: 0,
  },
];

export const customReviewSliderSettings = {
  dots: false,
  infinite: true,
  arrows: true,
  prevArrow: <ArrowLeftIcon className="prev-course-arrow h-8 w-8" />,
  nextArrow: <ArrowRightIcon className="next-course-arrow h-8 w-8" />,
  speed: 500,
  centerPadding: "60px",
  slidesToShow: 1,
  slidesToScroll: 1,
};

export const reviewSliderSettings = {
  dots: true,
  infinite: true,
  arrows: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerPadding: "60px",
};

export const productSliderSettings = {
  dots: false,
  infinite: true,
  vertical: true,
  verticalSwiping: true,
  arrows: true,
  autoPlay: true,
  prevArrow: <ArrowLeftIcon className="prev-course-arrow h-8 w-8" />,
  nextArrow: <ArrowRightIcon className="next-course-arrow h-8 w-8" />,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1025,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};

export const OPTIONS_FOR_SALES_CHART = {
  events: null,
  plugins: {
    responsive: true,
    legend: {
      display: false,
    },
    elements: {
      bar: {
        barPercentage: 0.3,
        categoryPercentage: 1,
      },
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        display: false,
      },
    },
  },
};
export const OPTIONS_FOR_LINE_CHART = {
  events: null,
  plugins: {
    responsive: true,
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: "border-blue-600",
        backgroundColor: "bg-blue-600",
        fill: "start",
      },
      point: {
        radius: 0,
        hitRadius: 0,
      },
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        display: false,
      },
    },
  },
};

export const SALES_DATA = [
  {
    id: 1,
    cost: "2",
    month: "Jan",
  },
  {
    id: 1,
    cost: "3",
    month: "Jan",
  },
  {
    id: 2,
    cost: "4",
    month: "Feb",
  },
  {
    id: 3,
    cost: "6",
    month: "March",
  },
  {
    id: 4,
    cost: "8",
    month: "April",
  },
  {
    id: 5,
    cost: "10",
    month: "May",
  },
  {
    id: 6,
    cost: "11",
    month: "June",
  },
  {
    id: 7,
    cost: "11",
    month: "July",
  },
  {
    id: 8,
    cost: "10",
    month: "Aug",
  },
  {
    id: 9,
    cost: "8",
    month: "Sep",
  },
  {
    id: 10,
    cost: "8",
    month: "Oct",
  },
  {
    id: 11,
    cost: "10",
    month: "Nov",
  },
  {
    id: 12,
    cost: "12",
    month: "Dec",
  },
];

export const ORDER_ITEMS = [
  {
    id: 1,
    icon: "/directory-hero-2.png",
    title: "Detaseal Antilock",
    price: 36,
  },
  {
    id: 2,
    icon: "/directory-hero-2.png",
    title: "Detaseal Antilock",
    price: 36,
  },
  {
    id: 3,
    icon: "/directory-hero-2.png",
    title: "Detaseal Antilock",
    price: 36,
  },
];

export const DEAL_TYPE = {
  DISCOUNTED: "discounted",
  FREE_ITEM: "free_item",
};

export const ENTITY_TYPE = {
  COURSES: "courses",
  PRODUCTS: "products",
  SERVICES: "services",
  ARTICLES: "articles",
};

export const ENTITY_TYPE_ARRAY = [
  "courses",
  "products",
  "services",
  "articles",
];

export const ROLE_TYPE = [
  { id: 1, title: "Select Roles", disable: true },
  { id: 2, title: "User", disable: false },
  { id: 3, title: "Vendor", disable: false },
];

export const ROLE_TYPES = {
  vendor: "Vendor",
  user: "User",
};
export const PRACTICE_TYPE = [
  { id: 1, title: "Select Practice Type", disable: true },
  { id: 2, title: "General", disable: false },
  { id: 3, title: "Specialist", disable: false },
];
export const COUNTRY_OPTIONS = [
  { id: 1, title: "Select Country", disable: true },
  { id: 2, title: "United States", disable: false },
  { id: 3, title: "Canada", disable: false },
];

export const DEAL_COUNTRY_OPTIONS = [
  { id: 1, title: "Both", disable: false },
  { id: 2, title: "United States", disable: false },
  { id: 3, title: "Canada", disable: false },
];

export const ORGANIZATION_TYPE_OPTIONS = [
  { id: 1, title: "Course Provider", key: "course_provider", disable: false },
  { id: 2, title: "Service Provider", key: "service_provider", disable: false },
  { id: 3, title: "Product Provider", key: "product_provider", disable: false },
];

export const ENTITY_TYPE_OPTIONS = [
  { id: 1, title: "Course", key: "courses", disable: false },
  { id: 2, title: "Product", key: "products", disable: false },
  { id: 3, title: "Service", key: "services", disable: false },
  { id: 4, title: "Article", key: "articles", disable: false },
];

export const COURSE_MODE = [
  { id: 1, title: "Select Mode", disable: true },
  { id: 2, title: "Online", disable: false },
  { id: 3, title: "Onsite", disable: false },
];

export const ROLE_USER = "User";
export const ROLE_VENDOR = "Vendor";
export const ROLE_ADMIN = "Admin";

export const AREA_OF_INTERESTS = [
  { id: 1, title: "Option 1" },
  { id: 2, title: "Option 2" },
  { id: 3, title: "Option 3" },
  { id: 4, title: "Option 4" },
  { id: 5, title: "Option 5" },
];
export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* date time formatting options */
export const DATE_FORMAT_ONE = "YYYY-MM-DD";
export const DATE_FORMAT_TWO = "DD-MM-YYYY";
export const DATE_FORMAT_THREE = "DD-MMMM-YYYY";
export const DATE_FORMAT_FOUR = "dddd DD MMMM, YYYY";
export const DATE_TIME_FORMAT1 = "YYYY-MM-DD HH:mm";
export const DATE_TIME_FORMAT2 = "MMM D HH A";
export const DATE_TIME_FORMAT3 = "HH:mm DD-MM-YYYY";
export const DATE_TIME_FORMAT4 = "dddd Do MMM, YYYY @ HH:mm";
export const DATE_TIME_FORMAT5 = "Do MMM YYYY hh: mm a";
export const DATE_TIME_FORMAT6 = "D MMM YYYY at HH: mm";
export const DATE_TIME_FORMAT7 = "HH:mm (DD MMM)";
export const DATE_TIME_FORMAT8 = "ddd Do MMM YY, HH:mm";
export const DATE_TIME_FORMAT9 = "ddd Do MMM YY, HH:mm";

export const TIME_FORMAT1 = "HH:mm";
export const TIME_FORMAT2 = "H [h] : mm [min]";
export const TIME_FORMAT3 = "hh A";
export const TIME_FORMAT4 = "hh:mm A";
export const TIME_DAY_FORMAT3 = "ddd - HH:mm";

export async function getLoggedInUser() {
  let data = null;
  let loggedInUser = localStorage.getItem("userData");
  if (!_.isNull(loggedInUser)) {
    data = loggedInUser;
  }
  return data;
}

export async function getOrderItems() {
  let data = null;
  let cartItem = localStorage.getItem("cart_item");
  if (!_.isNull(cartItem)) {
    data = cartItem;
  }
  return data;
}

export const ROLES_CHARACTER = ["Vendor", "Admin"];

export function isLoggedInIndication() {
  let user = localStorage.getItem("userData");
  if (user) {
    return true;
  } else {
    return false;
  }
}

export function isOrderItems() {
  let items = localStorage.getItem("cart_item");
  if (items) {
    return true;
  } else {
    return false;
  }
}

export const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const FAQS_INFO = [
  {
    id: 1,
    isOpen: false,
    question: "What is Dent247?",
    answer:
      "Dent247 is a search engine for the dental industry. Dentists can find information on products, courses, services, deals, and information authored by industry experts acros the spectrum in North America. The goal is to help simplify the process of finding information, and the best deals for busy dentists like yourself.",
  },
  {
    id: 2,
    isOpen: false,
    question: "Do you sell dental supplies?",
    answer:
      "Dent247 is an information platform designed to connect you with a vendor that can help meet your practice needs. As a result, we have chosen not to become direct distributors of the companies listed on Dent247. Instead, we offer a level playing field where other distributors, manufacturers, service and course providers can list their products and services in one, easy to use and manage location for you.",
  },
  {
    id: 3,
    isOpen: false,
    question: "Are you a distributor/dealer of the products on your website?",
    answer:
      "We are not distributors or dealers of the products listed on our website.",
  },
  {
    id: 4,
    isOpen: false,
    question:
      "How can I purchase the products/courses/services on dent247.com?",
    answer:
      "You may request more information and we will make sure the vendor will contact you in a timely manner.",
  },
  {
    id: 5,
    isOpen: false,
    question: "Can I find patients from your platform?",
    answer:
      "No. This platform is strictly designed to be a business-to-business platform. Our vendors serve dental professionals.",
  },
];

export const NOT_FOUND_ICON = "/not-found.png";

/* upload base url of local+dev+staging */
export const UPLOAD_BASE_URL =
  "https://thqoivzegkzbttgdugai.supabase.co/storage/v1/object/public";

/* upload base url of production */
// export const UPLOAD_BASE_URL =
//   "https://lfnwqpnkgzbijuroafid.supabase.co/storage/v1/object/public";

/* base url of local */
export const BASE_URL = "http://localhost:3000";

/* base url of dev */
// export const BASE_URL = "https://staging-domain.vercel.app";

/* base url of staging */
// export const BASE_URL = "https://staging-dent247.vercel.app";

/* base url of production */
// export const BASE_URL = "https://www.dent247.com"

export const IMAGE_BASE_URL = "https://www.dent247.com";

export const CHAT_BASE_URL = "https://dent247-chats.herokuapp.com";

/* Validation Messages */
export const REQUIRED_SERVICES_SELECTION =
  "Please select atleast any one to proceed further.";
export const REQUIRED_EMAIL = "Email is required.";
export const REQUIRED_PASSWORD = "Password is required.";
export const REQUIRED_OLD_PASSWORD = "Old password is required.";
export const REQUIRED_NEW_PASSWORD = "New password is required.";
export const REQUIRED_CONFIRM_PASSWORD = "Confirm password is required.";
export const INVALID_ROLE_TYPE = "Role is required.";
export const INVALID_USER_TYPE = "Type is required.";
export const REQUIRED_NAME = "Name is required.";
export const REQUIRED_USERNAME = "Username is required.";
export const REQUIRED_PRACTICE_ADDRESS = "Practice Address is required.";
export const REQUIRED_BILLING_ADDRESS_ONE = "Street address is required.";
export const REQUIRED_PRACTICE_NUM = "Practice Number is required.";
export const INVALID_PHONE_NUM = "Phone Number is required.";
export const INVALID_COUNTRY = "Country is required.";
export const INVALID_CITY = "City is required.";
export const INVALID_STATE_PROVINCE = "State is required.";
export const INVALID_AREA_OF_INTERESTS = "Interests is required.";
export const REQUIRED_PRACTICE_NAME = "Practice name is required.";
export const REQUIRED_PRACTICE_TYPE = "Practice type is required.";
export const REQUIRED_LOCATION = "Location is required.";
export const REQUIRED_COMMENT = "Comment is required.";
export const REQUIRED_RATING = "Rating is required.";
export const REQUIRED_ZIP_CODE = "Zip code is required.";
export const REQUIRED_SHORT_BIO = "Short bio is required.";
export const REQUIRED_LONG_BIO = "Long bio is required.";
export const REQUIRED_MESSAGE = "Message is required.";

export const INVALID_NAME = "Invalid full name";
export const INVALID_BIO_LENGTH = "Bio should not be more than 250 charachters";
export const INVALID_NAME_LENGTH =
  "Name should not be more than 150 characters";
export const INVALID_USERNAME = "Invalid Username";
export const INVALID_EMAIL = "Invalid Email";
export const INVALID_NOTES = "More than 255 characters are not allowed.";
export const INVALID_EMPTY_NOTES = "Notes is required.";
export const INVALID_PASSWORD =
  "Password must contain 8 characters including 1 small letter, 1 capital letter, 1 digit and 1 special character!";
export const INVALID_CONFIRM_PASSWORD = "Password should match.";
export const INVALID_PRACTICE_ADDRESS = "Invalid Practice Address";
export const INVALID_PRACTICE_NUMBER = "Invalid Practice Number";
export const INVALID_ZIP_CODE = "Invalid Zip Code";
export const INVALID_IMAGE = "Only images are allowed.";

export const REQUIRED_ORGANIZATION = "Organization is required.";
export const REQUIRED_PRODUCT = "Product is required.";
export const REQUIRED_PRODUCT_QUANTITY = "Quantity is required.";
export const REQUIRED_FREE_ITEM = "Free Item is required.";
export const REQUIRED_FREE_QUANITITY = "Quantity is required.";
export const REQUIRED_TAG_LINE = "Tag Line is required.";
export const INVALID_DATE_ERROR = "Date should not be less than today.";
export const REQUIRED_DATE = "Date is required.";
export const REQUIRED_NET_SAVINGS = "Net savings is required.";
export const REQUIRED_COUPON_CODE = "Coupon code is required.";
export const REQUIRED_ITEM_PROVIDER = "Item provider is required.";

export const REQUIRED_TITLE = "Title is required.";
export const REQUIRED_PRICE = "Price is required.";
export const REQUIRED_VIDEO = "Video is required.";
export const REQUIRED_SHORT_DESC = "Short description is required.";
export const REQUIRED_LONG_DESC = "Long description is required.";
export const REQUIRED_CATEGORY = "Category is required.";
export const REQUIRED_TEACHER = "Teacher is required.";
export const REQUIRED_COURSE_MODE = "Course Mode is required.";
export const VIDEO_SIZE_MSG = "Video should be maximum of 10MB.";
export const INVALID_VIDEO = "Only videos are allowed.";
export const VIDEO_LENGTH_MSG = "Video should be maximum of 3 minutes.";
export const INVALID_PRICE = "Price should be more than 0";
export const REQUIRED_IMAGE = "Image is required.";
export const REQUIRED_URL = "Url is required.";
export const REQUIRED_ATTRS = "Attributes is required.";
export const REQUIRED_CATEGORY_FILTER = "Category filter is required.";

export const REQUIRED_SHORT_DESC_MAX_LENGTH =
  "Description should not be more than 250 characters";
export const REQUIRED_SHORT_DESC_MIN_LENGTH =
  "Description should be atleast 150 characters long";

export const USER_INFO_TEXT = "This will appear when you write reviews.";
export const AREA_OF_INT_INFO_TEXT =
  "This site is AI driven and customize your interest.";
export const VENDOR_BIO_TEXT = "This information is needed to submit the text.";
