import { useState, Fragment, useRef } from "react";
import { Markup } from "interweave";
import { Dialog, Transition } from "@headlessui/react";
import {
	CheckCircleIcon,
	QuestionMarkCircleIcon,
	TrashIcon,
	UserCircleIcon,
	XCircleIcon,
} from "@heroicons/react/solid";
import _ from "lodash";
import ReactStars from "react-stars";
import Link from "next/link";
import {
	BASE_URL,
	REQUIRED_COMMENT,
	REQUIRED_RATING,
	ROUTES,
	Toast,
} from "../../constants";
import { useRouter } from "next/router";

export default function DealDetailModal({
	isOpen,
	closeModalHandler,
	detailTitle,
	detailObj,
	availUsersArr,
	availUserTitle,
	itemTitle,
	vendorTitle,
}) {
	const router = useRouter();

	return (
		<Transition
			show={isOpen ?? false}
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
							<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
								<div className="flex flex-col gap-2 my-2 flex-1">
									<h4
										className={
											"block text-base font-medium text-gray-900 dark:text-gray-300"
										}>
										Country
									</h4>

									<p className="text-gray-500 text-sm text-normal capitalize">
										{detailObj?.country}
									</p>
								</div>
								<div className="flex flex-col gap-2 my-2 flex-1">
									<h4
										className={
											"block text-base font-medium text-gray-900 dark:text-gray-300"
										}>
										Deal Type
									</h4>

									<p className="text-gray-500 text-sm text-normal capitalize">
										{detailObj?.deal_type}
									</p>
								</div>
							</div>
							<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
								<div className="flex flex-col gap-2 my-2 flex-1">
									<h4
										className={
											"block text-base font-medium text-gray-900 dark:text-gray-300"
										}>
										Coupon Code
									</h4>

									<p className="text-gray-500 text-sm text-normal">
										{detailObj?.coupon_code}
									</p>
								</div>
								<div className="flex flex-col gap-2 my-2 flex-1">
									<h4
										className={
											"block text-base font-medium text-gray-900 dark:text-gray-300"
										}>
										Expiry Date
									</h4>

									<p className="text-gray-500 text-sm text-normal">
										{detailObj?.expiry_data}
									</p>
								</div>
							</div>
							<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
								<div className="flex flex-col gap-2 my-2 flex-1">
									<h4
										className={
											"block text-base font-medium text-gray-900 dark:text-gray-300"
										}>
										Location
									</h4>

									<p className="text-gray-500 text-sm text-normal">
										{detailObj?.location}
									</p>
								</div>
								<div className="flex flex-col gap-2 my-2 flex-1">
									<h4
										className={
											"block text-base font-medium text-gray-900 dark:text-gray-300"
										}>
										Net Savings
									</h4>

									<p className="text-gray-500 text-sm text-normal">
										{detailObj?.net_savings}
									</p>
								</div>
							</div>
							{!_.isNull(detailObj?.free_quantity) ||
							!_.isNull(detailObj?.item_quantity) ? (
								<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
									<div className="flex flex-col gap-2 my-2 flex-1">
										<h4
											className={
												"block text-base font-medium text-gray-900 dark:text-gray-300"
											}>
											Item Quantity
										</h4>

										<p className="text-gray-500 text-sm text-normal">
											{detailObj?.item_quantity}
										</p>
									</div>
									<div className="flex flex-col gap-2 my-2 flex-1">
										<h4
											className={
												"block text-base font-medium text-gray-900 dark:text-gray-300"
											}>
											Free Quantity
										</h4>

										<p className="text-gray-500 text-sm text-normal">
											{detailObj?.free_quantity}
										</p>
									</div>
								</div>
							) : (
								""
							)}

							<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
								<div className="flex flex-col gap-2 my-2 flex-1">
									<h4
										className={
											"block text-base font-medium text-gray-900 dark:text-gray-300"
										}>
										Is Approved
									</h4>

									<p className="text-gray-500 text-sm text-normal">
										{detailObj?.is_approved === true ? (
											<CheckCircleIcon className="w-6 h-6 text-green-600" />
										) : (
											<XCircleIcon className="w-6 h-6 text-red-600" />
										)}
									</p>
								</div>
								<div className="flex flex-col gap-2 my-2 flex-1">
									<h4
										className={
											"block text-base font-medium text-gray-900 dark:text-gray-300"
										}>
										Is Expired
									</h4>

									<p className="text-gray-500 text-sm text-normal">
										{detailObj?.is_expire === 1 ? (
											<CheckCircleIcon className="w-6 h-6 text-green-600" />
										) : (
											<XCircleIcon className="w-6 h-6 text-red-600" />
										)}
									</p>
								</div>
							</div>

							<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
								{!_.isNull(detailObj?.quantity) ? (
									<div className="flex flex-col gap-2 my-2 flex-1">
										<h4
											className={
												"block text-base font-medium text-gray-900 dark:text-gray-300"
											}>
											Discount
										</h4>

										<p className="text-gray-500 text-sm text-normal">
											{`${detailObj?.quantity}% off`}
										</p>
									</div>
								) : (
									""
								)}

								<div className="flex flex-col gap-2 my-2 flex-1">
									<h4
										className={
											"block text-base font-medium text-gray-900 dark:text-gray-300"
										}>
										Tag Line
									</h4>

									<p className="text-gray-500 text-sm text-normal">
										{detailObj?.tag_line}
									</p>
								</div>
							</div>
						</Dialog.Description>

						<div className="flex justify-between items-start p-4 rounded-t border-t border-b dark:border-gray-600">
							<Dialog.Title
								className={
									"text-xl font-semibold text-gray-900 dark:text-white"
								}>
								{itemTitle || "Item Detail"}
							</Dialog.Title>
						</div>

						<Dialog.Description className={`p-4`}>
							{_.size(detailObj?.itemDetails) > 0 ? (
								<div className="flex flex-col">
									{detailObj?.itemDetails.map((item) => {
										return (
											<>
												<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
													<div className="flex flex-col gap-2 my-2 flex-1">
														<h4
															className={
																"block text-base font-medium text-gray-900 dark:text-gray-300"
															}>
															Title
														</h4>

														<p className="text-gray-500 text-sm text-normal capitalize">
															{item?.title || item?.name || "N/A"}
														</p>
													</div>
													<div className="flex flex-col gap-2 my-2 flex-1">
														<h4
															className={
																"block text-base font-medium text-gray-900 dark:text-gray-300"
															}>
															Item Description
														</h4>

														{item?.short_description ? (
															<Markup
																content={item?.short_description}
																className="text-gray-500 text-sm text-normal capitalize"
															/>
														) : (
															""
														)}
													</div>
												</div>

												<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
													<div className="flex flex-col gap-2 my-2 flex-1">
														<h4
															className={
																"block text-base font-medium text-gray-900 dark:text-gray-300"
															}>
															Item Category
														</h4>

														<p className="text-gray-500 text-sm text-normal capitalize">
															{item?.category?.name || item?.category}
														</p>
													</div>
													<div className="flex flex-col gap-2 my-2 flex-1">
														<h4
															className={
																"block text-base font-medium text-gray-900 dark:text-gray-300"
															}>
															Item Price
														</h4>

														<p className="text-gray-500 text-sm text-normal capitalize">
															{item?.Price || item?.price}
														</p>
													</div>
												</div>
											</>
										);
									})}
								</div>
							) : (
								<p className="text-lg mt-6 mb-4 flex items-center justify-center font-normal font-inter">
									No Detail found.
								</p>
							)}
						</Dialog.Description>

						<div className="flex justify-between items-start p-4 rounded-t border-t border-b dark:border-gray-600">
							<Dialog.Title
								className={
									"text-xl font-semibold text-gray-900 dark:text-white"
								}>
								{vendorTitle || "Vendor Detail"}
							</Dialog.Title>
						</div>

						<Dialog.Description className={`p-4`}>
							{detailObj?.organizations?.organization_user ? (
								<div className="flex flex-col">
									<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Name
											</h4>

											<p className="text-gray-500 text-sm text-normal capitalize">
												{detailObj?.organizations?.organization_user?.user_name}
											</p>
										</div>
										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Email
											</h4>

											<p className="text-gray-500 text-sm text-normal capitalize">
												{
													detailObj?.organizations?.organization_user
														?.user_email
												}
											</p>
										</div>
									</div>

									<div className="flex items-stretch justify-between gap:2 md:gap-6 flex-col md:flex-row">
										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Country
											</h4>

											<p className="text-gray-500 text-sm text-normal capitalize">
												{
													detailObj?.organizations?.organization_user
														?.user_country
												}
											</p>
										</div>
										<div className="flex flex-col gap-2 my-2 flex-1">
											<h4
												className={
													"block text-base font-medium text-gray-900 dark:text-gray-300"
												}>
												Phone Number
											</h4>

											<p className="text-gray-500 text-sm text-normal capitalize">
												{
													detailObj?.organizations?.organization_user
														?.phone_number
												}
											</p>
										</div>
									</div>
								</div>
							) : (
								<>
									<p className="text-lg mt-6 mb-4 flex items-center justify-center font-normal font-inter">
										No Detail found.
									</p>
								</>
							)}
						</Dialog.Description>

						<div className="flex justify-between items-start p-4 rounded-t border-t border-b dark:border-gray-600">
							<Dialog.Title
								className={
									"text-xl font-semibold text-gray-900 dark:text-white"
								}>
								{availUserTitle}
							</Dialog.Title>
						</div>

						<Dialog.Description>
							{_.size(availUsersArr) > 0 ? (
								<div className="flex flex-col dealAvailUsers">
									{availUsersArr.map((item) => {
										return (
											<div
												className="flex gap-4 items-center p-6"
												key={item?.id}>
												{item?.users?.image ? (
													<img
														src={item.users.image || "/courseFallBackImg.png"}
														className="rounded-full w-8 h-8 object-contain shadow-md"
														alt={item?.users?.username}
													/>
												) : (
													<UserCircleIcon className="w-8 h-8" />
												)}

												<span className="text-base font-normal text-black">
													{item?.users?.user_email ?? "N/A"}
												</span>
											</div>
										);
									})}
								</div>
							) : (
								<p className="text-lg mt-6 mb-4 flex items-center justify-center font-normal font-inter">
									No user found.
								</p>
							)}
						</Dialog.Description>
					</Dialog.Panel>
				</div>
			</Dialog>
		</Transition>
	);
}
