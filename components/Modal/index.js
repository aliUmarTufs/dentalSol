import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import LoginSignupModalText from "../LoginSignupModalText";

export default function Modal({
	isOpen,
	closeModalHandler,
	title,
	description,
	loginSignUpTextDesc,
}) {
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
					<Dialog.Panel className="relative w-full max-w-2xl h-96 overflow-y-auto md:h-auto rounded bg-white">
						<div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
							<Dialog.Title
								className={
									"text-xl font-semibold text-gray-900 dark:text-white"
								}>
								{title}
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
						<Dialog.Description>{description}</Dialog.Description>
						<LoginSignupModalText description={loginSignUpTextDesc} />
					</Dialog.Panel>
				</div>
			</Dialog>
		</Transition>
	);
}
