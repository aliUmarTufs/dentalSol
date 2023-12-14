import { useContext, useEffect, useState } from "react";
import Slider from "react-slick/lib/slider";
import { dealsSliderSettings, NOT_FOUND } from "../../constants";
import { CardBox } from "../../components";
import _ from "lodash";
import AlertBox from "../AlertBox";
import { BeatLoader } from "react-spinners";
import { MainContext } from "../../context-api/MainContext";

export default function RelatedSlider({
  title,
  sliderType,
  sliderArr,
  isRelated,
  loadSuccess,
}) {
  const [isFavouriteDeal, setIsFavouriteDeal] = useState(false);
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [addFav, setAddFav] = useState([]);
  const { MainState, dispatch } = useContext(MainContext);

  useEffect(() => {
    // const userDetails = localStorage.getItem("userData");
    // const parseUserData = JSON.parse(userDetails);
    const parseUserData = MainState?.userData;

    setLoggedinUser(parseUserData);
  }, []);

  if (sliderArr?.length < 4) {
    if (sliderArr?.length != 0) {
      dealsSliderSettings.slidesToShow = sliderArr.length;
    }
  } else {
    dealsSliderSettings.slidesToShow = 4;
  }
  return (
    <div className="flex flex-col gap-6 mt-8 mb-4">
      <div className="flex flex-col gap-4 my-3">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 capitalize">
          Related {title}
        </h2>
        {isRelated === true ? (
          <p className="font-normal font-poppins font-normal text-black text-sm">{`View the most recent ${title}.`}</p>
        ) : (
          ""
        )}
      </div>
      {!loadSuccess ? (
        <div className="flex justify-start items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <div
          className={`${
            _.size(sliderArr) >= 4 ? `flex` : `grid`
          } grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-6 lg:grid-cols-3 xl:grid-cols-4`}
        >
          {!_.isEmpty(sliderArr) ? (
            _.size(sliderArr) >= 4 ? (
              <Slider
                {...dealsSliderSettings}
                className={"w-full courseSliderWrap"}
              >
                {sliderArr.map((relSliderType) => (
                  <CardBox
                    objectType={relSliderType}
                    key={relSliderType?.id}
                    isFavourite={isFavouriteDeal}
                    setIsFavourite={setIsFavouriteDeal}
                    userID={loggedinUser?.id}
                    setFav={setAddFav}
                    addFavList={addFav}
                    type={sliderType}
                    customCssClass={`md:w-11/12`}
                    dataSource={"supabase"}
                  />
                ))}
              </Slider>
            ) : (
              sliderArr.map((relSliderType) => {
                return (
                  <CardBox
                    objectType={relSliderType}
                    key={relSliderType?.id}
                    isFavourite={isFavouriteDeal}
                    setIsFavourite={setIsFavouriteDeal}
                    userID={loggedinUser?.id}
                    setFav={setAddFav}
                    addFavList={addFav}
                    type={sliderType}
                    customCssClass={`md:w-11/12`}
                    dataSource={"supabase"}
                  />
                );
              })
            )
          ) : (
            <AlertBox text={"Coming Soon."} type={"info"} />
          )}
        </div>
      )}
    </div>
  );
}
