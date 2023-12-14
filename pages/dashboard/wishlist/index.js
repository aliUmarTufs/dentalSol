import {
  Navbar,
  CardBox,
  CustomButton,
  AlertBox,
  HeadMeta,
} from "../../../components";
import { useContext, useEffect, useState } from "react";
import { BASE_URL, getLoggedInUser, ROUTES } from "../../../constants";
import _ from "lodash";
import {
  Configure,
  connectInfiniteHits,
  InstantSearch,
} from "react-instantsearch-dom";
import { algoliaClient } from "../../../lib/algoliaClient";
import { BeatLoader } from "react-spinners";
import { Router, useRouter } from "next/router";
import { MainContext } from "../../../context-api/MainContext";

export default function Wishlist() {
  const [loggedinUser, setLoggedinUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    let LoggedInUserData = async () => {
      let getuser = await getLoggedInUser();
      if (!_.isNull(getuser)) {
        setLoggedinUser(JSON.parse(getuser));
      } else {
        setLoggedinUser(false);
        router.push(ROUTES.LOGIN);
      }
    };

    LoggedInUserData();
  }, []);

  return (
    <>
      <HeadMeta
        title="Dent247 | Dashboard | Wishlist"
        description="description"
        content="Dent247 | Dashboard | Wishlist"
      />
      {_.isNull(loggedinUser) || !loggedinUser ? (
        <div className="my-2 flex justify-center w-full h-screen items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <div className="relative">
          <Navbar isDashboard={true} />
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 mt-44">
              <div className="">
                <h1 className="text-2xl font-bold"> Wishlist </h1>
              </div>
              <div className="max-w-7xl mx-auto  my-8 md:my-12 lg:my-10">
                <InstantSearch searchClient={algoliaClient} indexName="deals">
                  <Configure
                    hitsPerPage={10}
                    filters={`is_expire:0 AND favUsers:${loggedinUser?.id}`}
                  />
                  <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                    <div className="flex-1">
                      <WishListDealsHits />
                    </div>
                  </div>
                </InstantSearch>{" "}
              </div>
            </div>
          </div>
        </div>
      )}
      ;
    </>
  );
}

export const WishListDealsHits = connectInfiniteHits(
  ({ hits, hasMore, refineNext }) => {
    const [isFavouriteDeal, setIsFavouriteDeal] = useState(false);
    const [loggedinUser, setLoggedinUser] = useState(null);
    const [addFav, setAddFav] = useState([]);
    const { MainState, dispatch } = useContext(MainContext);

    useEffect(() => {}, [addFav]);
    useEffect(() => {
      // const userDetails = localStorage.getItem("userData");
      // const parseUserData = JSON.parse(userDetails);

      const userDetails = MainState?.userData;
      const parseUserData = userDetails;

      setLoggedinUser(parseUserData);
    }, []);
    return _.size(hits) > 0 ? (
      <>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-6 xl:grid-cols-4">
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

export async function getServerSideProps() {
  return {
    props: {
      isProtected: true,
    },
  };
}
