import Head from "next/head";
import Image from "next/image";
import {
	Navbar,
	HeadMeta,
	CustomSearchBox,
	Footer,
	CategoryHits,
	HeroSection,
	CategoryCardBox,
	CustomButton,
	AllCategoryHits,
} from "../../components";
import { CalendarIcon, RefreshIcon, TruckIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import algoliasearch from "algoliasearch/lite";
import {
	InstantSearch,
	connectHits,
	connectInfiniteHits,
	Configure,
} from "react-instantsearch-dom";
import {
	ExternalLinkIcon,
	GlobeIcon,
	SearchIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import { algoliaClient } from "../../lib/algoliaClient";
import _ from "lodash";
import { Markup } from "interweave";
import { BASE_URL } from "../../constants";

export default function Products({ pageData }) {
	const descriptionOfHeroSection = () => {
		return (
			// <p className="font-medium font-poppins text-blackish-700 text-base leading-relaxed my-2 w-11/12">
			<p className="text-center font-medium font-poppins text-blackish-700 text-base leading-relaxed my-2 w-full">
				<Markup content={pageData?.data?.section?.description_one} />
			</p>
		);
	};
	return (
		<>
			<HeadMeta
				title="Dent247 | Products"
				description="description"
				content="Dent247 | Products"
			/>
			<div>
				<Navbar />
				<div className="bg-light-blue">
					<div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
						<HeroSection
							//   title={"Dent247 Products Search Engine"}
							title={pageData?.data?.section?.title}
							heroImg={"/product-hero.png"}
							//   descOne={`How many products have you bought and then had buyer’s remorse??? Other than dentistry,  you can do your research, read reviews BEFORE you buy......UNTIL NOW!!`}
							desc={descriptionOfHeroSection}
						/>

						<InstantSearch
							indexName="product_categories"
							searchClient={algoliaClient}>
							<div className="relative h-24 md:h-36 mb-0 md:mb-8 md:mb-16">
								<div className="absolute bottom-0 md:bottom-4 w-full h-auto">
									<CustomSearchBox placeHolderText={"Search for a category"} />
								</div>
							</div>
							<Configure />
							<div>
								<h2 className="font-poppins font-extrabold text-blackish-700 text-3xl">
									All Categories
								</h2>
							</div>
							<div className="mt-14">
								<AllCategoryHits entityType={"products"} />
							</div>
						</InstantSearch>
					</div>
				</div>

				<Footer />
			</div>
		</>
	);
}
export async function getServerSideProps() {
	// Fetch data from external API
	const res = await fetch(`${BASE_URL}/api/section?type=products`);
	const data = await res.json();

	// Pass data to the page via props
	return { props: { pageData: data } };
}
