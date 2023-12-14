import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { connectInfiniteHits } from "react-instantsearch-dom";
import Slider from "react-slick/lib/slider";
import { dealsSliderSettings, getLoggedInUser, ROUTES } from "../../constants";
import { CardBox, CustomButton } from "../../components";
import { MainContext } from "../../context-api/MainContext";

export default function DealsSection({ hits, type, showBtn }) {
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

  const filteredHits = _.filter(hits, (item) => {
    return item.type === type;
  });
  return (
    <>
      <div
        className={`${
          _.size(filteredHits) >= 4 ? `flex` : `grid`
        } grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-6 lg:grid-cols-3 xl:grid-cols-4`}
      >
        {!_.isEmpty(filteredHits) ? (
          _.size(filteredHits) >= 4 ? (
            <Slider
              {...dealsSliderSettings}
              className={"w-full courseSliderWrap"}
            >
              {filteredHits?.map((course) => {
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
                    dataSource={"algolia"}
                    isDeal={true}
                  />
                );
              })}
            </Slider>
          ) : (
            filteredHits?.map((course) => {
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
                  dataSource={"algolia"}
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

      {!_.isEmpty(filteredHits) && showBtn ? (
        <div className="flex justify-end mt-6 md:mt-10 lg:mt-14 lg:mr-8">
          <CustomButton
            redirectURL={`${ROUTES.DEALS_LISTING}/?type=${type}`}
            btnText="See All"
            isPrimary={true}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export const DealsHits = connectInfiniteHits(DealsSection);
