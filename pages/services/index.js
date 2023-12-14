import {
	Navbar,
	Footer,
	HeadMeta,
	HeroSection,
	CustomSearchBox,
	AllCategoryHits,
} from "../../components";
import { InstantSearch, Configure } from "react-instantsearch-dom";
import { algoliaClient } from "../../lib/algoliaClient";
import { Markup } from "interweave";
import { BASE_URL } from "../../constants";

export default function Directory({ pageData }) {
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
				title="Dent247 | Services"
				description="description"
				content="Dent247 | Services"
			/>
			<div>
				<Navbar />
				<div className="bg-light-blue">
					<div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
						<HeroSection
							title={pageData?.data?.section?.title}
							// title={"Dent247 Directory Search Engine"}
							heroImg={"/directory-hero.png"}
							descOne={`How did you choose your accountant/lawyer/banker??? Wouldn't it be nice to do your homework and see what's available out there ...in your pajamas???`}
							desc={descriptionOfHeroSection}
						/>

						<InstantSearch
							indexName="directory_categories"
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
								<AllCategoryHits entityType={"services"} />
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
	const res = await fetch(`${BASE_URL}/api/section?type=services`);
	const data = await res.json();

	// Pass data to the page via props
	return { props: { pageData: data } };
}
