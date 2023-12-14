const summaryData = [
	{
		category: "graphic design",
		subCategoryList: [
			{
				title: "sub category 1",
			},
			{
				title: "sub category 1",
			},
			{
				title: "sub category 1",
			},
			{
				title: "sub category 1",
			},
			{
				title: "sub category 1",
			},
			{
				title: "sub category 1",
			},
		],
		entityName: "course",
	},
	{
		category: "machinery",
		subCategoryList: [
			{
				title: "sub category 2",
			},
			{
				title: "sub category 2",
			},
			{
				title: "sub category 2",
			},
			{
				title: "sub category 2",
			},
			{
				title: "sub category 2",
			},
			{
				title: "sub category 2",
			},
		],
		entityName: "product",
	},
];

export default function FormInfoSummary({ formData }) {
	return (
		<div className="p-4 md:p-8 md:pt-5 md:pb-0">
			{summaryData.map((item, index) => {
				return (
					<>
						<div key={index} className="flex flex-col">
							<h1 className="text-purplish-700 capitalize text-xl font-semibold font-inter">
								{item.category}
							</h1>
							<h6 className="text-purplish-700 capitalize text-sm font-medium font-poppins mt-1">
								{item.entityName}
							</h6>

							<div className="grid grid-cols-1 md:grid-cols-4 gap-3 xl:col-span-4 mt-4">
								{item.subCategoryList.map((subCat, index) => {
									return (
										<span
											key={index}
											className="bg-blue-600 p-3 rounded-2xl flex items-center justify-center font-normal font-poppins text-whitish-100 text-sm capitalize">
											{subCat.title}
										</span>
									);
								})}
							</div>
						</div>
						{summaryData.length !== index + 1 ? (
							<hr className="w-full h-px my-8 bg-black bg-opacity-20 border-0 rounded" />
						) : (
							""
						)}
					</>
				);
			})}
		</div>
	);
}
