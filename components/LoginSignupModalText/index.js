import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { ROUTES } from "../../constants";

export default function LoginSignupModalText({ description }) {
	function setRoute() {
		let setRoute = localStorage.setItem("set_route", location.pathname);
	}

	return (
		<>
			<div className="mt-2 group inline-flex items-start text-sm p-4 text-gray-500 hover:text-gray-900 transition-all">
				<QuestionMarkCircleIcon
					className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
					aria-hidden="true"
				/>
				<span>{description}</span>
			</div>
			<div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
				<Link href={ROUTES.LOGIN}>
					<a
						onClick={setRoute}
						className={
							"text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						}>
						Login
					</a>
				</Link>
			</div>
			<p className="px-4 pb-4 text-md font-semibold text-gray-600 dark:text-white">
				Not on Dent247 yet?{" "}
				<Link href={ROUTES.REGISTER}>
					<span className="text-blue-600 cursor-pointer hover:underline">
						Sign up
					</span>
				</Link>
			</p>
		</>
	);
}
