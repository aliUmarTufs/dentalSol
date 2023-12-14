// import { GET_USER_DATA_WHITE_LIST } from "@/constants";
import React, { useEffect, useReducer } from "react";
import { GET_USER_DATA_WHITE_LIST } from "../constants";
// import { GET_USER_DATA_WHITE_LIST } from "../constants";
import { SET_USER } from "./action-types";
import { MainReducer } from "./reducers/MainReducer";

export const MainContext = React.createContext(null);

export default function MainProvider({ children }) {
  const [MainState, dispatch] = useReducer(MainReducer, {
    data: false,
    userData: null,
    // cart: [],
  });

  useEffect(() => {
    const userData = GET_USER_DATA_WHITE_LIST();
    // const userCart = GET_USER_CART_WHITE_LIST()
    console.log({ userData });
    if (userData) {
      dispatch({ type: SET_USER, userData });
    }
    // if (userCart?.length) {
    //   dispatch({ type: SET_CART_ALL_DATA, payload: userCart })
    // }
  }, []);

  const data = {
    MainState,
    dispatch,
  };

  return <MainContext.Provider value={data}>{children}</MainContext.Provider>;
}
