import { ROUTES } from "../../constants";
import CustomButton from "../CustomButton";

export default function NotFound({ isItem, title, heroImage }) {
	return (
		<div className="flex flex-col items-center">
			<h1 className="text-black text-xl sm:text-2xl md:text-4xl font-roboto font-bold capitalize">
				oops...
			</h1>
			<h2 className="text-black text-lg sm:text-xl md:text-3xl font-roboto font-normal mt-2 md:mt-3.5">
				{title}
			</h2>
			{!isItem ? (
				<h6 className="text-light-blue-200 text-base font-roboto font-normal mt-2 md:mt-5 mx-auto text-center md:w-72">
					This Page doesn`t exist or was removed! We suggest you back to home.
				</h6>
			) : (
				""
			)}

			<div className="w-4/5 md:w-1/2 mt-4 md:mt-6">
				<img src={heroImage} alt={title} className={"w-full"} />
			</div>

			<div className="mt-4 md:mt-8">
				<CustomButton
					redirectURL={ROUTES.HOME}
					btnText="Back To Home"
					isPrimary={true}
					hasIcon={true}
				/>
			</div>
		</div>
	);
}
