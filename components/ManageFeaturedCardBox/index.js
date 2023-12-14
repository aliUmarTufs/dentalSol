import moment from "moment";
import { useState } from "react";
import { DATE_TIME_FORMAT5, ROUTES } from "../../constants";
import FeaturedDemoModal from "../FeaturedDemoModal";

export default function ManageFeaturedCardBox({ featuredPlanObj, planStatus }) {
  var featuredDate = moment(featuredPlanObj?.created_at);
  const now = moment();
  // console.log({now});
  //   const diff = now.diff(featuredDate, "hours");
  //   console.log({diff});

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
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="w-12 overflow-hidden border border-black border-opacity-20 rounded-lg">
            <img
              src={`${
                featuredPlanObj?.itemDetail?.thumbnail ||
                featuredPlanObj?.itemDetail?.image ||
                featuredPlanObj?.itemDetail?.logo
                  ? featuredPlanObj?.itemDetail?.thumbnail ||
                    featuredPlanObj?.itemDetail?.image ||
                    featuredPlanObj?.itemDetail?.logo
                  : // : entityType?.key == "courses"
                    // ? "/courseFallBackImg.png"
                    // : entityType?.key != "products"
                    // ? "/productFallBackImg.png"
                    "/serviceFallBackImg.png"
              }`}
              className="h-auto w-12 object-cover"
            />
          </div>

          <h4 className="text-sm text-light-blue-800 font-normal font-inter capitalize textTruncateTwo flex-2">
            {featuredPlanObj?.itemDetail?.name ||
              featuredPlanObj?.itemDetail?.title ||
              featuredPlanObj?.itemDetail?.company_name}
            {/* {featuredPlanObj?.slot_id?.slot_name} */}
          </h4>
        </div>
        <h6
          className={`rounded-full px-5 py-2 text-xs font-normal font-inter capitalize bg-opacity-10 ${
            planStatus == "active"
              ? "bg-dark-bluish-500 text-dark-bluish-500"
              : "bg-dark-red-900 text-dark-red-900"
          }`}
        >
          {planStatus}
        </h6>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <h3 className="text-lg text-bluish-600 font-bold font-inter normal-case">
          {/* {`Slot ${featuredPlanObj?.slotNumber}`} */}
          {featuredPlanObj?.slot_id?.slot_name}
        </h3>
        <h6 className="text-sm text-light-blue-800 font-medium font-inter normal-case">
          {`Slot Position : ${featuredPlanObj?.slot_id?.slot_position}`}
        </h6>
        <h6 className="text-sm text-light-blue-800 font-medium font-inter normal-case">
          {`Featured for ${featuredPlanObj?.slot_id?.slot_hours} hours`}
        </h6>

        <h6 className="text-xs text-light-blue-800 font-medium font-inter normal-case">
          {moment(featuredPlanObj?.created_at).format(DATE_TIME_FORMAT5)}
        </h6>
      </div>

      <hr className="w-4/5 h-px mx-auto mt-6 mb-5 bg-greyish-400 bg-opacity-10 border-0 rounded" />

      <div className="flex flex-col gap-3">
        {planStatus == "expire" ? (
          <>
            <a
              href={`${ROUTES.GET_FEATURED}/${featuredPlanObj?.item_type}/${featuredPlanObj?.item_id}?slot_id=${featuredPlanObj?.slot_id?.id}`}
            >
              <div
                className={`bg-dark-bluish-500 rounded-md flex flex-row items-center justify-between p-3 my-1.5" ${
                  // loggedinUser?.item_id?.id === featuredPlanObj?.item_id
                  false ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <p
                  className={`text-xs text-white font-medium font-inter capitalize`}
                >
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
                  get slot again
                </p>
                <p
                  className={`text-sm text-white font-medium font-inter capitalize`}
                >{`${
                  featuredPlanObj?.slot_id?.slot_price > 0
                    ? `$${featuredPlanObj?.slot_id?.slot_price}`
                    : "Free"
                }`}</p>
              </div>
            </a>
          </>
        ) : (
          ""
        )}

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
  );
}
