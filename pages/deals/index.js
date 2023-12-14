import Link from "next/link";
import Slider from "react-slick/lib/slider";
import ReactStars from "react-stars";
import {
  Footer,
  HeadMeta,
  Navbar,
  PageTitleInfo,
  DealsHits,
  HeroSection,
} from "../../components";
import {
  BASE_URL,
  courseSliderSettings,
  dealsSliderSettings,
  ROUTES,
} from "../../constants";
import _ from "lodash";
import { algoliaClient } from "../../lib/algoliaClient";
import { Configure, InstantSearch } from "react-instantsearch-dom";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { BeatLoader } from "react-spinners";
import { Markup } from "interweave";
import { MainContext } from "../../context-api/MainContext";

export default function Deals({ pageData }) {
  const [url, setUrl] = useState(null);
  const { MainState, dispatch } = useContext(MainContext);

  const [todayDate, setTodayDate] = useState(null);
  const [loading, setLoading] = useState(true);
  let router = useRouter();

  const updateData = async () => {
    let yourDate = new Date();
    let payload = {
      date: yourDate.toISOString().split("T")[0],
    };
    fetch(`${BASE_URL}/api/deals/expire`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response?.status === true) {
          setLoading(false);
          let urlHref = localStorage.getItem("url");
          if (urlHref) {
            localStorage.removeItem("url");
            router.reload();
          } else {
            localStorage.setItem("url", location.href);
          }
        }
      });
  };

  useEffect(() => {
    let yourDate = new Date();

    updateData();
  }, []);

  const descriptionOfHeroSection = () => {
    return (
      // <p className="font-medium font-poppins text-blackish-700 text-base leading-relaxed my-2 w-11/12">
      <p className="text-center font-medium font-poppins text-blackish-700 text-base leading-relaxed my-2 w-full">
        <span className="text-blue-600 capitalize md:text-3xl font-extrabold md:font-black">
          <Markup content={pageData?.data?.section?.description_one} />
        </span>
      </p>
    );
  };

  return (
    <>
      <HeadMeta
        title={"Dent247 | Deals"}
        description="description"
        content={"Dent247 | Deals"}
      />
      <Navbar />

      {/* Similar Courses Deals */}
      <div className="bg-light-blue">
        <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
          <HeroSection
            // title={"Dent247 Deals Search Engine"}
            title={pageData?.data?.section?.title}
            heroImg={"/Deals.png"}
            descOne={`Black Friday throughout the year.`}
            desc={descriptionOfHeroSection}
          />
          <hr className="my-12" />
          {loading ? (
            <div className="my-2 flex justify-center w-full h-screen items-center">
              <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
            </div>
          ) : (
            <>
              <h3 className="capitalize text-gray-900 font-bold text-2xl md:text-3xl my-8 md:my-12">
                {`Course deals`}
              </h3>
              <InstantSearch searchClient={algoliaClient} indexName="deals">
                <Configure
                  hitsPerPage={6}
                  filters={`is_expire:0 AND type:courses AND is_approved:true`}
                />
                <DealsHits type={"courses"} showBtn={true} />
              </InstantSearch>

              <h3 className="capitalize text-gray-900 font-bold text-2xl md:text-3xl my-8 md:my-12">
                {`Product deals`}
              </h3>
              <InstantSearch searchClient={algoliaClient} indexName="deals">
                <Configure
                  hitsPerPage={6}
                  filters={`is_expire:0 AND type:products AND is_approved:true`}
                />
                <DealsHits type={"products"} showBtn={true} />
              </InstantSearch>

              <h3 className="capitalize text-gray-900 font-bold text-2xl md:text-3xl my-8 md:my-12">
                {`Service deals`}
              </h3>
              <InstantSearch searchClient={algoliaClient} indexName="deals">
                <Configure
                  hitsPerPage={6}
                  filters={`is_expire:0 AND type:services AND is_approved:true`}
                />
                <DealsHits type={"services"} showBtn={true} />
              </InstantSearch>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${BASE_URL}/api/section?type=deals`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { pageData: data } };
}
