import Link from "next/link";
import {
	CalendarIcon,
	UserGroupIcon,
	DesktopComputerIcon,
} from "@heroicons/react/outline";
import { CheckCircleIcon, XCircleIcon, StarIcon } from "@heroicons/react/solid";
import { supabase } from "../../lib/supabaseClient";
import { ROUTES } from "../../constants";
import ReactStars from "react-stars";

export default function CourseCard({ course }) {
	return (
		<div className="border mb-4 bg-white overflow-hidden shadow rounded-lg flex justify-between">
			<div className="w-full">
				<div className="divide-y divide-gray-200">
					<div className="px-4 py-5 sm:px-6">
						<div className="flex justify-between flex-col gap-4 md:flex-row">
							<h1 className="text-xl font-bold tracking-tight text-gray-900 w-full md:w-8/12">
								{course.title}
							</h1>
							<div>
								{course.trending ? (
									<>
										<a
											href="#"
											className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
											<div className="absolute flex-shrink-0 flex items-center justify-center">
												<span
													className="h-1.5 w-1.5 rounded-full bg-green-500"
													aria-hidden="true"
												/>
											</div>
											<div className="ml-3.5 text-sm font-medium text-gray-900">
												Trending
											</div>
										</a>{" "}
									</>
								) : (
									""
								)}

								<span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-600">
									{course.category}
								</span>
							</div>
						</div>
					</div>
					<div className="px-4 py-5 sm:p-6">
						<span className="flex flex-col gap-4 sm:flex-row">
							<span className="flex items-center">
								<CalendarIcon className="w-5 h-5 mr-2 " />
								<p className="text-base font-sm text-gray-800 font-semibold capitalize">
									{course?.date ?? "Date is not available"}
								</p>
							</span>
							{course.online ? (
								<span className="flex items-center">
									<DesktopComputerIcon className="w-5 h-5 mr-2 " />
									<p className="text-base font-sm text-gray-800 font-semibold">
										Course Is Online
									</p>
								</span>
							) : (
								<span className="flex items-center ml-4">
									<UserGroupIcon className="w-5 h-5 mr-2 " />
									<p className="text-base font-sm text-gray-800 font-semibold">
										Course Is In {course?.city}
									</p>
								</span>
							)}
						</span>
						<div className="mt-2 mb-2">
							{course.buyable ? (
								<span className="flex items-center">
									<p className="text-green-600 mr-2">
										<CheckCircleIcon className="w-5 h-5" />
									</p>
									<p className="text-base font-sm text-gray-800 font-semibold">
										Available To Buy On Dent247
									</p>
								</span>
							) : (
								// <span className="flex items-center">
								//   <p className="text-red-600 mr-2">
								//     <XCircleIcon className="w-5 h-5" />
								//   </p>
								//   <p className="text-base font-sm text-gray-800 font-semibold">
								//     Cannot Buy Directly On Dent247
								//   </p>
								// </span>
								""
							)}
						</div>
						<p className="text-base font-sm text-gray-800 font-regular mb-1">
							{course.short_description}
						</p>
						<p className="text-base font-sm text-gray-800 font-regular mb-1">
							Provided by:{" "}
							<Link href={"/companies/asd"}>
								<a className="font-semibold">{course.provider}</a>
							</Link>
						</p>
					</div>
					<div className="px-4 py-4 sm:px-6">
						<div className="flex justify-between md:items-center flex-col gap-4 md:flex-row">
							<div className="flex items-center md:justify-center">
								<p className="text-lg font-sm text-gray-800 font-semibold">
									Rating:
								</p>
								<div className="ml-2 flex items-center">
									{/* {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        course.rating > rating
                          ? "text-yellow-400"
                          : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))} */}

									<ReactStars
										count={5}
										size={24}
										isHalf={true}
										emptyIcon={<i className="far fa-star"></i>}
										halfIcon={<i className="fa fa-star-half-alt"></i>}
										fullIcon={<i className="fa fa-star"></i>}
										activeColor="#ffd700"
										value={course?.rating}
										edit={false}
									/>
								</div>
							</div>
							<Link href={`${ROUTES.COURSES}/${course.objectID}`}>
								<button
									type="button"
									className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
									View Course &rarr;
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}
