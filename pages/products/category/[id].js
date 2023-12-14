import {
  Navbar,
  Footer,
  HeadMeta,
  ResourcesFilterList,
  CardBox,
  PageTitleInfo,
  CustomButton,
  AlertBox,
  CustomStats,
  CategorizedHits,
} from "../../../components";
import { useState } from "react";
import {
  InstantSearch,
  Configure,
  connectInfiniteHits,
} from "react-instantsearch-dom";
import Link from "next/link";
import { useRouter } from "next/router";
import { algoliaClient } from "../../../lib/algoliaClient";
import { BASE_URL, ENTITY_TYPE, ROUTES } from "../../../constants";
import { FilterSearchBox } from "../../../components";

export default function CategorizedProducts() {
  const [stats, setStats] = useState(null);
  const router = useRouter();

  return (
    <>
      <HeadMeta
        title={`Dent247 | Products | ${router?.query?.id ?? "Loading"}`}
        description="description"
        content={`Dent247 | Products | ${router?.query?.id ?? "Loading"}`}
      />
      <div>
        <Navbar isPageTitleInfo={true} />
        <PageTitleInfo title={`${router?.query?.id}`} />
        <div className="bg-light-blue">
          <div className="max-w-7xl mx-auto px-4 lg:px-2 pt-8 md:pt-16 lg:pt-24 pb-8 md:pb-12 lg:pb-20">
            <h6 className="text-sm sm:text-lg font-medium text-black mb-5 capitalize">
              {`Products`} &gt;
              <span className="text-blue-600"> {`${router?.query?.id}`}</span>
            </h6>
            <InstantSearch searchClient={algoliaClient} indexName="products">
              <Configure
                filters={`category.parent_category:"${router.query.id}"  AND is_approved:1`}
              />
              <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                <div className="p-5 rounded-2xl w-full md:w-72 h-full bg-bluish-300">
                  <FilterSearchBox />
                  <div className="mb-10">
                    <span className="text-sm font-medium text-purplish-800">
                      Category
                    </span>
                    <ResourcesFilterList attribute="category.name" />
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
                    entityType={ENTITY_TYPE.PRODUCTS}
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

