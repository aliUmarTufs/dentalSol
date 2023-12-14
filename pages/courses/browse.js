import Head from "next/head";
import Image from "next/image";
import { Navbar, Footer, HeadMeta } from "../../components";
import { CalendarIcon, RefreshIcon, TruckIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import algoliasearch from "algoliasearch/lite";
import {
	InstantSearch,
	connectHits,
	connectSearchBox,
} from "react-instantsearch-dom";
import {
	ChevronRightIcon,
	GlobeIcon,
	SearchIcon,
} from "@heroicons/react/solid";

export default function Home() {
	return (
		<>
			<HeadMeta
				title="Dent247 | Browse Products"
				description="description"
				content="Dent247 | Browse Products"
			/>
			<div>
				<Navbar />
				<Hero />
				<Incentives />
				<Categories />
				<TrendingCourses />
				<ExclusiveDeal />
				<Footer />
			</div>
		</>
	);
}

export const Incentives = () => {
	const perks = [
		{
			name: "The best deals in dentistry",
			description: "Exclusive Deals",
			icon: CalendarIcon,
		},
		{
			name: "Free shipping on returns",
			description: "Send it back for free",
			icon: RefreshIcon,
		},
		{
			name: "Free, contactless delivery",
			description: "The shipping is on us",
			icon: TruckIcon,
		},
	];

	return (
		<div className="bg-white">
			<h2 className="sr-only">Our perks</h2>
			<div className="max-w-7xl mx-auto divide-y divide-gray-200 lg:py-8 lg:flex lg:justify-center lg:divide-y-0 lg:divide-x">
				<div className="py-8 lg:py-0 lg:w-1/3 lg:flex-none">
					<div className="max-w-xs mx-auto px-4 flex items-center lg:max-w-none lg:px-8">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="flex-shrink-0 h-8 w-8 text-blue-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								vectorEffect="non-scaling-stroke"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<div className="ml-4 flex-auto flex flex-col-reverse">
							<h3 className="font-medium text-gray-900">
								The best deals in the industry
							</h3>
							<p className="text-sm text-gray-500">
								Exclusive deals on select products
							</p>
						</div>
					</div>
				</div>
				<div className="py-8 lg:py-0 lg:w-1/3 lg:flex-none">
					<div className="max-w-xs mx-auto px-4 flex items-center lg:max-w-none lg:px-8">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="flex-shrink-0 h-8 w-8 text-blue-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								vectorEffect="non-scaling-stroke"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
						<div className="ml-4 flex-auto flex flex-col-reverse">
							<h3 className="font-medium text-gray-900">
								Free shipping on returns
							</h3>
							<p className="text-sm text-gray-500">Send it back for free</p>
						</div>
					</div>
				</div>
				<div className="py-8 lg:py-0 lg:w-1/3 lg:flex-none">
					<div className="max-w-xs mx-auto px-4 flex items-center lg:max-w-none lg:px-8">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="flex-shrink-0 h-8 w-8 text-blue-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								vectorEffect="non-scaling-stroke"
								d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
							/>
							<path
								vectorEffect="non-scaling-stroke"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
							/>
						</svg>
						<div className="ml-4 flex-auto flex flex-col-reverse">
							<h3 className="font-medium text-gray-900">
								Free, contactless delivery
							</h3>
							<p className="text-sm text-gray-500">The shipping is on us</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export function Hero() {
	return (
		<div className="relative bg-gray-50 overflow-hidden h-full">
			<div
				className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full"
				aria-hidden="true">
				<div className="relative h-full max-w-7xl mx-auto">
					<svg
						className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2"
						width={404}
						height={784}
						fill="none"
						viewBox="0 0 404 784">
						<defs>
							<pattern
								id="f210dbf6-a58d-4871-961e-36d5016a0f49"
								x={0}
								y={0}
								width={20}
								height={20}
								patternUnits="userSpaceOnUse">
								<rect
									x={0}
									y={0}
									width={4}
									height={4}
									className="text-gray-200"
									fill="currentColor"
								/>
							</pattern>
						</defs>
						<rect
							width={404}
							height={784}
							fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
						/>
					</svg>
					<svg
						className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2"
						width={404}
						height={784}
						fill="none"
						viewBox="0 0 404 784">
						<defs>
							<pattern
								id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
								x={0}
								y={0}
								width={20}
								height={20}
								patternUnits="userSpaceOnUse">
								<rect
									x={0}
									y={0}
									width={4}
									height={4}
									className="text-gray-200"
									fill="currentColor"
								/>
							</pattern>
						</defs>
						<rect
							width={404}
							height={784}
							fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"
						/>
					</svg>
				</div>
			</div>

			<div className="relative pt-6 pb-16 sm:pb-24">
				<main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
					<div className="text-center">
						<h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
							<span className="block xl:inline">Dent247</span>{" "}
							<span className="block text-blue-600 xl:inline">
								Product Search Engine
							</span>
						</h1>
						<p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
							Find the product you need. At the best price. Find the product you
							need. At the best price. Find the product you need. At the best
							price.
						</p>
						<SearchComponent />
					</div>
				</main>
			</div>
		</div>
	);
}

export const SearchComponent = () => {
	return (
		<div className="mt-8">
			<div className="flex w-full px-32">
				<input
					type="text"
					placeholder="Start typing..."
					className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm text-lg border-gray-300 rounded-md"
				/>
				<button
					type="button"
					className="ml-2 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
					Search
				</button>
			</div>
			<button
				type="button"
				className="mt-6 inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
				Or Browse All Products &rarr;
			</button>
		</div>
	);
};

const searchClient = algoliasearch(
	process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
	process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

export function SearchBox({ currentRefinement, isSearchStalled, refine }) {
	return (
		<form noValidate action="" role="search" className="w-full mr-2">
			<div className="relative">
				<div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
					<SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
				</div>
				<input
					type="search"
					value={currentRefinement}
					onChange={(event) => refine(event.currentTarget.value)}
					placeholder="Search for a category or subcategory"
					className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
				/>
			</div>
			{isSearchStalled ? "Loading..." : ""}
		</form>
	);
}

const CustomSearchBox = connectSearchBox(SearchBox);

const Hits = ({ hits }) => (
	<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
		{hits.map((category) => (
			<div key={category.description}>
				<h2 className="text-lg font-bold text-gray-900 flex items-center mb-2">
					<GlobeIcon className="w-6 h-6 mr-2 text-blue-600" />{" "}
					<span>{category.parent_category}</span>
				</h2>
				<p className="text-sm mb-4">{category.description}</p>
				<ul>
					{category.children.map((sub_category) => (
						<a
							key={sub_category.name}
							className="flex items-center underline mb-2 hover:text-blue-600"
							href={"/products/category/" + sub_category.id}>
							<ChevronRightIcon className="w-4 h-4" />{" "}
							<span>{sub_category.name}</span>
						</a>
					))}
				</ul>
			</div>
		))}
	</div>
);

const CustomHits = connectHits(Hits);

export const Categories = () => {
	return (
		<InstantSearch searchClient={searchClient} indexName="product_categories">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<div className="py-16 flex justify-between">
					<h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex-shrink-0 mr-24 ">
						Product Categories
					</h1>
					<CustomSearchBox />
				</div>
				<CustomHits />
			</div>
		</InstantSearch>
	);
};

export const TrendingCourses = () => {
	const [loading, setLoading] = useState(true);
	const [trendingCourses, setTrendingCourses] = useState([]);

	const fetchTrendingCourses = async () => {
		const { data, error } = await supabase
			.from("courses")
			.select(
				`
            id,
            category,
            date,
            title,
            short_description,
            trending,
            online,
            buyable,
            organizations (
                name,
                id
            ),
            cities (
                name,
                country,
                state
            )
        `
			)
			.limit(12)
			.filter("trending", "eq", true);

		if (error) {
			setLoading(false);
		} else {
			setTrendingCourses(data);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTrendingCourses();
	}, []);

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
			<div className="py-16">
				<h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
					Trending Products
				</h1>
			</div>
			{loading ? (
				<>
					<p className="ml-2">Loading Trending Products...</p>
				</>
			) : (
				<div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-2 xl:gap-x-8">
					{trendingCourses.map((course) => (
						<div key={course.id}>
							Course card deployment issues - cmg soon!
							{/* <CourseCard key = {course.name} course = {course}/> */}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export const ExclusiveDeal = () => {
	return (
		<div className="bg-white">
			<div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
				<div className="relative rounded-lg overflow-hidden">
					<div className="absolute inset-0">
						<img
							src="https://nam.edu/wp-content/uploads/2020/03/dental-sdoh-1.png"
							alt=""
							className="w-full h-full object-center object-cover"
						/>
					</div>
					<div className="relative bg-gray-900 bg-opacity-75 py-32 px-6 sm:py-40 sm:px-12 lg:px-16">
						<div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
							<h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
								<span className="block sm:inline">Buy 2 Get One Free</span>
							</h2>
							<p className="mt-3 text-xl text-white">
								Get a free 3M dental sealer with every 2 dental sealers you buy.
								Free shipping and returns. Minimum $420 purchase. Deal ends on
								November 30, 2021.
							</p>
							<a
								href="#"
								className="mt-8 w-full block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto">
								Take the Deal &rarr;
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
