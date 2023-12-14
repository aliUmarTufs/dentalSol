import { getAlgoliaResults } from "@algolia/autocomplete-js";
import { SearchIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { connectSearchBox } from "react-instantsearch-dom";
import { BeatLoader } from "react-spinners";
import { algoliaClient } from "../../lib/algoliaClient";
import Autocomplete from "../Autocomplete";

export const GlobalSearchBox = () => {
	return (
		<form noValidate action="" role="search" className="w-full mt-6 md:mt-12">
			<Autocomplete
				debug={false}
				openOnFocus={true}
				getSources={({ query }) => [
					{
						sourceId: "articles1",
						getItems() {
							return getAlgoliaResults({
								searchClient: algoliaClient,
								queries: [
									{
										indexName: "ce_courses",
										query,
										params: {
											hitsPerPage: 4,
										},
									},
									{
										indexName: "products",
										query,
										params: {
											hitsPerPage: 4,
										},
									},
									{
										indexName: "articles",
										query,
										params: {
											hitsPerPage: 4,
										},
									},
									{
										indexName: "directory_companies",
										query,
										params: {
											hitsPerPage: 4,
										},
									},
								],
							});
						},
						templates: {
							item({ item, components }) {
								let hrefUrl;
								let searchAttr;
								let indexes;
								if (item.__autocomplete_indexName == "articles") {
									hrefUrl = `library/article/${item.id}`;
									searchAttr = "title";
									indexes = "Article";
								} else if (item.__autocomplete_indexName == "ce_courses") {
									hrefUrl = `courses/${item.id}`;
									searchAttr = "title";
									indexes = "Course";
								} else if (item.__autocomplete_indexName == "products") {
									hrefUrl = `products/${item.id}`;
									searchAttr = "name";
									indexes = "Products";
								} else if (
									item.__autocomplete_indexName == "directory_companies"
								) {
									hrefUrl = `services/company/${item.objectID}`;
									searchAttr = "company_name";
									indexes = "Services";
								} else {
									hrefUrl = `#`;
									searchAttr = "title";
								}
								return (
									<ArticleSearchResult
										hit={item}
										components={components}
										link={hrefUrl}
										attr={searchAttr}
										indexes={indexes}
									/>
								);
							},
						},
					},
				]}
			/>
		</form>
	);
};

const ArticleSearchResult = ({ hit, components, link, attr, indexes }) => {
	return (
		<a href={link} className="aa-ItemLink">
			<div className="aa-ItemContent">
				<div className="aa-ItemTitle">
					<components.Highlight hit={hit} attribute={`${attr}`} /> -{" "}
					<b>{indexes}</b>
				</div>
			</div>
		</a>
	);
};
