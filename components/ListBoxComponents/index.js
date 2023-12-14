import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import _ from "lodash";

export const ListBoxComponents = ({
  valueKey,
  valueSetter,
  optionsList,
  type,
  isDisable = false,
  isRef = false,
  refType,
}) => {
  return (
    <Listbox
      value={valueKey}
      disabled={isDisable}
      onChange={(e) => {
        valueSetter(e);
      }}
    >
      <div className="relative">
        <Listbox.Button
          ref={isRef ? refType : null}
          className="bg-white h-12 border border-gray-400 text-left text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {/* <span className="block truncate">{country.title}</span> */}
          <span className="block truncate">
            {type === "city"
              ? valueKey?.name
              : valueKey?.vendor_categories?.category_name ||
                valueKey?.state ||
                valueKey?.name ||
                valueKey?.title ||
                valueKey?.company?.name ||
                valueKey?.label ||
                valueKey?.filter_name ||
                valueKey?.mode ||
                valueKey?.id ||
                valueKey?.name}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
            {_.size(optionsList) > 0 ? (
              optionsList?.map((o) => {
                return (
                  <Listbox.Option
                    key={o.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`
                    }
                    value={o}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {type == "city"
                            ? o?.name
                            : o?.vendor_categories?.category_name ||
                              o?.state ||
                              o?.name ||
                              o?.title ||
                              o?.company?.name ||
                              o?.mode ||
                              o?.label ||
                              o?.filter_name ||
                              o?.id ||
                              o?.user_name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                );
              })
            ) : (
              <Listbox.Option
                className={
                  "relative cursor-default select-none py-2 pl-10 pr-4"
                }
                disabled
              >
                No List Found
              </Listbox.Option>
            )}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
