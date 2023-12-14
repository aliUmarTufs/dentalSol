import { Dialog, Transition } from "@headlessui/react";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import _ from "lodash";
import { Fragment, useState, useEffect, useContext } from "react";
import {
  HeadMeta,
  Navbar,
  FeaturedDemoModal,
  AlertBox,
  DateTimePickerModal,
} from "../../../components";
import { BASE_URL, ROUTES, Toast } from "../../../constants";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/router";
import { MainContext } from "../../../context-api/MainContext";

export default function GetFeatured({
  typeSlotsList,
  itemType,
  isComplete,
  isSlotDetails,
}) {
  const { MainState, dispatch } = useContext(MainContext);

  const [slotsList, setSlotsList] = useState(typeSlotsList);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [user, setUser] = useState(null);
  const [isFeaturedItem, setIsFeaturedItem] = useState(false);
  const [isSuccessLoading, setIsSuccessLoading] = useState(false);
  const router = useRouter();

  const fetchUser = () => {
    // const userDetails = localStorage.getItem("userData");
    // const parseUserData = JSON.parse(userDetails);
    const userDetails = MainState?.userData;
    const parseUserData = userDetails;

    if (!_.isNull(userDetails)) {
      setUser(parseUserData);
      setIsLoggedInUser(true);
      if (!isComplete) {
        router.push(ROUTES.ITEMS);
      }
      let getLocalFeaturedItem = localStorage.getItem("featured_item");
      console.log({ getLocalFeaturedItem });
      if (getLocalFeaturedItem) {
        setIsFeaturedItem(true);
      }
    } else {
      setUser(false);
      setIsLoggedInUser(false);
      router.push(ROUTES.LOGIN);
    }
  };
  const purchaseSuccessfull = async () => {
    setIsSuccessLoading(true);
    fetch(`${BASE_URL}/api/slots/item/booked`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user?.id,
        slot_id: router?.query?.slot,
        item_id: router?.query?.type[1],
        item_type: router?.query?.type[0],
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status == true) {
          setIsSuccessLoading(false);
          localStorage.removeItem("featured_item");
          setIsFeaturedItem(false);

          Toast.fire({
            icon: `${"success"}`,
            title: "Your transaction has been done.",
          });

          router.push(ROUTES.MANAGE_FEATURED);
        } else {
        }
      });
  };
  useEffect(() => {
    console.log("Log Outer");

    if (
      !_.isEmpty(router?.query?.mode) &&
      !_.isEmpty(router?.query?.slot) &&
      router?.query?.success == "true" &&
      isLoggedInUser &&
      isFeaturedItem
    ) {
      if (
        router?.query?.mode == "featuredItem" &&
        router?.query?.success == "true" &&
        isFeaturedItem
      ) {
        console.log("Log Inner", { isFeaturedItem });

        purchaseSuccessfull();
      }
    }
  }, [router, isFeaturedItem, isLoggedInUser]);

  useEffect(() => {
    fetchUser();
  }, []);

  return _.isNull(user) || user == false ? (
    <div className="my-2 flex justify-center w-full h-screen items-center">
      <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
    </div>
  ) : (
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
              {isSlotDetails ? (
                _.size(slotsList) == 0 ? (
                  <div className="w-full flex-col gap-6 items-center justify-center my-3 sm:my-5">
                    <AlertBox
                      type={"info"}
                      text={"This slot is already booked."}
                    />
                  </div>
                ) : (
                  slotsList?.map((item, index) => {
                    return (
                      <FeaturedCard
                        key={index}
                        loggedinUser={user}
                        featuredPlanObj={item}
                        itemType={itemType}
                      />
                    );
                  })
                )
              ) : _.size(slotsList) > 0 ? (
                slotsList?.map((item, index) => {
                  return (
                    <FeaturedCard
                      key={index}
                      loggedinUser={user}
                      featuredPlanObj={item}
                      itemType={itemType}
                    />
                  );
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

function FeaturedCard({ featuredPlanObj, loggedinUser, itemType }) {
  const router = useRouter();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenPickerModal, setIsOpenPickerModal] = useState(false);
  const [loadFeaturedSlot, setLoadFeaturedSlot] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

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

  /* openPickerModalHandler function */
  const openDateTimePickerHandler = () => {
    setIsOpenPickerModal(true);
    // document.documentElement.style.overflow = `auto`;
  };

  /* closePickerModalHandler function */
  const closeDateTimePickerHandler = () => {
    setIsOpenPickerModal(false);
    // document.body.style.overflow = "auto";
    document.documentElement.style.overflow = `initial`;
  };

  const getFeaturedSlot = () => {
    setLoadFeaturedSlot(true);
    let payload = {
      slot_id: featuredPlanObj?.id,
      user_id: loggedinUser?.id,
      item: itemType?.type,
      item_id: itemType?.id,
    };

    fetch(`${BASE_URL}/api/slots/item/featured`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response?.status === true) {
          localStorage.setItem("featured_item", "in_process");
          router.push(response?.data?.url);
        } else {
          Toast.fire({
            icon: `${"error"}`,
            title: `${response?.message}`,
          });
        }
        setLoadFeaturedSlot(false);
      });
  };

  const bookedFeaturedSlot = () => {
    let payload = {
      user_id: loggedinUser?.id,
      slot_id: featuredPlanObj?.id,
      item_id: itemType?.id,
      item_type: itemType?.type,
    };
  };

  return (
    <div className="bg-white border border-dark-bluish-500 shadow-4xl border-opacity-10 rounded-lg p-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between gap-2">
          <h4 className="text-base text-bluish-600 font-bold font-inter capitalize">
            {featuredPlanObj?.slot_name}
          </h4>
          {/* {featuredPlanObj?.is_available === false ? ( */}
          <img src="/available-tag.png" className="w-8 h-8" />
          {/* ) : null} */}
        </div>
        <h6 className="text-sm text-light-blue-800 font-medium font-inter normal-case">
          {`Featured for ${featuredPlanObj?.slot_hours || 24} hours`}
        </h6>
        <h6 className="text-sm text-light-blue-800 font-medium font-inter normal-case">
          {`Slot Position : ${featuredPlanObj?.slot_position || 0}`}
        </h6>
      </div>

      <hr className="w-4/5 h-px mx-auto mt-6 mb-5 bg-greyish-400 bg-opacity-10 border-0 rounded" />

      <div className="flex flex-col gap-3">
        <div
          className={`bg-dark-bluish-500 rounded-md flex flex-row items-center justify-between p-3 my-1.5" ${
            // loggedinUser?.item_id?.id === featuredPlanObj?.item_id
            loadFeaturedSlot ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          // onClick={() => {
          // 	if (
          // 		// loggedinUser?.item_id?.id === featuredPlanObj?.item_id
          // 		loadFeaturedSlot
          // 	) {
          // 		undefined;
          // 	} else {
          // 		// alert("featured success");
          // 		getFeaturedSlot();
          // 		// subcriptionHandler(item);
          // 	}
          // }}
          onClick={openDateTimePickerHandler}
        >
          <p className={`text-xs text-white font-medium font-inter capitalize`}>
            {featuredPlanObj?.is_available === false ? "pre book" : "book now"}
          </p>
          {isOpenPickerModal == true ? (
            <DateTimePickerModal
              closeModalHandler={closeDateTimePickerHandler}
              isOpenModal={isOpenPickerModal}
              startDate={startDate}
              setStartDate={setStartDate}
            />
          ) : (
            ""
          )}
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

export async function getServerSideProps(context) {
  let slotData = [];
  let isComplete = false;
  let isSlotDetails = false;
  let itemObj = { type: null, id: null };
  if (context?.params?.type?.length > 1) {
    let payload = { slot_type: context?.params?.type[0] };
    if (context?.query?.slot_id) {
      payload.slot_id = context?.query?.slot_id;
      isSlotDetails = true;
    }
    const res = await fetch(`${BASE_URL}/api/slots/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data?.status === true) {
      slotData = data?.data;
      isComplete = true;
      itemObj.id = context?.params?.type[1];
      itemObj.type = context?.params?.type[0];
    }
  }

  return {
    props: {
      typeSlotsList: slotData,
      itemType: itemObj,
      isComplete: isComplete,
      isSlotDetails,
      isProtected: true,
    },
  };
}
