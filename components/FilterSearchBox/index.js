import { SearchIcon } from "@heroicons/react/solid";
import { connectSearchBox } from "react-instantsearch-dom";
import { BeatLoader } from "react-spinners";

function FilterBox({
  currentRefinement,
  isSearchStalled,
  refine,
  placeHolderText,
}) {
  return (
    <form noValidate action="" role="search" className="w-full mt-3">
      <div className="mb-10 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
          <SearchIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <input
          type="search"
          placeholder={"Search Here"}
          value={currentRefinement}
          onChange={(event) => refine(event.currentTarget.value)}
          className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />{" "}
      </div>
    </form>
  );
}

export const FilterSearchBox = connectSearchBox(FilterBox);
