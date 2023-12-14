import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { CustomButton, HeadMeta, Navbar } from "../../components";
import {
  isLoggedInIndication,
  REQUIRED_SERVICES_SELECTION,
  ROUTES,
} from "../../constants";
import { MultiSelectionForm } from "./components";

export default function MultiSelection() {
  const router = useRouter();
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [formData, setFormData] = useState({
    servicesInfo: {
      isDealChecked: false,
      isCourseChecked: false,
      isProductChecked: false,
      isArticleChecked: false,
      isDirectoryChecked: false,
    },
    servicesSelected: [],
    categoryInfo: { topCategoryData: [], categoryData: [], subCatData: [] },
    selectedSubCategoryInfo: {
      selectedSubCat: [],
    },
  });
  const [step, setStep] = useState(1);

  function updateFormData(info) {
    if (step == 1) {
      setFormData({
        ...formData,
        servicesInfo: info,
      });
    } else if (step == 2) {
      setFormData({
        ...formData,
        categoryInfo: info,
      });
    } else if (step == 3) {
      setFormData({
        ...formData,
        selectedSubCategoryInfo: info,
      });
    }
  }

  useEffect(() => {
    if (isLoggedInIndication()) {
      let LoggedInUserData = async () => {
        //   let getuser = await getLoggedInUser();
        //   if (!_.isNull(getuser)) {
        //     setLoggedinUser(JSON.parse(getuser));
        //     setIsLoggedInUser(true);
        //     if (router?.query?.redirect) {
        //       setRedirectUrl(router?.query?.redirect);
        //     }
        //   }
        setIsLoggedInUser(true);
      };

      LoggedInUserData();
    } else {
      setIsLoggedInUser(false);
      router.push(ROUTES.LOGIN);
    }
  }, []);

  return (
    <>
      <HeadMeta
        title={"Dent247 | Multi Selection"}
        description="description"
        content={"Dent247 | Multi Selection"}
      />
      <Navbar isDashboard={true} />
      <div className="bg-white">
        {!isLoggedInUser ? (
          <div className="my-2 flex justify-center w-full h-screen items-center">
            <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
          </div>
        ) : (
          <>
            <div className="max-w-4xl mx-auto px-4 lg:px-2 pt-44 pb-8 md:pb-12 lg:pb-20">
              <img
                src="/logo.png"
                alt="Dent247"
                className="w-8 sm:w-12 md:w-16 h-auto mx-auto mb-4 md:mb-8"
              />
              <div className="rounded-3xl border border-solid border-gray-700">
                <MultiSelectionForm
                  step={step}
                  setStep={setStep}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
