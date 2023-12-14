import {
  Navbar,
  Footer,
  HeadMeta,
  ResourcesFilterList,
  PageTitleInfo,
  FilterSearchBox,
  CardBox,
  CustomButton,
  AlertBox,
  CategorizedHits,
  CustomStats,
} from "../../../components";
import { useState, useEffect } from "react";
import {
  InstantSearch,
  Configure,
  connectStats,
  connectInfiniteHits,
} from "react-instantsearch-dom";
import { useRouter } from "next/router";
import { algoliaClient } from "../../../lib/algoliaClient";
import { supabase } from "../../../lib/supabaseClient";
import _ from "lodash";
import { BASE_URL, ENTITY_TYPE } from "../../../constants";
import { BeatLoader } from "react-spinners";

export default function CategorizedCourses() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const coursesFunc = async () => {
      const cou = await supabase
        .from("courses")
        .select("*")
        .eq("category", router.query.id)
        .then(({ error, data }) => {
          if (error) throw error;
          setCourses(data);
        })
        .catch(console.error);
    };
    coursesFunc();
  }, []);

  return (
    <>
      <HeadMeta
        title={`Dent247 | Courses | ${router?.query?.id ?? "Loading"}`}
        description="description"
        content={`Dent247 | Courses | ${router?.query?.id ?? "Loading"}`}
      />
      <div>
        <Navbar isPageTitleInfo={true} />
        <PageTitleInfo title={`${router?.query?.id}`} />

        <div className="bg-light-blue">
          <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-8 md:pt-16 lg:pt-24 pb-8 md:pb-12 lg:pb-20">
            <h6 className="text-sm sm:text-lg font-medium text-black mb-5 capitalize">
              {`Courses`} &gt;
              <span className="text-blue-600"> {`${router?.query?.id}`}</span>
            </h6>
            <InstantSearch searchClient={algoliaClient} indexName="ce_courses">
              <Configure
                filters={`category:"${router.query.id}" AND is_approved:1`}
              />

              <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                <div className="p-5 rounded-2xl w-full md:w-72 h-full bg-bluish-300">
                  <FilterSearchBox />
                  <div className="mb-10">
                    <span className="text-sm text-purplish-800 font-medium">
                      Country
                    </span>
                    <ResourcesFilterList attribute="country" />
                  </div>
                  <div className="mb-10">
                    <span className="text-sm text-purplish-800 font-medium">
                      Mode
                    </span>
                    <ResourcesFilterList attribute="price_mode" />
                  </div>
                  <div className="mb-10">
                    <span className="text-sm text-purplish-800 font-medium">
                      Course Mode
                    </span>
                    <ResourcesFilterList attribute="course_mode" />
                  </div>
                  <div className="mb-10">
                    <span className="text-sm text-purplish-800 font-medium">
                      Rating
                    </span>
                    <ResourcesFilterList attribute="rating" type="rating" />
                  </div>
                </div>
                <CustomStats setStats={setStats} />
                <div className="flex-1">
                  <CategorizedHits
                    entityType={ENTITY_TYPE.COURSES}
                    stats={stats}
                  />
                </div>
              </div>
            </InstantSearch>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

