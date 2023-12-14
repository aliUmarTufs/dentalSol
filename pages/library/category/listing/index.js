import _ from "lodash";
import { useRouter } from "next/router";
import { Configure, InstantSearch } from "react-instantsearch-dom";
import {
	AllCategoryHits,
	Footer,
	HeadMeta,
	Navbar,
	PageTitleInfo,
} from "../../../../components";
import { algoliaClient } from "../../../../lib/algoliaClient";

export default function CategoryAllListing() {
	const router = useRouter();
	return (
		<>
			<HeadMeta
				title={`Dent247 | Category Listing | ${router.query.type}`}
				description="description"
				content={`Dent247 | Category Listing | ${router.query.type}`}
			/>
			<Navbar isPageTitleInfo={true} />

			<PageTitleInfo title={`${router.query.type} Category`} />

			<div className="bg-light-blue">
				<div className="max-w-7xl mx-auto px-4 lg:px-2 pt-16 pb-8 md:pb-12 lg:pb-20">
					<div className="flex flex-col gap-4">
						<h2 className="font-poppins font-extrabold text-blackish-700 text-3xl">
							All Categories
						</h2>

						<h6 className="text-lg font-poppins font-semibold text-black capitalize">
							Courses &gt;
							<span className="text-blue-600">
								{" "}
								{router.query.type} Category
							</span>
						</h6>
					</div>

					<InstantSearch
						searchClient={algoliaClient}
						indexName="article_categories">
						<Configure hitsPerPage={8} filters={`type:${router.query.type}`} />
						<div className="mt-14">
							<AllCategoryHits entityType={"articles"} />
						</div>
					</InstantSearch>
				</div>
			</div>

			<Footer />
		</>
	);
}
