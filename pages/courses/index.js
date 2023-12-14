import { Configure, InstantSearch } from "react-instantsearch-dom";
import _ from "lodash";
import {
	Navbar,
	HeadMeta,
	Footer,
	CustomSearchBox,
	HeroSection,
	SubCategoryListing,
} from "../../components";
import { algoliaClient } from "../../lib/algoliaClient";
import { BASE_URL } from "../../constants";
import { Markup } from "interweave";

export default function Courses({ pageData }) {
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
				title="Dent247 | Courses"
				description="description"
				content="Dent247 | Courses"
			/>
			<div>
				<Navbar />
				<div className="bg-light-blue">
					<div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
						<HeroSection
							title={pageData?.data?.section?.title}
							heroImg={"/course-hero.png"}
							descOne={`Courses that provide value! NEVER leave a course saying "what....that's an hour of my life I will never get back!!!!"`}
							descTwo={pageData?.data?.section?.description_two}
							//   descTwo={"Take control and get a taste BEFORE GOING!!"}
							desc={descriptionOfHeroSection}
						/>
						<InstantSearch
							indexName="course_categories"
							searchClient={algoliaClient}>
							<Configure hitsPerPage={100} />
							<div className="relative h-16 sm:h-24 md:h-36 mb-4 md:mb-0">
								<div className="absolute bottom-4 w-full h-auto">
									<CustomSearchBox
										placeHolderText={"Search for a subcategory"}
									/>
								</div>
							</div>
							<div className="mb-12 md:mb-24">
								<SubCategoryListing entityType={"courses"} />
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
	const res = await fetch(`${BASE_URL}/api/section?type=courses`);
	const data = await res.json();

	// Pass data to the page via props
	return { props: { pageData: data } };
}
