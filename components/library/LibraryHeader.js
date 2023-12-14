import { getAlgoliaResults } from "@algolia/autocomplete-js";
import { algoliaClient } from "../../lib/algoliaClient";
import Autocomplete from "../Autocomplete";

export default function LibraryHeader() {
	return (
		<div className="md:flex md:items-center md:justify-between p-8">
			<div className="flex-1 min-w-0">
				<h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
					The Dent247 Library
				</h2>
				<p className="mt-1 text-sm leading-5 text-gray-500">
					A curated collection of content from the world of dentistry. Are you a
					speaker, author, or have something to say? We&apos;d love to have you
					write with us!
				</p>
			</div>
			<div className="mt-4 flex md:mt-0 md:ml-4 w-1/2 relative z-30 justify-end">
				<Autocomplete
					debug
					openOnFocus={true}
					getSources={({ query }) => [
						{
							sourceId: "articles1",
							getItems() {
								return getAlgoliaResults({
									searchClient: algoliaClient,
									queries: [
										{
											indexName: "articles",
											query,
										},
										{
											indexName: "ce_courses",
											query,
										},
									],
								});
							},
							templates: {
								item({ item, components }) {
									return (
										<ArticleSearchResult hit={item} components={components} />
									);
								},
							},
						},
					]}
				/>
			</div>
		</div>
	);
}

const ArticleSearchResult = ({ hit, components }) => {
	return (
		<a href={`/library/${hit.id}`} className="aa-ItemLink">
			<div className="aa-ItemContent">
				<div className="aa-ItemTitle">
					<components.Highlight hit={hit} attribute="title" />
				</div>
			</div>
		</a>
	);
};
