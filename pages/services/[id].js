import {
  Navbar,
  Footer,
  HeadMeta,
  PageTitleInfo,
  FilterSearchBox,
  ResourcesFilterList,
  AlertBox,
  CardBox,
  CustomButton,
  CategorizedHits,
  CustomStats,
} from "../../components";

import {
  InstantSearch,
  Configure,
  connectInfiniteHits,
} from "react-instantsearch-dom";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { algoliaClient } from "../../lib/algoliaClient";
import { BASE_URL, ENTITY_TYPE, ROUTES } from "../../constants";

export default function CategorizedServices() {
  const [stats, setStats] = useState(null);
  const router = useRouter();
  return (
    <>
      <HeadMeta
        title={`Dent247 | Services | ${router?.query?.id ?? "Loading"}`}
        description="description"
        content={`Dent247 | Services | ${router?.query?.id ?? "Loading"}`}
      />
      <div>
        <Navbar isPageTitleInfo={true} />
        <PageTitleInfo title={`${router?.query?.id}`} />
        <div className="bg-light-blue">
          <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-8 md:pt-16 lg:pt-24 pb-8 md:pb-12 lg:pb-20">
            <h6 className="text-sm sm:text-lg font-medium text-black mb-5 capitalize">
              {`Services`} &gt;
              <span className="text-blue-600"> {`${router?.query?.id}`}</span>
            </h6>
            <InstantSearch
              searchClient={algoliaClient}
              indexName="directory_companies"
            >
              <Configure
                filters={`category_name:'${router.query.id}' AND is_approved:1`}
              />
              <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                <div className="p-5 rounded-2xl w-full md:w-72 h-full bg-bluish-300">
                  <FilterSearchBox />
                  <div className="mb-10">
                    <span className="text-sm font-medium text-purplish-800">
                      Category
                    </span>
                    <ResourcesFilterList attribute="attrs" />
                  </div>

                  <div className="mb-10">
                    <span className="text-sm font-medium text-purplish-800">
                      Country
                    </span>
                    <ResourcesFilterList attribute="country" />
                  </div>

                  <div className="mb-10">
                    <span className="text-sm font-medium text-purplish-800">
                      Rating
                    </span>
                    <ResourcesFilterList attribute="rating" type="rating" />
                  </div>
                </div>
                <CustomStats setStats={setStats} />
                <div className="flex-1">
                  <CategorizedHits
                    entityType={ENTITY_TYPE.SERVICES}
                    stats={stats}
                  />
                </div>
              </div>
            </InstantSearch>
            <div></div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
