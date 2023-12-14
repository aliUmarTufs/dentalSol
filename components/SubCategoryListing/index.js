import { Tab } from "@headlessui/react";
import _ from "lodash";
import { HomeIcon, OfficeBuildingIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useState } from "react";
import { connectHits } from "react-instantsearch-dom";
import { BeatLoader } from "react-spinners";
import AlertBox from "../AlertBox";
import CategoryCardBox from "../CategoryCardBox";
import { BASE_URL, ENTITY_TYPE } from "../../constants";

export const SubCategoryListing = ({ entityType }) => {
	return (
		<Tab.Group>
			<div className="flex flex-col mb-8">
				<div className="p-2 md:p-3 border rounded-lg bg-white mx-auto md:w-2/4 w-full my-4">
					<Tab.List className="focus:outline-none">
						<div className="flex">
							<Tab as={Fragment}>
								{({ selected }) => (
									<button
										className={`flex justify-center items-center p-2 font-medium text-base rounded-md w-1/2 ${
											selected
												? "bg-blue-600 text-white"
												: "text-gray-500 hover:text-gray-700"
										}`}>
										<OfficeBuildingIcon className="h-5 w-5 mr-2" />
										Business
									</button>
								)}
							</Tab>
							<Tab as={Fragment}>
								{({ selected }) => (
									<button
										className={`flex justify-center items-center p-2 font-medium text-base rounded-md w-1/2 ${
											selected
												? "bg-blue-600 text-white"
												: "text-gray-500 hover:text-gray-700"
										}`}>
										<HomeIcon className="h-5 w-5 mr-2" />
										Clinical
									</button>
								)}
							</Tab>
						</div>
					</Tab.List>
				</div>
			</div>
			<Tab.Panels>
				<Tab.Panel>
					<Categories type={"business"} entityType={entityType} />
				</Tab.Panel>
				<Tab.Panel>
					<Categories type={"clinical"} entityType={entityType} />
				</Tab.Panel>
			</Tab.Panels>
		</Tab.Group>
	);
};

const Categories = connectHits(({ hits, type, entityType }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		!_.isEmpty(hits) && setLoading(false);
	}, [hits]);

	const asceProduct = _.sortBy(hits, [
		function (objectType) {
			return objectType?.label || objectType?.id;
		},
	]);

	return loading ? (
		<div className="my-2 flex justify-center items-center">
			<BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
		</div>
	) : _.size(asceProduct) > 0 ? (
		<div className="bg-transparent p-2 sm:p-0 sm:px-0 pt-2 mt-0 transition-opacity duration-1000 opacity-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{_.filter(asceProduct, (items) => {
				if (items.type.toLowerCase() === type.toLowerCase()) return items;
			}).map((hit, index) => (
				<CategoryCardBox objectType={hit} key={index} type={entityType} />
			))}
		</div>
	) : (
		<AlertBox type={"info"} text={"No Lisitng Found."} />
	);
});
