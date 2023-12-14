import { ChevronUpIcon } from "@heroicons/react/solid";
import { Markup } from "interweave";
import _ from "lodash";
import { Fragment, useEffect, useState } from "react";
import {
	AlertBox,
	Footer,
	HeadMeta,
	Navbar,
	PageTitleInfo,
} from "../../components";
import { BASE_URL, FAQS_INFO } from "../../constants";

export default function Faqs({ data }) {
	const [faqs, setFaqs] = useState(data);
	const handleClick = (id) => {
		setFaqs(
			data.map((faq) => {
				return faq.id === id
					? { ...faq, isOpen: !faq.isOpen }
					: { ...faq, isOpen: false };
			})
		);
	};

	return (
		<>
			<HeadMeta
				title={"Dent247 | Faqs"}
				description="description"
				content={"Dent247 | Faqs"}
			/>
			<Navbar isPageTitleInfo={true} />

			<PageTitleInfo title="FREQUENTLY ASKED QUESTIONS" />
			<div className="bg-light-blue">
				<div className="max-w-7xl mx-auto px-4 lg:px-2 pt-8 lg:pt-16 pb-8 md:pb-12 lg:pb-20">
					<div className="mt-8 space-y-8 lg:mt-12">
						{_.size(faqs) > 0 ? (
							faqs.map((item) => {
								return (
									<Fragment key={item.id}>
										<button
											className="flex w-full items-center justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm md:text-md font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
											onClick={() => handleClick(item.id)}
											aria-expanded={item.isOpen}
											{...(item.isOpen && { "aria-controls": item.id })}>
											<span className={"w-64 sm:w-auto"}>{item.question}</span>
											<ChevronUpIcon
												className={`${
													!item.isOpen ? "rotate-180 transform" : ""
												} h-5 w-5 text-blue-500`}
											/>
										</button>
										{item.isOpen && (
											<div className="px-4 py-0 text-base text-justify md:text-sm text-gray-500">
												<Markup content={item.answer} />
											</div>
										)}
									</Fragment>
								);
							})
						) : (
							<AlertBox type={"info"} text="No FAQs Found." />
						)}
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

export async function getServerSideProps() {
	// Fetch data from external API
	const res = await fetch(`${BASE_URL}/api/faqs`);
	const data = await res.json();
	// Pass data to the page via props
	return { props: { data: data?.data } };
}
