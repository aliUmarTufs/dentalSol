import { useState, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
	CheckCircleIcon,
	UserCircleIcon,
	XCircleIcon,
} from "@heroicons/react/solid";
import _ from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import { DATE_FORMAT_ONE, ROUTES } from "../../constants";
import { Markup } from "interweave";
import Link from "next/link";

export default function ItemDetailModal({
	isOpen,
	closeModalHandler,
	detailTitle,
	detailObj,
	itemDetails,
	itemTitle,
	sourceType,
	entityType,
}) {
	const router = useRouter();

	return (
		<Transition
			show={isOpen}
			enter="transition duration-100 ease-out"
			enterFrom="transform scale-95 opacity-0"
			enterTo="transform scale-100 opacity-100"
			leave="transition duration-75 ease-out"
			leaveFrom="transform scale-100 opacity-100"
			leaveTo="transform scale-95 opacity-0"
			as={Fragment}>
			<Dialog onClose={closeModalHandler} className="relative z-102">
				{/* The backdrop, rendered as a fixed sibling to the panel container */}
				<div
					className="fixed inset-0 bg-gray-600 opacity-60"
					aria-hidden="true"
				/>
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="relative w-full max-w-2xl h-5/6 overflow-y-auto rounded bg-white">
						<div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
							<Dialog.Title
								className={
									"text-xl font-semibold text-gray-900 dark:text-white"
								}>
								{detailTitle}
							</Dialog.Title>
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
								onClick={closeModalHandler}>
								<svg
									aria-hidden="true"
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg">
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"></path>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<Dialog.Description className={"p-4"}>
							{sourceType === "dashboard" ? (
								<>
									<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												User
											</h4>

											<p className="text-gray-500 text-sm text-normal capitalize">
												{detailObj?.buyer_id?.user_name}
											</p>
										</div>

										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Type
											</h4>

											<p className="text-gray-500 text-sm text-normal">
												{detailObj?.organization_id?.organization_type ==
												"course_provider"
													? "Course"
													: detailObj?.organization_id?.organization_type ==
													  "product_provider"
													? "Product"
													: detailObj?.organization_id?.organization_type ==
													  "service_provider"
													? "Service"
													: "N/A"}
											</p>
										</div>
										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Status
											</h4>

											<p className="text-gray-500 text-sm text-normal">
												{detailObj?.status ?? "Completed"}
											</p>
										</div>

										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Date
											</h4>

											<p className="text-gray-500 text-sm text-normal">
												{moment(detailObj?.created_at).format(DATE_FORMAT_ONE)}
											</p>
										</div>
									</div>
								</>
							) : (
								<>
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Title
											</h4>

											<p className="text-gray-500 text-sm text-normal capitalize">
												{detailObj?.title ||
													detailObj?.name ||
													detailObj?.company_name}
											</p>
										</div>

										{entityType == "courses" || entityType == "products" ? (
											<>
												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														Price
													</h4>

													<p className="text-gray-500 text-sm text-normal">
														{!_.isNil(detailObj?.Price) ||
														!_.isNil(detailObj?.price)
															? `$${detailObj?.Price || detailObj?.price}`
															: "N/A"}
													</p>
												</div>
											</>
										) : (
											""
										)}

										{entityType == "courses" ? (
											<>
												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														Provider's Link
													</h4>
													{!_.isNull(detailObj?.provider_link) ? (
														<Link
															href={detailObj?.provider_link}
															target={"_blank"}>
															<span className="text-gray-500 text-sm text-normal hover:underline hover:text-blue-500 cursor-pointer">
																{detailObj?.provider_link}
															</span>
														</Link>
													) : (
														"N/A"
													)}
												</div>

												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														CE
													</h4>
													{!_.isNil(detailObj?.CE) ? (
														<span className="text-gray-500 text-sm text-normal">
															{detailObj?.CE}
														</span>
													) : (
														"N/A"
													)}
												</div>

												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														Category
													</h4>
													{!_.isNil(detailObj?.category) ? (
														<span className="text-gray-500 text-sm text-normal">
															{detailObj?.category}
														</span>
													) : (
														"N/A"
													)}
												</div>

												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														Category Filter
													</h4>
													{!_.isNil(detailObj?.category_filters) ? (
														<span className="text-gray-500 text-sm text-normal">
															{detailObj?.category_filters}
														</span>
													) : (
														"N/A"
													)}
												</div>
											</>
										) : entityType == "services" ? (
											<>
												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														Website
													</h4>
													{!_.isNull(detailObj?.website) ? (
														<Link href={detailObj?.website} target={"_blank"}>
															<span className="text-gray-500 text-sm text-normal hover:underline hover:text-blue-500 cursor-pointer">
																{detailObj?.website}
															</span>
														</Link>
													) : (
														"N/A"
													)}
												</div>
											</>
										) : (
											""
										)}

										{entityType == "services" ? (
											<>
												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														Contact Phone
													</h4>
													{!_.isNull(detailObj?.contact_phone) ? (
														<Link href={`tel:${detailObj?.contact_phone}`}>
															<span className="text-gray-500 text-sm text-normal hover:underline hover:text-blue-500 cursor-pointer">
																{detailObj?.contact_phone}
															</span>
														</Link>
													) : (
														"N/A"
													)}
												</div>

												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														Contact Email
													</h4>
													{!_.isNull(detailObj?.contact_email) ? (
														<Link href={`mailto:${detailObj?.contact_email}`}>
															<span className="text-gray-500 text-sm text-normal hover:underline hover:text-blue-500 cursor-pointer">
																{detailObj?.contact_email}
															</span>
														</Link>
													) : (
														"N/A"
													)}
												</div>
											</>
										) : (
											""
										)}

										{entityType == "courses" ? (
											<>
												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														Price Mode
													</h4>

													<p className="text-gray-500 text-sm text-normal capitalize">
														{detailObj?.price_mode}
													</p>
												</div>

												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														{entityType == "courses" ? "Is Online?" : ""}
													</h4>

													<p className="text-gray-500 text-sm text-normal capitalize">
														{entityType == "courses" ? (
															detailObj?.online === true ? (
																<CheckCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-blue-600 m-0" />
															) : (
																<XCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-red-600 m-0" />
															)
														) : (
															""
														)}
													</p>
												</div>
											</>
										) : (
											""
										)}

										{entityType == "courses" ? (
											<>
												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														Is Featured?
													</h4>

													<p className="text-gray-500 text-sm text-normal capitalize">
														{detailObj?.featured === 1 ? (
															<CheckCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-blue-600 m-0" />
														) : (
															<XCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-red-600 m-0" />
														)}
													</p>
												</div>
												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														Is Trending?
													</h4>

													<p className="text-gray-500 text-sm text-normal capitalize">
														{detailObj?.trending === true ? (
															<CheckCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-blue-600 m-0" />
														) : (
															<XCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-red-600 m-0" />
														)}
													</p>
												</div>
											</>
										) : (
											""
										)}

										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Date
											</h4>

											<p className="text-gray-500 text-sm text-normal">
												{moment(
													detailObj?.date ||
														detailObj?.created_at ||
														detailObj?.time_published
												).format(DATE_FORMAT_ONE)}
											</p>
										</div>

										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Is Approved?
											</h4>

											<p className="text-gray-500 text-sm text-normal capitalize">
												{detailObj?.is_approved === 1 ? (
													<CheckCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-blue-600 m-0" />
												) : (
													<XCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-red-600 m-0" />
												)}
											</p>
										</div>

										{entityType == "courses" ? (
											<>
												<div className="flex flex-col gap-2 my-2 flex-1">
													<h4
														className={
															"block text-base font-medium text-gray-900 dark:text-gray-300"
														}>
														Is Buyable?
													</h4>

													<p className="text-gray-500 text-sm text-normal capitalize">
														{detailObj?.buyable === true ? (
															<CheckCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-blue-600 m-0" />
														) : (
															<XCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-red-600 m-0" />
														)}
													</p>
												</div>
											</>
										) : (
											""
										)}
									</div>

									{entityType == "services" ? (
										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Attributes
											</h4>
											<div className="flex items-center gap-4 flex-wrap">
												{detailObj?.attrs
													? detailObj?.attrs?.map((item, index) => {
															return (
																<div className="bg-blue-600 rounded-lg text-white font-inter text-sm font-normal p-2">
																	{item}
																</div>
															);
													  })
													: "N/A"}
											</div>
										</div>
									) : (
										""
									)}

									<div className="flex flex-col gap-2 my-2 flex-1">
										<h4
											className={
												"block text-base font-medium text-gray-900 dark:text-gray-300"
											}>
											Thumbnail
										</h4>
										<div className="h-16 w-16 overflow-hidden border border-blue-600 rounded-lg">
											<img
												src={
													entityType == "products"
														? detailObj?.thumbnail || "/productFallBackImg.png"
														: entityType == "services"
														? detailObj?.logo || "/serviceFallBackImg.png"
														: entityType == "articles"
														? detailObj?.thumbnail || "/serviceFallBackImg.png"
														: "/courseFallBackImg.png"
												}
												alt={"product-image"}
												className={"w-full h-full object-cover"}
											/>
										</div>
									</div>

									{entityType == "courses" ? (
										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Video
											</h4>
											{detailObj?.video ? (
												<div className="flex justify-between flex-col lg:flex-row gap-6 sm:gap-10 overflow-hidden">
													<video class="w-full h-auto max-w-full" controls>
														<source src={detailObj?.video} />
													</video>
												</div>
											) : (
												"N/A"
											)}
										</div>
									) : (
										""
									)}

									<div className="flex flex-col gap-2 my-2 flex-1">
										<h4
											className={
												"block text-base font-medium text-gray-900 dark:text-gray-300"
											}>
											Short Description
										</h4>
										<Markup
											content={
												detailObj?.short_description ||
												detailObj?.description ||
												"N/A"
											}
											className="text-gray-500 text-sm text-normal"
										/>
									</div>

									<div className="flex flex-col gap-2 my-2 flex-1">
										<h4
											className={
												"block text-base font-medium text-gray-900 dark:text-gray-300"
											}>
											Long Description
										</h4>
										<Markup
											content={
												detailObj?.long_description ||
												detailObj?.article_body ||
												"N/A"
											}
											className="text-gray-500 text-sm text-normal"
										/>
									</div>
								</>
							)}
						</Dialog.Description>

						{sourceType === "dashboard" ? (
							<>
								<div className="flex justify-between items-start p-4 rounded-t border-t border-b dark:border-gray-600">
									<Dialog.Title
										className={
											"text-xl font-semibold text-gray-900 dark:text-white"
										}>
										{itemTitle || "Item Detail"}
									</Dialog.Title>
								</div>

								<Dialog.Description>
									{_.size(itemDetails) > 0 ? (
										<div className="flex flex-col">
											{itemDetails.map((item) => {
												return (
													<>
														<div
															className="flex gap-4 flex-col items-stretch p-6"
															key={item?.id}>
															<div className="flex gap-4 items-center">
																{item?.image ? (
																	<img
																		src={
																			item?.image || "/productFallBackImg.png"
																		}
																		className="rounded-full w-8 h-8 object-cover shadow-md"
																		alt={item?.image}
																	/>
																) : (
																	<UserCircleIcon className="w-8 h-8" />
																)}

																<span className="text-base font-normal text-black">
																	<a href={`${ROUTES.PRODUCTS}/${item?.id}`}>
																		{item?.title ?? "Product"}
																	</a>
																</span>
															</div>
															<div className="flex flex-col gap-2 my-2 flex-1">
																<h4
																	className={
																		"block text-base font-medium text-gray-900 dark:text-gray-300"
																	}>
																	Is Deal?
																</h4>

																<p className="text-gray-500 text-sm text-normal capitalize">
																	{item?.is_deal === true ? (
																		<CheckCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-blue-600 m-0" />
																	) : (
																		<XCircleIcon className="w-8 h-8 md:w-6 md:h-6 text-red-600 m-0" />
																	)}
																</p>
															</div>
														</div>
													</>
												);
											})}
										</div>
									) : (
										<p className="text-lg mt-6 mb-4 flex items-center justify-center font-normal font-inter">
											No user found.
										</p>
									)}
								</Dialog.Description>
							</>
						) : (
							""
						)}
					</Dialog.Panel>
				</div>
			</Dialog>
		</Transition>
	);
}
