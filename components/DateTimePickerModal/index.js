import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomButton from "../CustomButton";

export default function DateTimePickerModal({
  isOpenModal,
  closeModalHandler,
  startDate,
  setStartDate,
}) {
  const [startDateTime, setStartDateTime] = useState(new Date());

  console.log({ startDateTime }, startDateTime.setHours(2));
  console.log({startDateTime});
  return (
    <Transition
      show={isOpenModal}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={Fragment}
    >
      <Dialog onClose={closeModalHandler} className="relative z-102">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div
          className="fixed inset-0 bg-gray-600 opacity-60"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className="customFeaturedDemo p-2.5 relative w-full max-w-2xl h-4/5 overflow-y-auto rounded bg-white"
            style={{ borderRadius: 38 }}
          >
            <button
              type="button"
              className="flex text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto items-center dark:hover:bg-gray-600 dark:hover:text-white"
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

            <Dialog.Description className={"p-4"}>
              <ReactDatePicker
                selected={startDateTime}
                onChange={(date) => setStartDateTime(date)}
                // excludeTimes={[
                //   startDateTime.setHours(startDateTime.setMinutes(30), 16),
                // ]}
                excludeTimes={[
					startDateTime.setHours(2,30),
					startDateTime.setHours(3,0),

                ]}
                showTimeSelect
                inline
                dateFormat="MMMM d, yyyy h:mm aa"
              />

              <div className="flex items-center justify-center mt-8 md:mt-16">
                <CustomButton
                  btnText={"Book Now"}
                  clickHandler={() => alert("clicked")}
                  isPrimary={true}
                />
              </div>
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
