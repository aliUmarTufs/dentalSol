import {
  ArrowLeftIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/solid";
import { useContext, useEffect, useState } from "react";
import { connectInfiniteHits } from "react-instantsearch-dom";
import Slider from "react-slick/lib/slider";
import {
  courseSliderSettings,
  dealsSliderSettings,
  NOT_FOUND,
  ROUTES,
} from "../../constants";
import _ from "lodash";
import Link from "next/link";
import ReactStars from "react-stars";
import { CardBox } from "../../components";
import { BeatLoader } from "react-spinners";
import { MainContext } from "../../context-api/MainContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function ResourceSlider({
  hits,
  hasMore,
  refineNext,
  type,
  title,
  relateditems,
}) {
  const [isFavouriteDeal, setIsFavouriteDeal] = useState(false);
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [addFav, setAddFav] = useState([]);
  const { MainState, dispatch } = useContext(MainContext);

  useEffect(() => {}, [addFav]);
  useEffect(() => {
    // const userDetails = localStorage.getItem("userData");
    // const parseUserData = JSON.parse(userDetails);
    const parseUserData = MainState?.userData;

    setLoggedinUser(parseUserData);
  }, []);

  if (relateditems?.length < 4) {
    if (relateditems?.length != 0) {
      dealsSliderSettings.slidesToShow = relateditems.length;
    }
  } else {
    dealsSliderSettings.slidesToShow = 4;
  }
  return (
    <div className="mt-8 mb-4">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 my-6">
        Featured <span className="text-blue-600 xl:inline">{title}</span>
      </h2>
      {_.isUndefined(relateditems) ? (
        <div className="my-2 flex justify-start items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <div
          className={`${
            _.size(relateditems) >= 4 ? `flex` : `grid`
          } grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-6 lg:grid-cols-3 xl:grid-cols-4`}
        >
          {!_.isEmpty(relateditems) ? (
            _.size(relateditems) >= 4 ? (
              <Slider
                {...dealsSliderSettings}
                className={"w-full courseSliderWrap"}
              >
                {relateditems?.map((course) => {
                  return (
                    <CardBox
                      objectType={course}
                      key={course.type}
                      isFavourite={isFavouriteDeal}
                      setIsFavourite={setIsFavouriteDeal}
                      userID={loggedinUser?.id}
                      setFav={setAddFav}
                      addFavList={addFav}
                      type={type}
                      customCssClass={`md:w-11/12`}
                      dataSource={"supabase"}
                    />
                  );
                })}
              </Slider>
            ) : (
              relateditems?.map((course) => {
                return (
                  <CardBox
                    objectType={course}
                    key={course.type}
                    isFavourite={isFavouriteDeal}
                    setIsFavourite={setIsFavouriteDeal}
                    userID={loggedinUser?.id}
                    setFav={setAddFav}
                    addFavList={addFav}
                    type={type}
                    customCssClass={`md:w-11/12`}
                    dataSource={"supabase"}
                    isDeal={true}
                  />
                );
              })
            )
          ) : (
            <h6 className="text-lg text-gray-900 font-normal flex items-center">
              Coming Soon.
            </h6>
          )}
        </div>
      )}
    </div>
  );
}

export const ResourceHits = connectInfiniteHits(ResourceSlider);
