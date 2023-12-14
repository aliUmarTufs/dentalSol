import { UserCircleIcon } from "@heroicons/react/solid";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import ReactStars from "react-stars";
import { DATE_FORMAT_THREE } from "../../constants";
import { MainContext } from "../../context-api/MainContext";
import CustomButton from "../CustomButton";

export default function ReviewBox({
  objectType,
  updateReviewHandler,
  setIsLoggedIn,
}) {
  const [loggedInUser, setIsLoggedInUser] = useState(null);
  const { MainState, dispatch } = useContext(MainContext);

  useEffect(() => {
    // const userDetails = localStorage.getItem("userData");
    const userDetails = MainState?.userData;
    if (!_.isNull(userDetails)) {
      // setIsLoggedInUser(JSON.parse(userDetails));
      setIsLoggedInUser(userDetails);

      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  return (
    <div
      key={objectType?.id}
      className="py-5 mb-2 sm:mb-4 flex flex-col justify-around w-full"
    >
      <div className="flex flex-row items-stretch">
        <div className="border-black rounded-md">
          {objectType?.users?.image ? (
            <img
              src={objectType?.users?.image}
              alt={`${objectType?.users?.user_name}.`}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <UserCircleIcon className="w-12 h-12" />
          )}
        </div>
        <div className="ml-4">
          <h4 className="text-lg font-medium text-black">
            {objectType?.users?.username || "Unknown"}
          </h4>
          <h6 className="text-sm font-normal text-black mt-1">
            {moment(objectType?.users?.created_at).format(DATE_FORMAT_THREE)}
          </h6>
          <div className="mt-1 flex items-center">
            <ReactStars
              count={5}
              size={24}
              isHalf={true}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#F8BB46"
              value={objectType?.stars}
              edit={false}
            />
          </div>
        </div>
        {loggedInUser && loggedInUser?.id == objectType?.user_id ? (
          <div className="ml-auto">
            <CustomButton
              clickHandler={updateReviewHandler}
              isPrimary={true}
              btnText={"Edit"}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="text-left mt-4 ml-16 space-y-6 text-sm font-normal text-black h-10 textTruncateTwo">
        &quot;{objectType?.review}&quot;
      </div>
    </div>
  );
}
