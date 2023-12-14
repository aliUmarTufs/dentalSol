import { ArrowLeftIcon } from "@heroicons/react/outline";
import _ from "lodash";
import Link from "next/link";

export default function CustomButton({
	redirectURL,
	btnText,
	isPrimary,
	isDanger,
	clickHandler,
	btnType,
	isDisabled,
	borderRadiusClass,
	loggedInUser,
	hasIcon,
}) {
	return _.isUndefined(clickHandler) ? (
		<Link href={redirectURL}>
			<button
				disabled={isDisabled ?? false}
				type={btnType ?? `button`}
				className={`inline-flex justify-center items-center px-8 xl:px-12 py-3 border shadow-sm text-sm font-medium ${
					!_.isUndefined(borderRadiusClass) ? borderRadiusClass : "rounded-xl"
				} w-auto h-11 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
					isPrimary
						? `bg-blue-600 text-white hover:bg-blue-700 border-blue-600 focus:ring-blue-500`
						: isDanger
						? `bg-transparent border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500`
						: `bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white border-blue-600 focus:ring-blue-500`
				}
		${isDisabled === true ? `cursor-not-allowed ` : ``}
		`}>
				{hasIcon ? <ArrowLeftIcon className="w-4 h-4 mr-3" /> : ""} {btnText}
			</button>
		</Link>
	) : (
		<button
			disabled={isDisabled ?? false}
			type={btnType ?? `button`}
			className={`inline-flex justify-center items-center px-8 xl:px-12 py-3 border shadow-sm text-sm font-medium ${
				!_.isUndefined(borderRadiusClass) ? borderRadiusClass : "rounded-xl"
			} w-auto h-11 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
				isPrimary
					? `bg-blue-600 text-white hover:bg-blue-700 border-blue-600 focus:ring-blue-500`
					: isDanger
					? `bg-transparent border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500`
					: `bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white border-blue-600 focus:ring-blue-500`
			}
			${isDisabled === true ? `cursor-not-allowed ` : ``}
			
			`}
			onClick={clickHandler}>
			{hasIcon ? <ArrowLeftIcon className="w-4 h-4 mr-3" /> : ""} {btnText}
		</button>
	);
}
