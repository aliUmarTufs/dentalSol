import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import { Navbar, HeadMeta } from "../components";
import Link from "next/link";
import { BeatLoader } from "react-spinners";
import {
  BASE_URL,
  INVALID_EMAIL,
  INVALID_PASSWORD,
  isLoggedInIndication,
  REQUIRED_EMAIL,
  REQUIRED_PASSWORD,
  ROUTES,
  Toast,
} from "../constants";
import _ from "lodash";
import Util from "../services/Util";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { useSockets } from "../context/socket.context";
import { SET_USER_DATA } from "../context-api/action-types";
import { MainContext } from "../context-api/MainContext";

export default function Login() {
  const router = useRouter();
  const { socket } = useSockets();
  const { MainState, dispatch } = useContext(MainContext);

  const [emailAdd, setEmailAdd] = useState("");
  const [pswd, setPswd] = useState("");
  const [showPswd, setShowPswd] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidEmailAdd, setIsValidEmailAdd] = useState(true);
  const [isValidPswd, setIsValidPswd] = useState(true);
  const [emailErrMsg, setEmailErrMsg] = useState("");
  const [pswdErrMsg, setPswdErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const pswdRef = useRef(null);

  const [isLoggedInUser, setIsLoggedInUser] = useState(null);
  useEffect(() => {
    if (isLoggedInIndication()) {
      router.push(ROUTES.DASHBOARD);
    } else {
      setIsLoggedInUser(true);
    }
  }, []);

  const validateForm = () => {
    let isValid = true;

    setIsValidEmailAdd(true);
    setIsValidPswd(true);

    // required check
    if (_.isEmpty(emailAdd)) {
      emailRef.current.focus();
      setIsValidEmailAdd(false);
      setEmailErrMsg(REQUIRED_EMAIL);
      isValid = false;
    } else if (!Util.isEmailValid(emailAdd)) {
      emailRef.current.focus();
      setIsValidEmailAdd(false);
      setEmailErrMsg(INVALID_EMAIL);
      isValid = false;
    }
    if (_.isEmpty(pswd)) {
      pswdRef.current.focus();
      setIsValidPswd(false);
      setPswdErrMsg(REQUIRED_PASSWORD);
      isValid = false;
    } else if (!Util.isValidPassword(pswd)) {
      pswdRef.current.focus();
      setIsValidPswd(false);
      setPswdErrMsg(INVALID_PASSWORD);
      isValid = false;
    }

    return isValid;
  };

  const login = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);
      const payload = {
        email: emailAdd,
        password: pswd,
      };

      fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === true) {
            setIsSuccess(true);
            let redirectRoute;
            socket.emit(
              "joinRoom",
              {
                id: data?.data?.loggedInUser?.id || "!23",
              },
              (error) => {
                if (error) {
                  console.log(
                    " Something went wrong please try again later. error"
                  );
                }
              }
            );
            // localStorage.setItem(
            //   "userData",
            //   JSON.stringify(data.data.loggedInUser)
            // );
            dispatch({ type: SET_USER_DATA, userData: data.data.loggedInUser });

            if (localStorage.getItem("set_route")) {
              redirectRoute = localStorage.getItem("set_route");
              localStorage.removeItem("set_route");
            } else {
              redirectRoute = ROUTES.DASHBOARD;
            }
            Toast.fire({
              icon: `${"success"}`,
              title: `${data.message}`,
            });
            setTimeout(() => {
              router.push(redirectRoute);
            }, 3000);
          } else {
            setIsSuccess(false);
            setLoading(false);
            Toast.fire({
              icon: `${"error"}`,
              title: `${data.message}`,
            });
          }
          //
        });
    }
  };

  return (
    <>
      <HeadMeta
        title={"Dent247 | Login"}
        description="description"
        content={"Dent247 | Login"}
      />
      <div>
        <Navbar />
        <div className="bg-light-blue h-screen">
          {_.isNull(isLoggedInUser) ? (
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
                <div className="p-4 md:p-8 rounded-3xl border border-solid border-gray-700">
                  <h1 className="text-xl tracking-tight font-extrabold text-gray-900 sm:text-2xl md:text-3xl">
                    <span className="block inline">Welcome</span>{" "}
                    <span className="block text-blue-600 inline">Back!</span>
                  </h1>
                  <h6 className="text-gray-900 text-md sm:text-lg md:text-xl mt-2">
                    Dont Have An Account?{" "}
                    <Link href={ROUTES.REGISTER}>
                      <span className="cursor-pointer block text-blue-600 inline opacity-80 font-bold hover:opacity-100">
                        Sign Up
                      </span>
                    </Link>
                  </h6>
                  <form onSubmit={login} className={"mt-8"}>
                    <div className="flex flex-col gap-2 my-4">
                      <label
                        for="email"
                        className="block text-sm font-normal text-gray-900 dark:text-gray-300"
                      >
                        Email
                      </label>

                      <input
                        id="email"
                        className="bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Type Here"
                        onChange={(e) =>
                          setEmailAdd(e.target.value, setIsValidEmailAdd(true))
                        }
                        value={emailAdd}
                        ref={emailRef}
                      />

                      {!isValidEmailAdd ? (
                        <span className={"text-sm text-red-500"}>
                          {emailErrMsg}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="flex flex-col gap-2 mt-10">
                      <label
                        for="password"
                        className="block text-sm font-normal text-gray-900 dark:text-gray-300"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={!showPswd ? "password" : "text"}
                          id="password"
                          className={
                            "bg-white h-12 border border-gray-400 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-16 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          }
                          placeholder="Type Here"
                          onChange={(e) =>
                            setPswd(e.target.value, setIsValidPswd(true))
                          }
                          value={pswd}
                          ref={pswdRef}
                          maxLength={20}
                        />
                        {showPswd ? (
                          <EyeOffIcon
                            className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                            onClick={() => setShowPswd(false)}
                          />
                        ) : (
                          <EyeIcon
                            className="absolute top-3 bottom-1 right-4 w-6 h-6 z-10 cursor-pointer text-gray-500"
                            onClick={() => setShowPswd(true)}
                          />
                        )}
                      </div>
                      {!isValidPswd ? (
                        <span className={"text-sm text-red-500"}>
                          {pswdErrMsg}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="flex items-end justify-end my-2">
                      <Link href={ROUTES.FORGOT_PASSWORD}>
                        <span className="font-normal font-inter text-blue-600 hover:underline text-sm capitalize cursor-pointer">
                          forgot password?
                        </span>
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading ? true : false}
                      className={`${
                        loading ? "cursor-not-allowed" : "cursor-pointer"
                      } w-full h-14 mt-8 md:mt-12 bg-blue-600 flex items-center justify-center text-white rounded-md text-sm capitalize hover:bg-blue-700 border-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    >
                      {loading ? (
                        <BeatLoader color="#fff" sizeunit={"px"} size={8} />
                      ) : (
                        ""
                      )}
                      {loading ? "" : "Login"}
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
