import Link from "next/link";
import { ENTITY_TYPE } from "../../constants";

export default function CategoryCardBox({ objectType, type }) {
	const hasImg = objectType?.image && !_.isNull(objectType.image);

	return (
		<div className="flex flex-col gap-2 items-center justify-evenly bg-white categoryClass p-8 h-80 lg:w-11/12">
			<img
				src={`${
					hasImg
						? objectType?.image
						: type === ENTITY_TYPE.COURSES
						? `/course-card-img.png`
						: type === ENTITY_TYPE.PRODUCTS
						? `/product-card-img.png`
						: type === ENTITY_TYPE.SERVICES
						? `/service-card-img.png`
						: type === ENTITY_TYPE.ARTICLES
						? `/article-card-img.png`
						: `/service-card-img.png`
				}`}
				alt={`${type}`}
				className={`${`w-16 object-contain`}`}
			/>

			<h6
				className="font-poppins font-bold text-lg text-bluish-800 text-center textTruncateTwo md:h-14 break-words"
				style={{ wordBreak: "break-word" }}>
				{objectType?.label ||
					objectType?.name ||
					objectType?.title ||
					objectType?.id ||
					objectType?.objectID ||
					"N/A"}
			</h6>

			<Link
				href={`/${
					type === ENTITY_TYPE.ARTICLES
						? "library/category"
						: type === ENTITY_TYPE.SERVICES
						? "services"
						: `${type}/category`
				}/${encodeURIComponent(
					objectType.label ||
						objectType.name ||
						objectType.id ||
						objectType.title
					// objectType.objectID
				)}`}>
				<span
					className={
						"cursor-pointer inline-flex items-center justify-center w-full text-white bg-bluish-200 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-bluish-200 dark:focus:ring-blue-500"
					}>
					View Category
				</span>
			</Link>
		</div>
	);
}
