import { Dialog, Transition } from "@headlessui/react";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import _ from "lodash";
import { Fragment, useState, useEffect, useContext } from "react";
import {
  HeadMeta,
  Navbar,
  FeaturedDemoModal,
  AlertBox,
} from "../../../components";
import { BASE_URL, ROUTES } from "../../../constants";
import { BeatLoader } from "react-spinners";
import { MainContext } from "../../../context-api/MainContext";
import { useRouter } from "next/router";

let FEATURED_ARR = [
  {
    id: 1,
    title: "slot 01",
    duration: 24,
    price: 10,
  },
  {
    id: 2,
    title: "slot 02",
    duration: 24,
    price: 99,
  },
  {
    id: 3,
    title: "slot 03",
    duration: 24,
    price: 120,
  },
  {
    id: 4,
    title: "slot 04",
    duration: 48,
    price: 200,
  },
  {
    id: 5,
    title: "slot 05",
    duration: 96,
    price: 999,
  },
  {
    id: 6,
    title: "slot 06",
    duration: 120,
    price: 1024,
  },
];

export default function GetFeatured() {
  const [slotsList, setSlotsList] = useState([]);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [user, setUser] = useState(null);
  const { MainState, dispatch } = useContext(MainContext);
  const router = useRouter();

  const fetchUser = () => {
    // const userDetails = localStorage.getItem("userData");
    // const parseUserData = JSON.parse(userDetails);

    const userDetails = MainState?.userData;
    const parseUserData = userDetails;
    if (!_.isNull(userDetails)) {
      setUser(parseUserData);
      setIsLoggedInUser(true);
    } else {
      setUser(false);
      setIsLoggedInUser(false);
      router.push(ROUTES.LOGIN);
    }
  };

  const fetchSlotsList = () => {
    fetch(`${BASE_URL}/api/slots/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slot_type: "products" }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response?.status === true) {
          setSlotsList(response?.data);
        }
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!_.isNull(user)) {
      fetchSlotsList();
    }
  }, [user]);

  return _.isNull(user) || user == false ? (
    <div className="my-2 flex justify-center w-full h-screen items-center">
      <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
    </div>
  ) : (
    <>
      <HeadMeta
        title={"Dent247 | Dashboard | Get Featured"}
        description="description"
        content={"Dent247 | Dashboard | Get Featured"}
      />
      <div>
        <Navbar isDashboard={true} />
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 mt-48">
            <div className="flex flex-col gap-6 items-center justify-center my-3 sm:my-5">
              <h6 className="text-lg text-dark-bluish-500 text-center font-semibold capitalize font-inter">
                buy slot
              </h6>

              <h2 className="text-2xl md:text-4xl text-blackish-900 text-center font-bold uppercase font-inter">
                get featured
              </h2>
            </div>
            <div
              className={`mt-8 ${
                _.size(slotsList) > 0
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex"
              }`}
            >
              {_.size(slotsList) > 0 ? (
                slotsList?.map((item, index) => {
                  return <FeaturedCard key={index} featuredPlanObj={item} />;
                })
              ) : (
                <AlertBox type={"info"} text={`Coming Soon.`} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FeaturedCard({ featuredPlanObj, loggedinUser }) {
  const [isOpenModal, setIsOpenModal] = useState(false);

  /* openModalHandler function */
  const openFeaturedHandler = () => {
    setIsOpenModal(true);
    // document.documentElement.style.overflow = `auto`;
  };

  /* closeModalHandler function */
  const closeModalHandler = () => {
    setIsOpenModal(false);
    // document.body.style.overflow = "auto";
    document.documentElement.style.overflow = `initial`;
  };

  return (
    <div className="bg-white border border-dark-bluish-500 shadow-4xl border-opacity-10 rounded-lg p-5">
      <div className="flex flex-col gap-2">
        <h4 className="text-base text-bluish-600 font-bold font-inter capitalize">
          {featuredPlanObj?.slot_name}
        </h4>
        <h6 className="text-sm text-light-blue-800 font-medium font-inter normal-case">
          {`Featured for ${featuredPlanObj?.duration || 24} hours`}
        </h6>
      </div>

      <hr className="w-4/5 h-px mx-auto mt-6 mb-5 bg-greyish-400 bg-opacity-10 border-0 rounded" />

      <div className="flex flex-col gap-3">
        <div
          className={`bg-dark-bluish-500 rounded-md flex flex-row items-center justify-between p-3 my-1.5" ${
            // loggedinUser?.item_id?.id === featuredPlanObj?.item_id
            false ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => {
            if (
              // loggedinUser?.item_id?.id === featuredPlanObj?.item_id
              false
            ) {
            } else {
              alert("featured success");
              // subcriptionHandler(item);
            }
          }}
        >
          <p className={`text-xs text-white font-medium font-inter capitalize`}>
            {
              // loggedinUser?.item_id?.id === featuredPlanObj?.item_id
              false ? (
                <BadgeCheckIcon
                  className={`
								text-white w-4 h-4 inline-block mr-2`}
                />
              ) : (
                ""
              )
            }
            get slot
          </p>
          <p
            className={`text-sm text-white font-medium font-inter capitalize`}
          >{`${
            featuredPlanObj?.slot_price > 0
              ? `$${featuredPlanObj?.slot_price}`
              : "Free"
          }`}</p>
        </div>

        <div
          className={`bg-white border border-light-blue-100 rounded-md flex flex-row items-center justify-center p-3 my-1.5 cursor-pointer`}
          onClick={openFeaturedHandler}
        >
          <p
            className={`text-xs text-dark-bluish-500 font-medium font-inter text-center capitalize`}
          >
            see example
          </p>
        </div>

        {isOpenModal == true ? (
          <FeaturedDemoModal
            closeModalHandler={closeModalHandler}
            isOpenModal={isOpenModal}
          />
        ) : (
          ""
        )}
      </div>
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
