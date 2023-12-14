import { useState, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
	CheckCircleIcon,
	QuestionMarkCircleIcon,
	TrashIcon,
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

export default function PromoMakreting({
	isOpen,
	closeModalHandler,
	videoUrl,
	title,
	description,
	successBtnText,
	successHandler,
	cancelBtnText,
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
					{/* <Dialog.Panel className="relative p-4 w-full max-w-2xl h-auto overflow-y-auto rounded bg-white"> */}
					<Dialog.Panel className="relative p-4 w-full max-w-2xl h-96 rounded bg-white">
						<div className="flex justify-between items-start pb-2">
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:text-gray-900 rounded-lg text-sm ml-auto inline-flex items-center"
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
						<video
							class="w-full h-80 max-w-full"
							controls
							autoplay="autoplay"
							muted>
							<source src={videoUrl} />
						</video>
					</Dialog.Panel>
				</div>
			</Dialog>
		</Transition>
	);
}
