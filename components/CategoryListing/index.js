import _ from "lodash";
import { useEffect, useState } from "react";
import { connectInfiniteHits } from "react-instantsearch-dom";
import Slider from "react-slick/lib/slider";
import { BeatLoader } from "react-spinners";
import { CategoryCardBox } from "../../components";
import { dealsSliderSettings, ENTITY_TYPE, ROUTES } from "../../constants";
import AlertBox from "../AlertBox";
import CustomButton from "../CustomButton";

export default function CategoryListing({ hits, categoryType, entityType }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    !_.isEmpty(hits) && setLoading(false);
  }, [hits]);

  if (hits?.length < 4) {
    if (hits?.length != 0) {
      dealsSliderSettings.slidesToShow = hits.length;
    }
  } else {
    dealsSliderSettings.slidesToShow = 4;
  }

  const filteredHits = _.filter(hits, (items) => {
    if (items.type === categoryType) return items;
  });

  return (
    <>
      <div className="flex flex-col gap-6 md:gap-8">
        <h2 className="font-poppins font-semibold text-blackish-700 text-2xl md:text-3xl capitalize">
          {categoryType} Category
        </h2>
        {loading ? (
          <div className="my-2 flex justify-center items-center">
            <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
          </div>
        ) : (
          <>
            <div
              className={`bg-transparent pt-2 mt-0 transition-opacity duration-1000 opacity-100 ${
                _.size(filteredHits) >= 4 ? "flex" : "grid"
              } grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8`}
            >
              {_.size(filteredHits) >= 4 ? (
                <Slider
                  {...dealsSliderSettings}
                  className={"w-full categorySliderWrap"}
                >
                  {filteredHits.map((hit, index) => (
                    <CategoryCardBox
                      objectType={hit}
                      key={index}
                      type={entityType}
                    />
                  ))}
                </Slider>
              ) : (
                filteredHits.map((hit, index) => (
                  <CategoryCardBox
                    objectType={hit}
                    key={index}
                    type={entityType}
                  />
                ))
              )}
            </div>

            {_.size(filteredHits) === 0 ? (
              <AlertBox type={"info"} text="No Listing Found." />
            ) : (
              ""
            )}

            {!_.isEmpty(filteredHits) ? (
              <div className="flex justify-end mt-3 md:mt-6 lg:mr-8">
                <CustomButton
                  redirectURL={`${
                    entityType === ENTITY_TYPE.ARTICLES ? "library" : entityType
                  }/${ROUTES.CATEGORY_LISTING}/?type=${categoryType}`}
                  btnText="See All"
                  isPrimary={true}
                />
              </div>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </>
  );
}

export const CategoryHits = connectInfiniteHits(CategoryListing);
