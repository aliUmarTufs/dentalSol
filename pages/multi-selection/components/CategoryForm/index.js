import { ComboBoxComponent } from "../../../../components/ComboBoxComponent";
import { ListBoxComponents } from "../../../../components/ListBoxComponents";

export default function CategorySelectionForm({
	categoryInfo,
	setCategoryInfo,
	servicesInfo,
}) {
	console.log({
		categoryInfo,
		setCategoryInfo,
		servicesInfo,
	});
	return (
		<div className="p-4 md:p-8 md:pb-4 md:pt-2 flex flex-col gap-4">
			<h1 className="font-segoeui font-semibold text-purplish-700 text-2xl capitalize">
				{servicesInfo.isCourseChecked === true
					? "Course"
					: servicesInfo.isProductChecked === true
					? "Product"
					: servicesInfo.isArticleChecked === true
					? "Article"
					: servicesInfo.isDirectoryChecked === true
					? "Directory"
					: servicesInfo.isDealChecked === true
					? "Deal"
					: ""}
			</h1>
			<IterableForm
				categoryInfo={categoryInfo}
				setCategoryInfo={setCategoryInfo}
				servicesInfo={servicesInfo}
			/>

			<hr className="w-full h-px my-4 bg-purplish-200 bg-opacity-50 border-0 rounded" />
			<button
				type={"button"}
				onClick={() => console.log("s")}
				className={`cursor-pointer font-inter w-full h-14 bg-white flex items-center justify-center text-blue-600 hover:text-white rounded-md text-sm capitalize hover:bg-blue-600 border border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}>
				{`+ Add ${
					servicesInfo.isCourseChecked === true
						? "Course"
						: servicesInfo.isProductChecked === true
						? "Product"
						: servicesInfo.isArticleChecked === true
						? "Article"
						: servicesInfo.isDirectoryChecked === true
						? "Directory"
						: servicesInfo.isDealChecked === true
						? "Deal"
						: ""
				}`}
			</button>
		</div>
	);
}

export function IterableForm({
	categoryInfo,
	setCategoryInfo,
	topCategory,
	topCategoryRef,
	isValidTopCategory,
	setIsValidTopCategory = true,
	topCategoryErrMsg,

	categories,
	categoryRef,
	isValidCategory,
	setIsValidCategory = true,
	categoryErrMsg,

	subCategories,
	subCatQuery,
	setSubCatQuery,
	subCatRef,
	subCategoryErrMsg,
	isValidSubCategory,
	setIsValidSubCategory = true,
	servicesInfo,
}) {
	console.log({ iterableform: servicesInfo });
	return (
		<div className="flex items-stretch justify-between gap:2 md:gap-4 flex-col">
			{servicesInfo.isCourseChecked === true ||
			servicesInfo.isArticleChecked === true ? (
				// {/* categories input field */}
				<div className="flex flex-col gap-2 my-1 flex-1">
					<label className="block mb-2 font-normal font-inter text-sm text-purplish-700">
						Select Parent Category *
					</label>

					<ListBoxComponents
						valueKey={categoryInfo.topCategoryData}
						valueSetter={setCategoryInfo}
						optionsList={topCategory}
						isRef={true}
						refType={topCategoryRef}
					/>

					{!isValidTopCategory ? (
						<span className={"text-sm text-red-500"}>{topCategoryErrMsg}</span>
					) : (
						""
					)}
				</div>
			) : (
				""
			)}
			{/* categories input field */}
			<div className="flex flex-col gap-2 my-1 flex-1">
				<label className="block mb-2 font-normal font-inter text-sm text-purplish-700">
					Select Category *
				</label>

				<ListBoxComponents
					valueKey={categoryInfo.categoryData}
					valueSetter={setCategoryInfo}
					optionsList={categories}
					isRef={true}
					refType={categoryRef}
				/>

				{!isValidCategory ? (
					<span className={"text-sm text-red-500"}>{categoryErrMsg}</span>
				) : (
					""
				)}
			</div>

			{/* categories filter input field */}
			<div className="flex flex-col gap-2 my-1 flex-1">
				<label className="block mb-2 font-normal font-inter text-sm text-purplish-700">
					Select Subcategory *
				</label>

				<ComboBoxComponent
					valueKey={categoryInfo.subCatData}
					valueSetter={setCategoryInfo}
					optionsList={subCategories}
					itemQuery={subCatQuery}
					setItemQuery={setSubCatQuery}
					isRef={true}
					refType={subCatRef}
				/>

				{!isValidSubCategory ? (
					<span className={"text-sm text-red-500"}>{subCategoryErrMsg}</span>
				) : (
					""
				)}
			</div>
		</div>
	);
}
