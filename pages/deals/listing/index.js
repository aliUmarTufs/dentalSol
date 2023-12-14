import _ from "lodash";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  Configure,
  connectInfiniteHits,
  InstantSearch,
} from "react-instantsearch-dom";
import {
  AlertBox,
  CardBox,
  CustomButton,
  DealsHits,
  Footer,
  HeadMeta,
  Navbar,
  PageTitleInfo,
  ResourcesFilterList,
} from "../../../components";
import { MainContext } from "../../../context-api/MainContext";
import { algoliaClient } from "../../../lib/algoliaClient";

export default function DealsListing() {
  const router = useRouter();

  return (
    <>
      <HeadMeta
        title={`Dent247 | Deals Listing | ${router.query.type}`}
        description="description"
        content={`Dent247 | Deals Listing | ${router.query.type}`}
      />
      <Navbar isPageTitleInfo={true} />

      <PageTitleInfo title={`${router.query.type} deals`} />

      {/* Similar Courses Deals */}
      <div className="bg-light-blue">
        <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
          <InstantSearch searchClient={algoliaClient} indexName="deals">
            <Configure
              filters={`is_expire:0 AND type:${router.query.type} AND is_approved:true`}
            />
            <div className="flex flex-col md:flex-row gap-12 md:gap-20">
              <div className="p-5 rounded-2xl w-full md:w-72 h-full bg-bluish-300">
                <span className="text-sm font-medium text-purplish-800">
                  Country
                </span>
                <ResourcesFilterList attribute="country" />
              </div>
              <div className="flex-1">
                <AllDealsHits />
              </div>
            </div>
          </InstantSearch>
        </div>
      </div>

      <Footer />
    </>
  );
}

export const AllDealsHits = connectInfiniteHits(
  ({ hits, hasMore, refineNext }) => {
    const [isFavouriteDeal, setIsFavouriteDeal] = useState(false);
    const [loggedinUser, setLoggedinUser] = useState(null);
    const [addFav, setAddFav] = useState([]);
    const { MainState, dispatch } = useContext(MainContext);

    useEffect(() => {}, [addFav]);
    useEffect(() => {
      //   const userDetails = localStorage.getItem("userData");
      //   const parseUserData = JSON.parse(userDetails);
      const userDetails = MainState?.userData;
      const parseUserData = userDetails;
      if (parseUserData) {
        setLoggedinUser(parseUserData);
      }
    }, [MainState?.userData]);
    return _.size(hits) > 0 ? (
      <>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-6 xl:grid-cols-3">
          {hits.map((item) => (
            <CardBox
              objectType={item}
              key={item.type}
              isFavourite={isFavouriteDeal}
              setIsFavourite={setIsFavouriteDeal}
              userID={loggedinUser?.id}
              setFav={setAddFav}
              addFavList={addFav}
              type={item.type}
              customCssClass={`lg:w-full`}
              dataSource={"algolia"}
              isDeal={true}
            />
          ))}
        </div>

        {hasMore && (
          <CustomButton
            btnText={"View more"}
            clickHandler={refineNext}
            isPrimary={true}
          />
        )}
      </>
    ) : (
      <AlertBox type={"info"} text="No Listing Found." />
    );
  }
);
