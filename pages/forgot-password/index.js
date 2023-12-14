import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { HeadMeta, Navbar } from "../../components";
import Link from "next/link";
import { BeatLoader } from "react-spinners";
import {
	BASE_URL,
	INVALID_EMAIL,
	isLoggedInIndication,
	REQUIRED_EMAIL,
	ROUTES,
	Toast,
} from "../../constants";
import _ from "lodash";
import Util from "../../services/Util";

export default function ForgotPassword() {
	const router = useRouter();

	const [emailAdd, setEmailAdd] = useState("");
	const [resendLink, setResendLik] = useState(false);
	const [saveEmail, setSaveEmail] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);
	const [isValidEmailAdd, setIsValidEmailAdd] = useState(true);
	const [emailErrMsg, setEmailErrMsg] = useState("");
	const [loading, setLoading] = useState(false);
	const [isSentEmail, setIsSentEmail] = useState(false);

	const emailRef = useRef(null);

	const [isLoggedInUser, setIsLoggedInUser] = useState(null);
	useEffect(() => {
		if (isLoggedInIndication()) {
			router.push(ROUTES.DASHBOARD);
		} else {
			setIsLoggedInUser(true);
		}
	}, []);

	const validateForm = () => {
		let isValid = true;

		setIsValidEmailAdd(true);

		// required check
		if (_.isEmpty(emailAdd)) {
			emailRef.current.focus();
			setIsValidEmailAdd(false);
			setEmailErrMsg(REQUIRED_EMAIL);
			isValid = false;
		} else if (!Util.isEmailValid(emailAdd)) {
			emailRef.current.focus();
			setIsValidEmailAdd(false);
			setEmailErrMsg(INVALID_EMAIL);
			isValid = false;
		}

		return isValid;
	};

	const resendPassword = () => {
		if (saveEmail) {
			setResendLik(true);
			const payload = {
				email: saveEmail,
			};
			fetch(`${BASE_URL}/api/auth/forgetpassword`, {
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
						Toast.fire({
							icon: `${"success"}`,
							title: `${data.message}`,
						});
						setResendLik(false);
					} else {
						setResendLik(false);
						Toast.fire({
							icon: `${"error"}`,
							title: `${data.message}`,
						});
					}
					//
				});
		}
	};

	const resetPswdLink = async (event) => {
		event.preventDefault();
		if (validateForm()) {
			setLoading(true);
			const payload = {
				email: emailAdd,
			};

			fetch(`${BASE_URL}/api/auth/forgetpassword`, {
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
						setEmailAdd("");
						setIsSentEmail(true);
						Toast.fire({
							icon: `${"success"}`,
							title: `${data.message}`,
						});
						setLoading(false);

						// setTimeout(() => {
						//   router.push(ROUTES.HOME);
						// }, 3000);
					} else {
						setIsSuccess(false);
						setLoading(false);
						setEmailAdd("");
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
				title={"Dent247 | Forgot Password"}
				description="description"
				content={"Dent247 | Forgot Password"}
			/>
			<div>
				<Navbar />
				<div className="bg-light-blue h-screen">
					{_.isNull(isLoggedInUser) ? (
						<div className="my-2 flex justify-center w-full h-screen items-center">
							<BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
						</div>
					) : (
						<>
							<div className="max-w-4xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 pt-44">
								{!isSentEmail ? (
									<>
										<img
											src="/logo.png"
											alt="Dent247"
											className="w-8 sm:w-12 md:w-16 h-auto mx-auto mb-4 md:mb-8"
										/>
										<div className="p-4 md:p-8 rounded-3xl border border-solid border-gray-700">
											<h1 className="text-xl tracking-tight font-extrabold text-gray-900 sm:text-2xl md:text-3xl">
												<span className="block inline">Forgot your </span>{" "}
												<span className="block text-blue-600 inline">
													password?
												</span>
											</h1>
											<h6 className="text-gray-900 text-sm sm:text-md md:text-lg mt-2">
												Don't fret! Just type in your email and we will send you
												a link to reset your password!
											</h6>
											<form onSubmit={resetPswdLink} className={"mt-8"}>
												<div className="flex flex-col gap-2 my-4">
													<label
														for="email"
														className="block text-sm font-normal text-gray-900 dark:text-gray-300">
														Email
													</label>

													<input
														id="email"
														className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
														placeholder="Type Here"
														onChange={(e) => {
															setEmailAdd(
																e.target.value,
																setIsValidEmailAdd(true)
															);
															setSaveEmail(
																e.target.value,
																setIsValidEmailAdd(true)
															);
														}}
														value={emailAdd}
														ref={emailRef}
													/>

													{!isValidEmailAdd ? (
														<span className={"text-sm text-red-500"}>
															{emailErrMsg}
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
													{loading ? "" : "Reset Password"}
												</button>
											</form>
										</div>
									</>
								) : (
									<>
										{" "}
										<img
											src="/logo.png"
											alt="Dent247"
											className="w-8 sm:w-12 md:w-16 h-auto mx-auto mb-4 md:mb-8"
										/>
										<div className="p-4 md:p-8 rounded-3xl border border-solid border-gray-700">
											<h6 className="text-gray-900 text-sm sm:text-md md:text-lg mt-2">
												Kindly check your inbox for the reset password link and
												follow the steps.
											</h6>
											<div className="w-36 ml-auto">
												<button
													onClick={resendPassword}
													disabled={loading ? true : false}
													className={`${
														resendLink ? "cursor-not-allowed" : "cursor-pointer"
													} w-full h-14 mt-8 md:mt-12 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}>
													{resendLink ? (
														<BeatLoader color="#fff" sizeunit={"px"} size={8} />
													) : (
														""
													)}
													{resendLink ? "" : "Resend Email"}
												</button>
											</div>
										</div>
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
