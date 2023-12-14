import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { HeadMeta, Navbar } from "../../components";
import Link from "next/link";
import { BeatLoader } from "react-spinners";
import {
	BASE_URL,
	INVALID_CONFIRM_PASSWORD,
	INVALID_EMAIL,
	INVALID_PASSWORD,
	isLoggedInIndication,
	REQUIRED_EMAIL,
	REQUIRED_PASSWORD,
	ROUTES,
	Toast,
} from "../../constants";
import _ from "lodash";
import Util from "../../services/Util";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";

export default function ResetPassword() {
	const router = useRouter();
	const [pswd, setPswd] = useState("");
	const [confirmPswd, setConfirmPswd] = useState("");
	const [showPswd, setShowPswd] = useState(false);
	const [showConfirmPswd, setShowConfirmPswd] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isValidPswd, setIsValidPswd] = useState(true);
	const [isValidConfirmPswd, setIsValidConfirmPswd] = useState(true);
	const [pswdErrMsg, setPswdErrMsg] = useState("");
	const [confirmPswdErrMsg, setConfirmPswdErrMsg] = useState("");
	const [loading, setLoading] = useState(false);

	const pswdRef = useRef(null);
	const confirmPswdRef = useRef(null);

	const [hash, setHash] = useState(null);
	const [reset_type, setType] = useState(null);
	const [accessToken, setAccessToken] = useState(null);

	useEffect(() => {
		if (!isLoggedInIndication()) {
			let urlHash = window.location.hash;
			const hashArr = urlHash
				.substring(1)
				.split("&")
				.map((param) => param.split("="));

			let type;
			let accessToken;
			for (const [key, value] of hashArr) {
				if (key === "type") {
					type = value;
					setType(type);
				} else if (key === "access_token") {
					accessToken = value;
					setAccessToken(accessToken);
				}
			}
			if (
				type !== "recovery" ||
				!accessToken ||
				typeof accessToken === "object"
			) {
				Toast.fire({
					icon: `${"error"}`,
					title: "Access token  expired",
				});
				setAccessToken(false);
			}
			setHash(window.location.hash);
		} else {
			router.push(ROUTES.DASHBOARD);
		}
	}, []);

	//   useEffect(() => {
	//     if (accessToken == false) {
	//       router.push(ROUTES.LOGIN);
	//     }
	//   }, [accessToken]);

	const validateForm = () => {
		let isValid = true;

		setIsValidPswd(true);
		setIsValidConfirmPswd(true);

		// required check
		if (_.isEmpty(pswd)) {
			pswdRef.current.focus();
			setIsValidPswd(false);
			setPswdErrMsg(REQUIRED_PASSWORD);
			isValid = false;
		} else if (!Util.isValidPassword(pswd)) {
			pswdRef.current.focus();
			setIsValidPswd(false);
			setPswdErrMsg(INVALID_PASSWORD);
			isValid = false;
		}
		if (_.isEmpty(confirmPswd)) {
			confirmPswdRef.current.focus();
			setIsValidConfirmPswd(false);
			setConfirmPswdErrMsg(REQUIRED_PASSWORD);
			isValid = false;
		} else if (confirmPswd !== pswd) {
			confirmPswdRef.current.focus();
			setIsValidConfirmPswd(false);
			setConfirmPswdErrMsg(INVALID_CONFIRM_PASSWORD);
			isValid = false;
		}

		return isValid;
	};

	const resetPswdFunc = async (event) => {
		event.preventDefault();
		if (validateForm()) {
			setLoading(true);
			const payload = {
				password: pswd,
				accessToken,
			};

			fetch(`${BASE_URL}/api/auth/resetpassword`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			})
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					if (data.status === true) {
						setIsSuccess(true);

						Toast.fire({
							icon: `${"success"}`,
							title: `${data.message}`,
						});
						setTimeout(() => {
							router.push(ROUTES.LOGIN);
						}, 3000);
					} else {
						setIsSuccess(false);
						setLoading(false);
						Toast.fire({
							icon: `${"error"}`,
							title: `${data.message}`,
						});
					}
					//
				});
		}
	};

	return (
		<>
			<HeadMeta
				title={"Dent247 | Reset Password"}
				description="description"
				content={"Dent247 | Reset Password"}
			/>
			<Navbar />
			<div className="bg-light-blue">
				<div className="max-w-7xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
					{_.isNull(accessToken) ? (
						<div className="my-2 flex justify-center w-full h-screen items-center">
							<BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
						</div>
					) : (
						<>
							<img
								src="/logo.png"
								alt="Dent247"
								className="w-8 sm:w-12 md:w-16 h-auto mx-auto mb-4 md:mb-8"
							/>
							<div className="p-4 md:p-8 rounded-3xl border border-solid border-gray-700">
								{accessToken == false ? (
									<>
										<div>PAGE LINK IS EXPIRED</div>
									</>
								) : (
									<>
										<h1 className="text-xl tracking-tight font-extrabold text-gray-900 sm:text-2xl md:text-3xl">
											<span className="block inline">Reset your </span>{" "}
											<span className="block text-blue-600 inline">
												password?
											</span>
										</h1>

										<form onSubmit={resetPswdFunc} className={"mt-8"}>
											<div className="flex flex-col gap-2 mt-10">
												<label
													for="password"
													className="block text-sm font-normal text-gray-900 dark:text-gray-300">
													Password
												</label>
												<div className="relative">
													<input
														type={!showPswd ? "password" : "text"}
														id="password"
														className={
															"bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-16 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
														}
														placeholder="Type Here"
														onChange={(e) =>
															setPswd(e.target.value, setIsValidPswd(true))
														}
														value={pswd}
														ref={pswdRef}
														maxLength={20}
													/>
													{showPswd ? (
														<EyeOffIcon
															className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
															onClick={() => setShowPswd(false)}
														/>
													) : (
														<EyeIcon
															className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
															onClick={() => setShowPswd(true)}
														/>
													)}
												</div>
												{!isValidPswd ? (
													<span className={"text-sm text-red-500"}>
														{pswdErrMsg}
													</span>
												) : (
													""
												)}
											</div>

											<div className="flex flex-col gap-2 mt-10">
												<label
													for="confirm_password"
													className="block text-sm font-normal text-gray-900 dark:text-gray-300">
													Confirm Password
												</label>
												<div className="relative">
													<input
														type={!showConfirmPswd ? "password" : "text"}
														id="confirm_password"
														className={
															"bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-16 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
														}
														placeholder="Type Here"
														onChange={(e) =>
															setConfirmPswd(
																e.target.value,
																setIsValidConfirmPswd(true)
															)
														}
														value={confirmPswd}
														ref={confirmPswdRef}
														// maxLength={20}
													/>
													{showConfirmPswd ? (
														<EyeOffIcon
															className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
															onClick={() => setShowConfirmPswd(false)}
														/>
													) : (
														<EyeIcon
															className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
															onClick={() => setShowConfirmPswd(true)}
														/>
													)}
												</div>
												{!isValidConfirmPswd ? (
													<span className={"text-sm text-red-500"}>
														{confirmPswdErrMsg}
													</span>
												) : (
													""
												)}
											</div>

											<button
												type="submit"
												disabled={loading ? true : false}
												className={`${
													loading ? "cursor-not-allowed" : "cursor-pointer"
												} w-full h-14 mt-8 md:mt-12 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}>
												{loading ? (
													<BeatLoader color="#fff" sizeunit={"px"} size={8} />
												) : (
													""
												)}
												{loading ? "" : "Update Password"}
											</button>
										</form>
									</>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}
