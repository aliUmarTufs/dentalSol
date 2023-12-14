import { CalendarIcon, UserIcon } from "@heroicons/react/outline";
import { ClockIcon, MailIcon, PhoneIcon } from "@heroicons/react/solid";
import { Markup } from "interweave";
import _ from "lodash";
import moment from "moment";
import * as cheerio from "cheerio";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import {
  BASE_URL,
  DATE_FORMAT_THREE,
  DEAL_TYPE,
  ENTITY_TYPE,
  ENTITY_TYPE_ARRAY,
  NOT_FOUND,
  ROUTES,
  Toast,
} from "../../constants";
import CustomButton from "../CustomButton";
import Modal from "../Modal";
import AlertBox from "../AlertBox";
import { MainContext } from "../../context-api/MainContext";

export default function VideosSection({ objectType }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setIsLoggedInUser] = useState(null);
  const [dealDetails, setDealDetail] = useState(null);
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
    <>
      <div
        className="flex justify-between flex-col lg:flex-row gap-6 sm:gap-10 mt-8 md:mt-14 overflow-hidden"
        style={{ borderRadius: 30 }}
      >
        <video class="w-full h-auto max-w-full" controls>
          <source src={objectType?.video} />
        </video>
      </div>
    </>
  );
}
