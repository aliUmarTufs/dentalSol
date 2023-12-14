import {
	Navbar,
	Footer,
	CourseCard,
	HeadMeta,
	ResourceHits,
	HeroSection,
	CustomButton,
	CustomSearchBox,
	PromoMakreting,
} from "../components";

import moment from "moment";
import { CalendarIcon, RefreshIcon, TruckIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Configure, InstantSearch } from "react-instantsearch-dom";
import { algoliaClient } from "../lib/algoliaClient";
import { BASE_URL, ROUTES } from "../constants";
import Link from "next/link";
import { GlobalSearchBox } from "../components/GlobalSearchBox";
import { Markup } from "interweave";
import ResourceSlider from "../components/ResourcesSlider";

export default function Home({ data }) {
	const [items, setItems] = useState(null);
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [videoUrl, setVideoUrl] = useState(null);

	const closeModalHandler = () => {
		setIsOpenModal(false);
		// document.body.style.overflow = "auto";
		document.documentElement.style.overflow = `auto`;
	};

	const descriptionOfHeroSection = () => {
		return (
			<p className="text-center font-medium font-poppins text-blackish-700 text-base leading-relaxed my-2 w-full">
				{/* Resource for dental courses, products, services, library and deals
        across North America....for{" "} */}
				<Markup content={data?.section?.description_one} />{" "}
			</p>
		);
	};

	const keyFeatures = [
		{
			id: 1,
			span1: "Course",
			span2: "Online /Live courses across North America",
			href: ROUTES.COURSES,
		},
		{
			id: 2,
			span1: "Product",
			span2: "Products in different subject categories",
			href: ROUTES.PRODUCTS,
		},
		{
			id: 3,
			span1: "Services",
			span2: "Services in different categories",
			href: ROUTES.SERVICES,
		},
		{
			id: 4,
			span1: "Library",
			span2: "Free resources of articles and videos",
			href: ROUTES.LIBRARY,
		},
		{
			id: 5,
			span1: "Deal",
			span2: "Monthly promos (Some free stuff)",
			href: ROUTES.DEALS,
		},
	];

	const checkTimeValidation = () => {
		// item pora hogaya hai tou return krwado
		// check time difference
		// clearInterval()
	};

	// const settingTime = () => {
	//   setInterval(() => {
	//     checkTimeValidation();
	//   }, 60000);
	// };

	useEffect(() => {
		let getRelatedItems = async () => {
			fetch(`${BASE_URL}/api/home/featuredList`)
				.then((res) => res.json())
				.then((response) => {
					if (response.status == true) {
						setItems(response.data);
					}
				});
		};
		getRelatedItems();
		if (data?.intro) {
			var now = moment();
			let getCount = sessionStorage.getItem("getCount");
			if (getCount) {
				let parseCount = parseInt(getCount);
				if (data?.intro?.videos[getCount]) {
					let getLastTime = sessionStorage.getItem("current_time");
					const diff = now.diff(moment(getLastTime), "minutes");
					if (diff > 30) {
						setVideoUrl(data?.intro?.videos[getCount]);
						setIsOpenModal(true);
						sessionStorage.setItem("getCount", parseInt(getCount) + 1);
						sessionStorage.setItem("current_time", now);
					}
				}
			} else {
				if (data?.intro?.videos?.length > 0) {
					setVideoUrl(data?.intro?.videos[0]);
					setIsOpenModal(true);
					sessionStorage.setItem("current_time", now);

					sessionStorage.setItem("getCount", 1);
				}
			}
		}

		// settingTime()
	}, []);

	return (
		<>
			<HeadMeta
				title="Dent247 | Home"
				description="description"
				content="Dent247 | Home"
			/>
			<div>
				<Navbar />
				<div className="bg-light-blue">
					<div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
						<HeroSection
							title={data?.section?.title}
							heroImg={"/Dentist.png"}
							descOne={
								"Resource for dental courses, products, services, library and deals across North America....for FREE!!!"
							}
							// descTwo={"Dentistry’s answer to Google!!!"}
							descTwo={data?.section?.description_two}
							desc={descriptionOfHeroSection}
						/>
						{/* <InstantSearch
							indexName="course_categories"
							searchClient={algoliaClient}>
							<div className="relative h-16 sm:h-24 md:h-36 mb-0 md:mb-8 md:mb-16">
								<div className="absolute bottom-4 w-full h-auto">
									<CustomSearchBox placeHolderText={"Start Typing"} />
								</div>
							</div>
						</InstantSearch> */}
						<div className="relative h-16 sm:h-24 md:h-36 mb-0 md:mb-8 md:mb-16">
							<div className="absolute bottom-8 w-full h-auto">
								<GlobalSearchBox />
							</div>
						</div>

						{/* <div className="pb-8 xl:grid xl:grid-cols-5 xl:gap-10"> */}
						<div className="pb-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-x-6 sm:gap-y-10 lg:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
							{keyFeatures?.map((e) => {
								return (
									<Link href={e?.href}>
										<div
											className={
												"p-4 bg-blue-600 bg-opacity-10 hover:bg-opacity-100 cursor-pointer hover:text-white"
											}
											style={{
												borderRadius: "10px",
											}}>
											<div className="flex flex-col justify-center items-center gap-3">
												<span className="text-base block text-center font-bold">
													{e?.span1 ?? "N/A"}
												</span>
												<span className="text-sm block text-center">
													{e?.span2 ?? "N/A"}
												</span>
											</div>
										</div>
									</Link>
								);
							})}
						</div>
						{isOpenModal === true && (
							<PromoMakreting
								isOpen={isOpenModal}
								closeModalHandler={closeModalHandler}
								videoUrl={videoUrl}
							/>
						)}
						<RelatedItems items={items} />
						<ProductCTA />
						<ContactCTA />
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}

function ProductCTA() {
	return (
		<div className="flex flex-col gap-8 lg:gap-0 lg:flex-row items-stretch lg:items-center justify-between mt-0 md:mt-16 lg:mt-24">
			<div className="flex flex-1 flex-col gap-4 md:gap-6">
				<h1 className="capitalize font-extrabold font-poppins text-blackish-700 text-3xl leading-normal md:leading-normal sm:text-5xl sm:leading-relaxed xl:leading-normal xl:text-6xl">
					Dent247 Find Products you need
				</h1>
				<p className="font-medium font-poppins text-blackish-800 text-xl md:text-base">
					Find the products you need and Compare. Do the research before you buy
					at the best price.
				</p>
				<div className="w-56 mt-6 md:mt-0">
					<CustomButton
						btnText={"View All Products"}
						redirectURL={ROUTES.PRODUCTS}
						isPrimary={true}
					/>
				</div>
			</div>
			<div className="flex flex-1 justify-start lg:justify-end">
				<img
					src={"/chair_pair.png"}
					alt={"Products CTA"}
					className={"w-full lg:w-auto"}
				/>
			</div>
		</div>
	);
}

function ContactCTA() {
	return (
		<div className="bg-contact-cta bg-no-repeat bg-cover relative h-72 md:h-96 rounded-3xl bg-center pl-4 md:pl-12 lg:pl-24 flex gap-8 lg:gap-0 items-center mt-16 lg:mt-36 z-10">
			<div className="w-full h-full absolute bg-blackish-300 top-0 right-0 left-0 bottom-0 rounded-3xl z-20"></div>
			<div className="flex flex-col gap-4 md:gap-6 w-11/12 md:w-9/12 z-30">
				<h1 className="capitalize font-bold font-inter text-white md:text-2xl leading-normal md:leading-normal xl:leading-normal sm:text-4xl">
					Your Google for Dentistry. Disclosure: We have revamped and relaunched
					the site to make it better, easier to use, and more robust. Getting
					started is easy.
				</h1>
				<div className="flex flex-col md:flex-row md:gap-3">
					<div className="w-full mb-4 md:mb-0 md:w-56">
						<Link href={`${ROUTES.REGISTER}/#user`}>
							<button className="inline-flex justify-center items-center px-8 xl:px-12 py-3 border shadow-sm text-sm font-medium rounded-xl w-2/3 md:w-auto h-11 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-greyish-200 text-white border-white focus:ring-transparent">
								Signup as User
							</button>
						</Link>
					</div>
					<div className="w-full md:w-56">
						<Link href={`${ROUTES.REGISTER}/#vendor`}>
							<button
								className="inline-flex justify-center items-center px-8 xl:px-12 py-3 border shadow-sm text-sm font-medium rounded-xl w-2/3 md:w-auto h-11 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-greyish-200 text-white border-white focus:ring-transparent
		
		">
								Signup as Vendor
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export const RelatedItems = (items) => {
	const [loading, setLoading] = useState(false);
	// const [trendingCourses, setTrendingCourses] = useState([]);
	const [latestCourse, setLatestCourse] = useState([]);

	return (
		<div className="mt-16 lg:mt-24">
			<div className="my-20">
				<ResourceSlider
					type={"courses"}
					title={"Courses"}
					relateditems={items?.items?.relatedCourses}
				/>
			</div>

			<div className="my-20">
				<ResourceSlider
					type={"articles"}
					title={"Articles"}
					relateditems={items?.items?.relatedArticles}
				/>
			</div>

			<div className="my-20">
				<ResourceSlider
					type={"products"}
					title={"Products"}
					relateditems={items?.items?.relatedProducts}
				/>
			</div>

			<div className="my-20">
				<ResourceSlider
					type={"services"}
					title={"Services"}
					relateditems={items?.items?.relatedServices}
				/>
			</div>

			{/* <InstantSearch
						searchClient={algoliaClient}
						indexName="directory_companies">
						<Configure hitsPerPage={5} />
						<div className="my-20">
							<ResourceHits type={"directory"} title={"Directory"} />
						</div>
					</InstantSearch> */}
		</div>
	);
};

export async function getServerSideProps() {
	// Fetch data from external API
	const res = await fetch(`${BASE_URL}/api/home`);
	const data = await res.json();
	// Pass data to the page via props
	return { props: { data: data?.data } };
}
