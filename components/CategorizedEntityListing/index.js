import _ from "lodash";
import { useState } from "react";
import { connectInfiniteHits, connectStats } from "react-instantsearch-dom";
import { BeatLoader } from "react-spinners";
import AlertBox from "../AlertBox";
import CardBox from "../CardBox";
import CustomButton from "../CustomButton";

function Hits({ hits, hasMore, refineNext, stats, entityType }) {
  const [isFavouriteDeal, setIsFavouriteDeal] = useState(false);
  const [addFav, setAddFav] = useState([]);
  let hs = !_.isNull(stats)
    ? stats > 0
      ? hits?.length > 0
        ? false
        : true
      : stats == 0
      ? false
      : true
    : true;

  return (
    <>
      {_.isEmpty(hits) && hs ? (
        <div className="flex justify-center items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <>
          {hits?.length > 0 && !hs ? (
            <div className="grid grid-cols-1 gap-y-4 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 sm:grid-cols-2">
              {hits?.map((hit) => (
                <div key={hit.objectID || hit.id}>
                  <CardBox
                    objectType={hit}
                    key={hit.id || hit.objectID}
                    isFavourite={isFavouriteDeal}
                    setIsFavourite={setIsFavouriteDeal}
                    userID={"1"}
                    setFav={setAddFav}
                    addFavList={addFav}
                    type={entityType}
                    customCssClass={`md:w-11/12`}
                    dataSource={"algolia"}
                  />
                </div>
              ))}
            </div>
          ) : (
            // <AlertBox type={"info"} text={`No ${entityType} Found.`} />
            <AlertBox type={"info"} text={`Coming Soon.`} />
          )}

          {hasMore && (
            <div className="flex items-center justify-center mt-8 md:mt-16">
              <CustomButton
                btnText={"View more"}
                clickHandler={refineNext}
                isPrimary={true}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export const CategorizedHits = connectInfiniteHits(Hits);

function EntityStats({ nbHits, setStats }) {
  setStats(nbHits);
  return <></>;
}

export const CustomStats = connectStats(EntityStats);
