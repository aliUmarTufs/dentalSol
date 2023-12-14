import "tailwindcss/tailwind.css";
import "../style/index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-phone-input-2/lib/style.css";
import CookieConsent, {
  Cookies,
  getCookieConsentValue,
} from "react-cookie-consent";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BeatLoader } from "react-spinners";
import SocketsProvider from "../context/socket.context";
import { BASE_URL, ROUTES, getLoggedInUser } from "../constants";
import MainProvider from "../context-api/MainContext";
import PrivateLayout from "../sharedLayouts/PrivateLayout";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const verifyUser = async () => {
      if (pageProps?.isProtected && pageProps?.isProtected === true) {
        const getUser = await getLoggedInUser();
        if (!_.isNull(getUser)) {
          let parsedUser = JSON.parse(getUser);

          fetch(`${BASE_URL}/api/auth/verify_user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: parsedUser?.user_email }),
          })
            .then((res) => res.json())
            .then((response) => {
              if (response?.status === true) {
                if (
                  response?.data?.is_blocked == 1 ||
                  response?.data?.is_deleted == 1
                ) {
                  localStorage.removeItem("userData");

                  setIsLoading(false);
                  router.push(ROUTES.LOGIN);
                } else {
                  setIsLoading(false);
                }
              }
            });
        }
      } else {
        setIsLoading(false);
      }
    };
    verifyUser();
  }, [router]);

  useEffect(() => {
    const startHandler = async () => {
      setIsLoading(true);
    };

    const stopHandler = async () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", startHandler);
    router.events.on("routeChangeComplete", stopHandler);
    router.events.on("routeChangeError", stopHandler);

    return () => {
      router.events.off("routeChangeStart", startHandler);
      router.events.off("routeChangeComplete", stopHandler);
      router.events.off("routeChangeError", stopHandler);
    };
  }, [router]);

  return (
    <>
      {isLoading === true ? (
        <div className="my-2 flex justify-center w-full h-screen items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <>
          <SocketsProvider>
            <MainProvider>
              <PrivateLayout pageProps={pageProps}>
                <Component {...pageProps} />
                <CookieConsent
                  hideOnAccept={true}
                  cookieSecurity={true}
                  location="bottom"
                  cookieValue={"sample"}
                  buttonText="Accept"
                  cookieName="Dent247Cookie"
                  enableDeclineButton
                  flipButtons
                  style={{ background: "#2B373B" }}
                  buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
                  expires={365}
                  visible={"byCookieValue"}
                >
                  This website uses cookies to enhance the user experience.{" "}
                </CookieConsent>
              </PrivateLayout>
            </MainProvider>
          </SocketsProvider>
        </>
      )}
    </>
  );
}

export default MyApp;
