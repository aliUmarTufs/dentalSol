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

export default function ConfirmationModal({
  isOpen,
  closeModalHandler,
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
      as={Fragment}
    >
      <Dialog onClose={() => {}} className="relative z-102">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div
          className="fixed inset-0 bg-gray-600 opacity-60"
          aria-hidden="true"
        />
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          onClick={closeModalHandler}
        >
          <Dialog.Panel className="relative w-full max-w-2xl h-auto overflow-y-auto rounded bg-white">
            <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
              <Dialog.Title
                className={
                  "text-xl font-semibold text-gray-900 dark:text-white"
                }
              >
                {title}
              </Dialog.Title>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeModalHandler}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <Dialog.Description className={"p-4"}>
              {description}
            </Dialog.Description>

            <>
              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  className={
                    "inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  }
                  onClick={() => successHandler()}
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  <span> {successBtnText}</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={closeModalHandler}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  <span> {cancelBtnText}</span>
                </button>
              </div>
            </>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
