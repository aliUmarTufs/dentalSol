import { SET_USER_DATA_EMPTY, SET_USER_DATA_WHITE_LIST } from "../../constants";
import { LOGOUT_USER, SET_USER, SET_USER_DATA } from "../action-types";

export const SET_DATA = "SET_DATA";

export function MainReducer(state, action) {
  switch (action.type) {
    //////////////////// USER ACTIONS
    case SET_DATA:
      return { ...state, data: action.data };
    case SET_USER:
      return { ...state, userData: action.userData };
    case SET_USER_DATA: {
      SET_USER_DATA_WHITE_LIST(action.userData);
      return { ...state, userData: action.userData };
    }
    case LOGOUT_USER: {
      SET_USER_DATA_EMPTY();
      return { ...state, userData: null };
    }
  }
}
