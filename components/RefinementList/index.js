import { connectRefinementList } from "react-instantsearch-dom";
import ReactStars from "react-stars";

export const ResourcesFilterList = connectRefinementList(
  ({ items, refine, type }) => {

    return (
      <div>
        <ul>
          <legend className="block text-sm font-medium text-gray-900">
            {items.name}
          </legend>
          <div className="pt-2 md:pt-6 md:space-y-2 flex items-center gap-4 flex-wrap md:block">
            {items.length > 0 ? (
              items.map((item) => (
                <li
                  key={item.label}
                  onClick={(event) => {
                    event.preventDefault();
                    refine(item.value);
                  }}
                  className={`cursor-pointer ${
                    item.isRefined ? "font-bold" : "font-normal"
                  }`}
                >
                  {type != "rating" ? (
                    <>
                      <input
                        type="checkbox"
                        checked={item.isRefined ? true : false}
                        className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                      />

                      <span className="ml-3 text-sm text-black capitalize">
                        {item.label} ({item.count})
                      </span>
                    </>
                  ) : (
                    <div className="mt-3 flex items-center">
                      <input
                        type="checkbox"
                        checked={item.isRefined ? true : false}
                        className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center ml-2">
                        <ReactStars
                          count={5}
                          size={24}
                          isHalf={true}
                          emptyIcon={<i className="far fa-star"></i>}
                          halfIcon={<i className="fa fa-star-half-alt"></i>}
                          fullIcon={<i className="fa fa-star"></i>}
                          activeColor="#F8BB46"
                          value={item?.label}
                          edit={false}
                        />
                      </div>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="text-sm text-black capitalize">
                Coming Soon
              </li>
            )}
          </div>
        </ul>
      </div>
    );
  }
);
