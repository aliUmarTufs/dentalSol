import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useState } from "react";

export default function ServiceChecker({
  servicesInfo,
  setServicesInfo,
  isValidServiceChecked,
  setIsValidServiceChecked = true,
  serviceErrMsg,
  serviceArr,
  setServicesSelected
}) {
  console.log({ serviceArr });

  return (
    <>
      <div className="p-4 md:p-8 md:pb-4 flex flex-col gap-4">
        {/* Deals Checkbox */}
        <div className="flex items-center mb-4">
          <input
            id="deals-checkbox"
            type="checkbox"
            checked={servicesInfo.isDealChecked}
            onChange={(e) => {
              setServicesInfo(
                {
                  ...servicesInfo,
                  isDealChecked: e.target.checked,
                },
                setIsValidServiceChecked(true)
              );
              if (e.target.checked) {
                serviceArr.push("Deals");
              } else {
                serviceArr?.filter(function (ele) {
                  return ele != "Deals";
                });

				// setServicesSelected(serviceArr)
				
              }
            }}
            value={servicesInfo.isDealChecked}
            className="form-checkbox w-6 h-6 text-blue-600 bg-transparent border-black border-2 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            for="deals-checkbox"
            className="ml-2 text-xl font-normal text-purplish-700"
          >
            Deals
          </label>
        </div>

        {/* Course Checkbox */}
        <div className="flex items-center mb-4">
          <input
            id="course-checkbox"
            type="checkbox"
            checked={servicesInfo.isCourseChecked}
            onChange={(e) =>
              setServicesInfo(
                {
                  ...servicesInfo,
                  isCourseChecked: e.target.checked,
                },
                setIsValidServiceChecked(true)
              )
            }
            value={servicesInfo.isCourseChecked}
            className="form-checkbox w-6 h-6 text-blue-600 bg-transparent border-black border-2 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            for="course-checkbox"
            className="ml-2 text-xl font-normal text-purplish-700"
          >
            Courses
          </label>
        </div>

        {/* Product Checkbox */}
        <div className="flex items-center mb-4">
          <input
            id="product-checkbox"
            type="checkbox"
            checked={servicesInfo.isProductChecked}
            onChange={(e) =>
              setServicesInfo(
                {
                  ...servicesInfo,
                  isProductChecked: e.target.checked,
                },
                setIsValidServiceChecked(true)
              )
            }
            value={servicesInfo.isProductChecked}
            className="form-checkbox w-6 h-6 text-blue-600 bg-transparent border-black border-2 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            for="product-checkbox"
            className="ml-2 text-xl font-normal text-purplish-700"
          >
            Products
          </label>
        </div>

        {/* Article Checkbox */}
        <div className="flex items-center mb-4">
          <input
            id="article-checkbox"
            type="checkbox"
            checked={servicesInfo.isArticleChecked}
            onChange={(e) =>
              setServicesInfo(
                {
                  ...servicesInfo,
                  isArticleChecked: e.target.checked,
                },
                setIsValidServiceChecked(true)
              )
            }
            value={servicesInfo.isArticleChecked}
            className="form-checkbox w-6 h-6 text-blue-600 bg-transparent border-black border-2 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            for="article-checkbox"
            className="ml-2 text-xl font-normal text-purplish-700"
          >
            Articles
          </label>
        </div>

        {/* Services/Directory Checkbox */}
        <div className="flex items-center mb-4">
          <input
            id="service-checkbox"
            type="checkbox"
            checked={servicesInfo.isDirectoryChecked}
            onChange={(e) =>
              setServicesInfo(
                {
                  ...servicesInfo,
                  isDirectoryChecked: e.target.checked,
                },
                setIsValidServiceChecked(true)
              )
            }
            value={servicesInfo.isDirectoryChecked}
            className="form-checkbox w-6 h-6 text-blue-600 bg-transparent border-black border-2 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            for="service-checkbox"
            className="ml-2 text-xl font-normal text-purplish-700"
          >
            Directory
          </label>
        </div>

        {!isValidServiceChecked ? (
          <span className={"text-sm text-red-500"}>{serviceErrMsg}</span>
        ) : (
          ""
        )}
      </div>

      {/* <button
				onClick={nextStep}
				className={`font-inter cursor-pointer w-full h-14 mt-8 md:mt-12 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}>
				Next
			</button> */}
    </>
  );
}
