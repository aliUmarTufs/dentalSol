import { supabase } from "../../lib/supabaseClient";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { Navbar } from "../../components";
import { Disclosure, Menu, RadioGroup, Transition } from "@headlessui/react";
import { HomeIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";

const user = {
	name: "Floyd Miles",
	email: "floydmiles@example.com",
	imageUrl:
		"https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
	{ name: "Dashboard", href: "#" },
	{ name: "Jobs", href: "#" },
	{ name: "Applicants", href: "#" },
	{ name: "Company", href: "#" },
];
const breadcrumbs = [
	{ name: "Projects", href: "#", current: false },
	{ name: "Project Nero", href: "#", current: true },
];
const userNavigation = [
	{ name: "Your Profile", href: "#" },
	{ name: "Settings", href: "#" },
	{ name: "Sign out", href: "#" },
];

const settings = [
	{
		name: "Public access",
		description: "This project would be available to anyone who has the link",
	},
	{
		name: "Private to Project Members",
		description: "Only members of this project would be able to access",
	},
	{
		name: "Private to you",
		description: "You are the only one able to access this project",
	},
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Account() {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState([]);
	const [loginRequired, setLoginRequired] = useState(false);
	const [profile, setProfile] = useState([]);

	const fetchUser = async () => {
		const user = supabase.auth.user();

		if (user) {
			setUser(user);
			setLoading(false);

			const { data, error } = await supabase
				.from("profiles")
				.select()
				.eq("id", user.id);

			setProfile(data[0]);
		} else {
			setUser(null);
			setLoginRequired(true);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	} else {
		if (loginRequired) {
			return (
				<div>
					You need to log in to access this page. Login{" "}
					<Link href="/login" className="text-blue-600">
						here
					</Link>
					.
				</div>
			);
		} else {
			return (
				<div>
					<Navbar />
					<NewProduct />
				</div>
			);
		}
	}
}

export const NewProduct = () => {
	const [selected, setSelected] = useState(settings[0]);

	return (
		<>
			<main className="max-w-lg mx-auto pt-10 pb-12 px-4 lg:pb-16">
				<form>
					<div className="space-y-6">
						<div>
							<h1 className="text-lg leading-6 font-medium text-gray-900">
								Create new product
							</h1>
							<p className="mt-1 text-sm text-gray-500">
								List your product on Dent247 and reach thousands of dentists
								every month.
							</p>
						</div>

						<div>
							<label
								htmlFor="project-name"
								className="block text-sm font-medium text-gray-700">
								Product Name
							</label>
							<div className="mt-1">
								<input
									type="text"
									name="project-name"
									id="project-name"
									className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="project-name"
								className="block text-sm font-medium text-gray-700">
								Short Description
							</label>
							<label className="text-sm font-light">
								This appears in product previews, such as on the browse products
								page.
							</label>
							<div className="mt-1">
								<textarea
									type="text"
									name="project-name"
									id="project-name"
									className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="description"
								className="block text-sm font-medium text-gray-700">
								Description
							</label>
							<label className="text-sm font-light">
								The full description of the product, that is seen on the product
								page.
							</label>
							<div className="mt-1">
								<textarea
									id="description"
									name="description"
									rows={8}
									className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
									defaultValue={""}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<div className="space-y-1">
								<label
									htmlFor="add-team-members"
									className="block text-sm font-medium text-gray-700">
									Add Tags
								</label>
								<div className="flex">
									<div className="flex-grow">
										<input
											type="text"
											name="add-team-members"
											id="add-team-members"
											className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
											placeholder="E.g. bur, Dentsply Sirona"
											aria-describedby="add-team-members-helper"
										/>
									</div>
									<span className="ml-3">
										<button
											type="button"
											className="bg-white inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
											<PlusIcon
												className="-ml-2 mr-1 h-5 w-5 text-gray-400"
												aria-hidden="true"
											/>
											<span>Add</span>
										</button>
									</span>
								</div>
							</div>
						</div>

						<RadioGroup value={selected} onChange={setSelected}>
							<RadioGroup.Label className="text-sm font-medium text-gray-900">
								Privacy
							</RadioGroup.Label>

							<div className="mt-1 bg-white rounded-md shadow-sm -space-y-px">
								{settings.map((setting, settingIdx) => (
									<RadioGroup.Option
										key={setting.name}
										value={setting}
										className={({ checked }) =>
											classNames(
												settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
												settingIdx === settings.length - 1
													? "rounded-bl-md rounded-br-md"
													: "",
												checked
													? "bg-blue-50 border-blue-200 z-10"
													: "border-gray-200",
												"relative border p-4 flex cursor-pointer focus:outline-none"
											)
										}>
										{({ active, checked }) => (
											<>
												<span
													className={classNames(
														checked
															? "bg-blue-600 border-transparent"
															: "bg-white border-gray-300",
														active ? "ring-2 ring-offset-2 ring-blue-500" : "",
														"h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center"
													)}
													aria-hidden="true">
													<span className="rounded-full bg-white w-1.5 h-1.5" />
												</span>
												<div className="ml-3 flex flex-col">
													<RadioGroup.Label
														as="span"
														className={classNames(
															checked ? "text-blue-900" : "text-gray-900",
															"block text-sm font-medium"
														)}>
														{setting.name}
													</RadioGroup.Label>
													<RadioGroup.Description
														as="span"
														className={classNames(
															checked ? "text-blue-700" : "text-gray-500",
															"block text-sm"
														)}>
														{setting.description}
													</RadioGroup.Description>
												</div>
											</>
										)}
									</RadioGroup.Option>
								))}
							</div>
						</RadioGroup>

						<ItemForSale />

						<div className="flex justify-end">
							<button
								type="button"
								className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
								Cancel
							</button>
							<button
								type="submit"
								className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
								List your product &rarr;
							</button>
						</div>
					</div>
				</form>
			</main>
		</>
	);
};

export const ItemForSale = () => {
	return (
		<fieldset className="space-y-2">
			<legend className="sr-only">List for sale</legend>
			<div className="relative flex items-start">
				<div className="flex items-center h-5">
					<input
						id="comments"
						aria-describedby="comments-description"
						name="comments"
						type="checkbox"
						className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
					/>
				</div>
				<div className="ml-3 text-sm">
					<label htmlFor="comments" className="font-medium text-gray-700">
						List your product for sale
					</label>
					<p id="comments-description" className="text-gray-500">
						Select this if you would like dentists to be able to buy your
						product directly on Dent247. We will reach out about pricing.
					</p>
				</div>
			</div>
		</fieldset>
	);
};
