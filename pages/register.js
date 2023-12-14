import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import {
	Navbar,
	HeadMeta,
	UserRegistration,
	VendorRegistration,
} from "../components";
import { ROUTES, isLoggedInIndication } from "../constants";
import _ from "lodash";
import { Tab } from "@headlessui/react";
import { BeatLoader } from "react-spinners";

export default function Login() {
	const router = useRouter();
	const [hash, setHash] = useState(null);

	const [isLoggedInUser, setIsLoggedInUser] = useState(null);
	useEffect(() => {
		if (isLoggedInIndication()) {
			router.push(ROUTES.DASHBOARD);
		} else {
			let editOption = window.location.hash.replace(/^#/, "");
			editOption = editOption.split("/");
			if (editOption?.length > 0) {
				setHash(editOption[0]);
				// #edit/aaaa
			}
			setIsLoggedInUser(true);
		}
	}, []);

	return (
		<>
			<HeadMeta
				title={"Dent247 | Register"}
				description="description"
				content={"Dent247 | Register"}
			/>
			<Navbar />
			<div className="bg-light-blue">
				{_.isNull(isLoggedInUser) ? (
					<div className="my-2 flex justify-center w-full h-screen items-center">
						<BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
					</div>
				) : (
					<>
						<div className="max-w-4xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
							<img
								src="/logo.png"
								alt="Dent247"
								className="w-8 sm:w-12 md:w-16 h-auto mx-auto mb-4 md:mb-8"
							/>
							<RegisterFormPanel hashing={hash} />
						</div>
					</>
				)}
			</div>
		</>
	);
}

export const RegisterFormPanel = ({ hashing }) => {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (!_.isNull(hashing)) {
			if (hashing == "user") {
				setIndex(0);
			} else if (hashing == "vendor") {
				setIndex(1);
			}
		}
	}, [hashing]);
	return (
		<>
			<Tab.Group selectedIndex={index} onChange={setIndex}>
				<div className="flex flex-col p-2 md:p-5">
					<div className="p-4 mt-6 my-0 border-transparent rounded-2xl bg-bluish-400 bg-opacity-5">
						<Tab.List className="focus:outline-none">
							<div className="flex">
								<Tab
									as={Fragment}
									disabled={
										!_.isEmpty(hashing)
											? hashing == "user"
												? false
												: true
											: false
									}>
									{({ selected }) => (
										<button
											className={`h-11 flex justify-center items-center px-3 py-2 font-inter font-medium text-base rounded-md w-1/2 ${
												selected
													? "bg-blue-600 text-white"
													: "text-gray-500 hover:text-gray-700"
											}`}>
											User
										</button>
									)}
								</Tab>
								<Tab
									as={Fragment}
									// disabled={editData?.deal_type == "discounted" ? true : false}
									disabled={
										!_.isEmpty(hashing)
											? hashing == "vendor"
												? false
												: true
											: false
									}>
									{({ selected }) => (
										<button
											className={`h-11 flex justify-center items-center px-3 py-2 font-inter font-medium text-base rounded-md w-1/2 ${
												selected
													? "bg-blue-600 text-white"
													: "text-gray-500 hover:text-gray-700"
											}`}>
											Vendor
										</button>
									)}
								</Tab>
							</div>
						</Tab.List>
					</div>
				</div>
				<Tab.Panels className={"p-2 pb-4 md:p-5"}>
					<Tab.Panel>
						<UserRegistration userRoleType={"User"} />
					</Tab.Panel>
					<Tab.Panel>
						<VendorRegistration userRoleType={"Vendor"} />
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</>
	);
};
