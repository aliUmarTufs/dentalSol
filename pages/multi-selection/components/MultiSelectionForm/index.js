import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { REQUIRED_SERVICES_SELECTION } from "../../../../constants";
import CategorySelectionForm from "../CategoryForm";
import FormInfoSummary from "../FormInfoSummary";
import ServiceChecker from "../ServiceChecker";

export default function MultiSelectionForm({
  step,
  setStep,
  formData,
  updateFormData,
}) {
  const [servicesInfo, setServicesInfo] = useState({
    ...formData.servicesInfo,
  });

  const [servicesSelected, setServicesSelected] = useState(
    formData?.servicesSelected || []
  );

  const [categoryInfo, setCategoryInfo] = useState({
    ...formData.categoryInfo,
  });
  const [addOnsInfo, setAddOnsInfo] = useState({
    ...formData.addOnsInfo,
  });

  /* validation state hook */
  const [isValidServiceChecked, setIsValidServiceChecked] = useState(true);

  /* error messages */
  const [serviceErrMsg, setServiceErrMsg] = useState("");

  const validateForm = () => {
    let isValid = true;
    setIsValidServiceChecked(true);

    if (
      servicesInfo.isDealChecked == false &&
      servicesInfo.isCourseChecked == false &&
      servicesInfo.isProductChecked == false &&
      servicesInfo.isArticleChecked == false &&
      servicesInfo.isDirectoryChecked == false
    ) {
      setIsValidServiceChecked(false);
      setServiceErrMsg(REQUIRED_SERVICES_SELECTION);
      isValid = false;
    } else {
      setServiceErrMsg("");
      updateFormData(servicesInfo);
      setStep((s) => s + 1);
    }
    return isValid;
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (step == 1) {
      validateForm();
    } else if (step == 2) {
      updateFormData(categoryInfo);
    } else if (step == 3) {
      // updateFormData(addOnsInfo);
      alert("s");
    }

    if (step != 1) {
      setStep((s) => s + 1);
    }
  }
  function handleGoBack() {
    setStep((s) => {
      return s - 1;
    });
  }

  // function formValidation() {
  // 	let hasValidName = nameRegex.test(servicesInfo.name);
  // 	let hasValidEmailAddress = emailRegex.test(servicesInfo.email);
  // 	let hasValidPhoneNumber = phoneNumberRegex.test(servicesInfo.phoneNumber);
  // 	if (servicesInfo.name == "") hasValidName = undefined;
  // 	if (servicesInfo.email == "") hasValidEmailAddress = undefined;
  // 	if (servicesInfo.phoneNumber == "") hasValidPhoneNumber = undefined;
  // 	setValidForm({
  // 		hasValidName,
  // 		hasValidEmailAddress,
  // 		hasValidPhoneNumber,
  // 	});
  // 	if (
  // 		[hasValidName, hasValidEmailAddress, hasValidPhoneNumber].every(
  // 			(value) => value == true
  // 		)
  // 	) {
  // 		updateFormData(servicesInfo);
  // 		setStep((s) => s + 1);
  // 	}
  // }

  console.log({ servicesInfo });

  return (
    <form onSubmit={handleSubmit}>
      {step == 1 && (
        <>
          <div className="p-4 md:p-8 md:pb-3">
            <h1 className="font-segoeui tracking-tight font-black text-gray-900 text-xl sm:text-2xl md:text-3xl relative">
              <span className="block inline">Select</span>{" "}
              <span className="block text-blue-600 inline">Services</span>
            </h1>
          </div>
          <ServiceChecker
            servicesInfo={servicesInfo}
            setServicesInfo={setServicesInfo}
            isValidServiceChecked={isValidServiceChecked}
            serviceErrMsg={serviceErrMsg}
            setIsValidServiceChecked={setIsValidServiceChecked}
            serviceArr={servicesSelected}
			setServiceArr={setServicesSelected}
          />
        </>
      )}
      {step == 2 && (
        <>
          <div className="p-4 md:p-8 md:pb-3">
            <h1 className="font-segoeui tracking-tight font-black text-gray-900 text-xl sm:text-2xl md:text-3xl relative pl-12">
              <ArrowLeftIcon
                onClick={handleGoBack}
                className="absolute m-auto top-0 bottom-0 left-0 w-6 h-6 z-10 cursor-pointer text-purplish-800"
              />
              <span className="block inline">Select</span>{" "}
              <span className="block text-blue-600 inline">Category</span>
            </h1>
          </div>
          <hr className="w-full h-px mt-1 mb-5 bg-purplish-200 bg-opacity-50 border-0 rounded" />

          {servicesInfo.isCourseChecked === true ? (
            <CategorySelectionForm
              entityName={"course"}
              categoryInfo={categoryInfo}
              setCategoryInfo={setCategoryInfo}
              servicesInfo={servicesInfo}
            />
          ) : servicesInfo.isProductChecked === true ? (
            <CategorySelectionForm
              entityName={"product"}
              categoryInfo={categoryInfo}
              setCategoryInfo={setCategoryInfo}
              servicesInfo={servicesInfo}
            />
          ) : servicesInfo.isArticleChecked === true ? (
            <CategorySelectionForm
              entityName={"article"}
              categoryInfo={categoryInfo}
              setCategoryInfo={setCategoryInfo}
              servicesInfo={servicesInfo}
            />
          ) : servicesInfo.isDirectoryChecked === true ? (
            <CategorySelectionForm
              entityName={"directory"}
              categoryInfo={categoryInfo}
              setCategoryInfo={setCategoryInfo}
              servicesInfo={servicesInfo}
            />
          ) : servicesInfo.isDealChecked === true ? (
            <CategorySelectionForm
              entityName={"deal"}
              categoryInfo={categoryInfo}
              setCategoryInfo={setCategoryInfo}
              servicesInfo={servicesInfo}
            />
          ) : null}
        </>
        // <SelectPlan
        // 	selectPlanInfo={selectPlanInfo}
        // 	setSelectPlanInfo={setSelectPlanInfo}
        // />
      )}
      {step == 3 && (
        <>
          <div className="p-4 md:p-8 md:pb-3">
            <h1 className="font-segoeui tracking-tight font-black text-gray-900 text-xl sm:text-2xl md:text-3xl relative pl-12">
              <ArrowLeftIcon
                onClick={handleGoBack}
                className="absolute m-auto top-0 bottom-0 left-0 w-6 h-6 z-10 cursor-pointer text-purplish-800"
              />
              <span className="block inline">Selected</span>{" "}
              <span className="block text-blue-600 inline">Category</span>
            </h1>
          </div>
          <hr className="w-full h-px mt-1 mb-5 bg-purplish-200 bg-opacity-50 border-0 rounded" />
          <FormInfoSummary formData={formData} />
        </>
      )}

      <hr className="w-full h-px my-4 bg-purplish-200 bg-opacity-50 border-0 rounded" />
      <div className="p-4 md:p-8 md:pt-2">
        <button
          disabled={step == 3 ? true : false}
          type="submit"
          className={`${
            step == 3 ? "cursor-not-allowed" : "cursor-pointer"
          } font-inter w-full h-14 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          {step == 3 ? "Submit" : "Next"}
        </button>
      </div>
    </form>
  );
}
