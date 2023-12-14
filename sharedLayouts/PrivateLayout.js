import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {
  GET_USER_DATA_WHITE_LIST,
  ROLE_TYPES,
  ROUTES,
  VERIFY_USER_URL,
} from "../constants";
import { LOGOUT_USER } from "../context-api/action-types";
import { MainContext } from "../context-api/MainContext";
import { request } from "../services/service";

const PrivateLayout = ({ children, pageProps }) => {
  const router = useRouter();
  //   const [isLoading, setIsLoading] = useState(false);
  const { MainState, dispatch } = useContext(MainContext);

  const getUser = MainState?.userData;
  useEffect(() => {
    const userData = GET_USER_DATA_WHITE_LIST();

    if (!userData && pageProps?.isProtected) {
      dispatch({ type: LOGOUT_USER, userData: null });
      router.push(ROUTES.LOGIN);
    } else if (
      userData &&
      userData?.role_type === ROLE_TYPES.user &&
      pageProps?.isVendor
    ) {
      router.push(ROUTES.DASHBOARD);
    }

    const verify_user = async () => {
      let res = await request({
        apiurl: VERIFY_USER_URL,
        data: { email: userData?.user_email },
      });
      console.log({ res });
    };
    verify_user();

    console.log({ pageProps, userData });
  }, []);

  console.log({ MainState });

  return <>{children}</>;
};
export default PrivateLayout;
