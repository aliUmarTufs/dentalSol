import _ from "lodash";
import { connectInfiniteHits } from "react-instantsearch-dom";
import AlertBox from "../AlertBox";
import CategoryCardBox from "../CategoryCardBox";
import CustomButton from "../CustomButton";

export const AllCategoryHits = connectInfiniteHits(
	({ hits, hasMore, refineNext, entityType }) => {
		const asceProduct = _.sortBy(hits, [
			function (objectType) {
				return (
					objectType?.label ||
					objectType?.name ||
					objectType?.title ||
					objectType?.id
				);
			},
		]);
		return _.size(asceProduct) > 0 ? (
			<>
				<div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-6 xl:grid-cols-4">
					{asceProduct.map((item, index) => (
						<CategoryCardBox
							objectType={item}
							key={item?.id ?? index}
							type={entityType}
						/>
					))}
				</div>

				{hasMore && (
					<div className="flex items-center justify-center mt-8 md:mt-16">
						<CustomButton
							btnText={"View more"}
							clickHandler={refineNext}
							isPrimary={true}
						/>
					</div>
				)}
			</>
		) : (
			<AlertBox type={"info"} text="No Listing Found." />
		);
	}
);
