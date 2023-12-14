/* eslint-disable */
import { BASE_URL, GET_USER_DATA_WHITE_LIST, REQUEST_TYPE } from "../constants";
import axios from "axios";

let USER_TOKEN = "";
export const getCall = async (
  BASE_URL_UPDATED = BASE_URL,
  urlObj,
  params = "",
  query = "",
  headers
) =>
  new Promise(async (resolve, reject) => {
    let userData = GET_USER_DATA_WHITE_LIST();
    let Url = `${urlObj.url}`;
    if (params) {
      Url = `${Url}/` + params;
    }
    if (query) {
      Url = `${Url}?` + query;
    }
    if (urlObj?.accesstoken) {
      USER_TOKEN = userData?.auth_token || "";
    }
    try {
      const response = await axios.get(`${BASE_URL_UPDATED}${Url}`, {
        headers: {
          ...(headers ? { ...headers } : {}),
          ...(urlObj?.accesstoken
            ? { Authorization: `Bearer ${USER_TOKEN}` }
            : {}),
        },
      });
      if (response?.data?.length && response.status === 200) {
        let data = {
          success: true,
          data: response.data,
        };
        resolve({ data });
      }
      resolve(response);
    } catch (e) {
      if (e?.response?.status === 401) {
      }
      reject(e);
    }
  });
export const deleteCall = async (
  BASE_URL_UPDATED = BASE_URL,

  urlObj,
  params = "",
  query = "",
  headers
) =>
  new Promise(async (resolve, reject) => {
    let userData = GET_USER_DATA_WHITE_LIST();

    let Url = `${urlObj.url}`;
    if (params) {
      Url = `${Url}/` + params;
    }
    if (query) {
      Url = `${Url}?` + query;
    }
    if (urlObj?.accesstoken) {
      USER_TOKEN = userData?.auth_token || "";
    }
    try {
      const response = await axios.delete(`${BASE_URL_UPDATED}${Url}`, {
        headers: {
          ...(headers ? { ...headers } : {}),
          ...(urlObj?.accesstoken
            ? { Authorization: `Bearer ${USER_TOKEN}` }
            : {}),
        },
      });

      resolve(response);
    } catch (e) {
      if (e?.response?.status === 401) {
      }
      reject(e);
    }
  });

export const postCall = async (
  BASE_URL_UPDATED = BASE_URL,

  urlObj,
  data = {},
  params = "",
  query = "",
  headers
) =>
  new Promise(async (resolve, reject) => {
    let userData = GET_USER_DATA_WHITE_LIST();

    let Url = `${urlObj.url}`;
    if (params) {
      Url = `${Url}/` + params;
    }
    if (query) {
      Url = `${Url}?` + query;
    }
    if (urlObj?.accesstoken) {
      USER_TOKEN = userData?.auth_token || "";
    }
    try {
      console.log("data", data);
      const response = await axios.post(`${BASE_URL_UPDATED}${Url}`, data, {
        headers: {
          ...(headers ? { ...headers } : {}),
          ...(urlObj?.accesstoken
            ? { Authorization: `Bearer ${USER_TOKEN}` }
            : {}),
        },
      });
      console.log("response", response);
      resolve(response);
    } catch (e) {
      console.log("err", e);
      if (e?.response?.status === 401) {
      }
      reject(e);
    }
  });
export const patchCall = async (
  BASE_URL_UPDATED = BASE_URL,

  urlObj,
  data,
  params = "",
  query = "",
  headers
) =>
  new Promise(async (resolve, reject) => {
    let userData = GET_USER_DATA_WHITE_LIST();

    let Url = `${urlObj.url}`;
    if (params) {
      Url = `${Url}/` + params;
    }
    if (query) {
      Url = `${Url}?` + query;
    }
    if (urlObj?.accesstoken) {
      USER_TOKEN = userData?.auth_token || "";
    }
    try {
      const response = await axios.put(`${BASE_URL_UPDATED}${Url}`, data, {
        headers: {
          ...(headers ? { ...headers } : {}),
          ...(urlObj?.accesstoken
            ? { Authorization: `Bearer ${USER_TOKEN}` }
            : {}),
        },
      });

      resolve(response);
    } catch (e) {
      if (e?.response?.status === 401) {
      }
      reject(null);
    }
  });

export const manupulateResponse = (response) => {
  let sendresp = {
    status: false,
    message: "",
    data: null,
  };
  console.log({ response });
  // if (response.data?.status === ERROR_STATUS) {
  //   sendresp.success = false
  //   sendresp.data = response?.data
  //   sendresp.message = response?.data?.message || ''
  //   toastMessage(ERROR_MESSAGE_TYPE, response?.data?.message || '')
  //   return sendresp
  // } else if (response.data?.status !== SUCCESS_STATUS) {
  //   sendresp.success = false
  //   sendresp.data = response?.data
  //   sendresp.message = response?.data?.message || ''
  //   toastMessage(ERROR_MESSAGE_TYPE, response?.data?.message || '')
  //   return sendresp
  // } else

  if (response?.data?.status && response?.status === 200) {
    sendresp.status = response.data?.status;
    sendresp.data = response.data.data;
    sendresp.message = response.data.message || "";
    return sendresp;
  } else {
    sendresp.status = response.data?.status || false;
    sendresp.data = response?.data?.data || null;
    sendresp.message = response?.data?.message || "";
    return sendresp;
  }
};

export const request = async ({
  baseUrl = "",
  apiurl = {},
  data = {},
  params = "",
  query = "",
  header = {},
}) => {
  try {
    let res = null;
    if (apiurl.requestType === REQUEST_TYPE.get) {
      res = await getCall(baseUrl, apiurl, params, query, header);
    } else if (apiurl.requestType === REQUEST_TYPE.post) {
      res = await postCall(baseUrl, apiurl, data, params, query, header);
    } else if (apiurl.requestType === REQUEST_TYPE.patch) {
      res = await patchCall(baseUrl, apiurl, data, params, query, header);
    } else if (apiurl.requestType === REQUEST_TYPE.patch) {
      res = await deleteCall(baseUrl, apiurl, params, query, header);
    }
    return manupulateResponse(res);
  } catch (error) {
    return manupulateResponse(error);
  }
};
