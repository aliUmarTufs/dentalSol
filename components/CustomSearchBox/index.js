import { SearchIcon } from "@heroicons/react/solid";
import { connectSearchBox } from "react-instantsearch-dom";
import { BeatLoader } from "react-spinners";

function SearchBox({
	currentRefinement,
	isSearchStalled,
	refine,
	placeHolderText,
}) {
	return (
		<form noValidate action="" role="search" className="w-full mt-6 md:mt-12">
			<div className="border border-black bg-white border-opacity-10 p-3 md:p-5 rounded-3xl ">
				<div className="relative">
					<div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
						<SearchIcon
							className="h-5 w-5 text-gray-400 text-blue-600"
							aria-hidden="true"
						/>
					</div>
					<input
						type="search"
						value={currentRefinement}
						onChange={(event) => refine(event.currentTarget.value)}
						placeholder={placeHolderText}
						className="block w-full bg-white border border-gray-300 rounded-md p-5 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-2xl"
					/>
				</div>
			</div>
			{isSearchStalled ? (
				<div className="my-2 mx-auto text-center w-full">
					<BeatLoader color="#2563eb" sizeunit={"px"} size={8} />
				</div>
			) : (
				<p className="transition-all invisible my-2 h-6">Loading...</p>
			)}
		</form>
	);
}

export const CustomSearchBox = connectSearchBox(SearchBox);
