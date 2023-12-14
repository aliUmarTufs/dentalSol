import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment, useState } from "react";
export const ComboBoxComponent = ({
	valueKey,
	valueSetter,
	optionsList,
	type,
	isDisable = false,
	itemQuery,
	itemTypeRef,
	isRef,
	refType,
	setItemQuery,
}) => {
	const [allOptionsChecked, setAllOptionsChecked] = useState(false);
	return (
		<Combobox
			value={valueKey}
			disabled={isDisable}
			onChange={(e) => {
				let arrFilter;
				if (type === "areaOfInt") {
					arrFilter = _.filter(e, (item) => {
						return item.id === "all_aoi";
					});

					if (arrFilter.length > 0) {
						setAllOptionsChecked(true);
						valueSetter(optionsList);
					} else {
						if (allOptionsChecked === true) {
							setAllOptionsChecked(false);
							valueSetter([]);
						} else {
							setAllOptionsChecked(false);
							valueSetter(e);
						}
					}
				} else {
					valueSetter(e);
				}
			}}
			multiple>
			<div className="relative">
				<div className="relative overflow-auto text-left bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
					{valueKey?.length > 0 && (
						<div className="flex gap-2 h-auto flex-wrap">
							{valueKey?.map((person) => (
								<span
									className="bg-black text-white text-xs p-1 h-8 flex items-center rounded-md"
									key={person.id}>
									{person?.name ||
										person?.label ||
										person?.user_name ||
										person?.service_name ||
										person?.category_name}
								</span>
							))}
						</div>
					)}
					<Combobox.Input
						className="w-full border-none py-0 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
						displayValue={(person) => person?.name}
						onChange={(event) => setItemQuery(event.target.value)}
					/>
					<Combobox.Button
						ref={isRef ? refType : null}
						className="absolute inset-y-0 right-0 flex items-center pr-2">
						<ChevronDownIcon
							className="h-5 w-5 text-gray-400"
							aria-hidden="true"
						/>
					</Combobox.Button>
				</div>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					afterLeave={() => setItemQuery("")}>
					<Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{optionsList?.length === 0 && itemQuery !== "" ? (
							<Combobox.Option
								className="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900"
								disabled>
								Nothing found.
							</Combobox.Option>
						) : (
							optionsList?.map((person) => (
								<Combobox.Option
									key={person.id}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 pr-4 ${
											active ? "bg-blue-600 text-white" : "text-gray-900"
										}`
									}
									value={person}>
									{({ selected, active }) => {
										return (
											<>
												<span
													className={`block truncate ${
														selected ? "font-medium" : "font-normal"
													}`}>
													{person?.name ||
														person?.label ||
														person?.user_name ||
														person?.service_name ||
														person?.category_name}
												</span>
												{selected ? (
													<span
														className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
															active ? "text-white" : "text-teal-600"
														}`}>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										);
									}}
								</Combobox.Option>
							))
						)}
					</Combobox.Options>
				</Transition>
			</div>
		</Combobox>
	);
};
