import { useRouter } from "next/router";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { Navbar, HeadMeta } from "../../../components";
import {
  BASE_URL,
  DATE_FORMAT_FOUR,
  DATE_FORMAT_THREE,
  getLoggedInUser,
  isLoggedInIndication,
  ROUTES,
  TIME_FORMAT4,
} from "../../../constants";
import { io } from "socket.io-client";
import { useSockets } from "../../../context/socket.context";
import {
  UserCircleIcon,
  ArrowRightIcon,
  UserIcon,
} from "@heroicons/react/solid";
import Link from "next/link";

import moment from "moment";

export default function Chat({ props }) {
  const router = useRouter();
  const { socket } = useSockets();
  const [message, setMessage] = useState("");
  const [msgTime, setMsgTime] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(null);
  const [itemData, setItemData] = useState(null);

  const [roomMessageLoad, setRoomMessageLoad] = useState(null);

  const [roomMessageData, setRoomMessageData] = useState([]);
  const [roomList, setRoomList] = useState(null);

  const [roomID, setRoomID] = useState(null);

  const messageEl = useRef(null);

  useEffect(() => {
    if (isLoggedInIndication()) {
      let LoggedInUserData = async () => {
        let getuser = await getLoggedInUser();
        if (!_.isNull(getuser)) {
          let parseData = JSON.parse(getuser);
          setLoggedInUser(parseData);
          setIsLoggedInUser(true);
          socket.emit(
            "joinRoom",
            {
              id: parseData?.id || "!23",
            },
            (error) => {
              if (error) {
                console.log(
                  " Something went wrong please try again later. error"
                );
              }
            }
          );
        }
      };

      LoggedInUserData();
    } else {
      setIsLoggedInUser(false);
      router.push(ROUTES.LOGIN);
    }
  }, []);

  useEffect(() => {
    if (messageEl?.current) {
      messageEl.current.scrollTop = messageEl?.current?.scrollHeight;
    }
  }, [allMessages]);

  useEffect(() => {
    socket.on("RoomsListLoad", (data) => {
      setRoomList(true);
      setRoomMessageData(data);
      if (data?.length > 0) {
        setRoomID(data[0]);
        socket.emit("getRoomChat", {
          room_id: data[0]?.id,
        });
      }
      // setAllMessages((pre) => [...pre, data]);
    });

    socket.on("productDetail", (data) => {
      if (data?.itemDetail?.length > 0) {
        setItemData(data?.itemDetail[0]);
      }
      // setAllMessages((pre) => [...pre, data]);
    });

    // socket.on("receive-message", (data) => {
    //   setAllMessages((pre) => [...pre, data]);
    // });

    socket.on("userMessageLoad", (data) => {
      if (data) {
        setAllMessages(data);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("userMessageLoadRequest", {
      room_id: roomID?.id,
    });
  }, [roomID]);

  useEffect(() => {
    if (loggedInUser?.id) {
      socket.emit("GetRoomList", {
        user_id: loggedInUser?.id,
      });
    }
  }, [socket, loggedInUser]);

  function getRoomChat(roomData) {
    setRoomID(roomData);
    socket.emit("getRoomChat", {
      room_id: roomData?.id,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    socket.emit(
      "send-message",
      {
        message,
        user_id: loggedInUser?.id,
        room_id: roomID?.id,
      },
      (error) => {
        if (error) {
          console.log(" Something went wrong please try again later. error");
        }
      }
    );

    setMessage("");
  }

  // console.log({ allMessages });

  const pickChatDate = (item) =>
    moment(item.created_at).format(DATE_FORMAT_FOUR);
  const _allMessages = _.groupBy(allMessages, pickChatDate);
  const _allMsgsArr = Object.entries(_allMessages);
  return (
    <>
      <HeadMeta
        title="Dent247 | Dashboard | Chat"
        description="description"
        content="Dent247 | Dashboard | Chat"
      />
      {_.isNull(isLoggedInUser) || !isLoggedInUser ? (
        <div className="my-2 flex justify-center w-full h-screen items-center">
          <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
        </div>
      ) : (
        <div>
          <Navbar isDashboard={true} />
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 lg:px-2 pb-8 md:pb-6 lg:pb-10 mt-44">
              <div className="flex border border-gray-200 rounded-md p-6 mb-8">
                <h1 className="text-2xl font-semibold font-inter bluish-600">
                  Chat
                </h1>
              </div>
              <div className="min-w-full flex flex-col lg:flex-row gap-10 lg:gap-4">
                <div className="border overflow-y-auto overflow-x-hidden border-gray-200 rounded-2xl flex-1">
                  {!_.isNull(roomList) ? (
                    <ul className="h-60 md:h-96">
                      <li>
                        {_.size(roomMessageData) > 0 ? (
                          roomMessageData.map((item) => {
                            return (
                              <a
                                key={item.id}
                                className={`flex ${
                                  item?.id == roomID?.id ? "bg-gray-100" : ""
                                } items-center gap-6 p-5 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none`}
                                // href={`/dashboard/chat?room=${item?.id}`}
                                onClick={() => getRoomChat(item)}
                              >
                                {item?.opponent?.image ? (
                                  <img
                                    className="object-cover w-12 h-12 rounded-full"
                                    src={item?.opponent?.image}
                                    alt="username"
                                  />
                                ) : (
                                  <UserCircleIcon className="text-black text-sm w-auto h-16" />
                                )}
                                <div className="w-full">
                                  <div className="flex justify-between">
                                    <span className="block font-normal font-inter text-base text-bluish-600 capitalize">
                                      {item?.opponent?.user_name}
                                    </span>
                                    <span className="block text-sm font-normal font-inter text-greyish-300">
                                      {item?.time}
                                    </span>
                                  </div>
                                  <span className="block text-sm font-normal font-inter text-greyish-300 textTruncateOne w-52">
                                    {item?.message}
                                  </span>
                                </div>
                              </a>
                            );
                          })
                        ) : (
                          <div className="my-2 flex justify-center w-full h-screen items-center">
                            <p>No Chat Found</p>
                          </div>
                        )}
                      </li>
                    </ul>
                  ) : (
                    <div className="my-2 flex justify-center w-full h-screen items-center">
                      <BeatLoader color="#2563eb" sizeunit={"px"} size={14} />
                    </div>
                  )}
                </div>
                <div className="border border-gray-200 p-5 rounded-2xl flex-2">
                  {roomID ? (
                    <div className="w-full">
                      {/* Product Detail*/}

                      {!_.isNull(itemData) ? (
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                          <div className="w-full flex flex-1 items-center py-3 gap-4 text-sm transition duration-150 ease-in-out">
                            {itemData?.thumbnail ? (
                              <img
                                className="object-cover w-24 h-20 rounded-2xl border border-black border-opacity-20"
                                src={itemData?.thumbnail}
                                alt="item"
                              />
                            ) : (
                              <img
                                className="object-cover w-24 h-20 rounded-2xl border border-black border-opacity-20"
                                src={`/productFallBackImg.png`}
                                alt="item"
                              />
                            )}
                            <div className="w-full pb-2">
                              <div className="flex flex-col gap-2">
                                <span className="block font-normal font-inter text-base text-blackish-600 capitalize">
                                  {itemData?.name}
                                </span>
                                <span className="block text-base font-semibold font-poppins text-bluish-700">
                                  ${itemData?.price}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <Link href={`${ROUTES.PRODUCTS}/${itemData?.id}`}>
                              <span className="flex items-center gap-3 font-semibold font-inter text-base text-blackish-600 capitalize cursor-pointer">
                                {" "}
                                View Product{" "}
                                <ArrowRightIcon className="w-4 h-4" />
                              </span>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      {/* User Name */}
                      <div className="w-full flex items-center py-3 gap-4 text-sm transition duration-150 ease-in-out border-t border-b border-opacity-20 border-blackish-600">
                        {roomID?.opponent?.image ? (
                          <img
                            className="object-cover w-12 h-12 rounded-full"
                            src={roomID?.opponent?.image}
                            alt="username"
                          />
                        ) : (
                          <UserCircleIcon className="text-black text-sm w-auto h-16" />
                        )}
                        <div className="w-full pb-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="block font-semibold font-inter text-base text-blackish-600 capitalize">
                              {roomID?.opponent?.user_name}
                            </span>
                            <span className="block text-sm font-normal font-inter text-greyish-300">
                              User
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Message List */}
                      <div
                        className="relative w-full pr-4 my-4 overflow-y-auto h-full md md:h-96"
                        ref={messageEl}
                      >
                        {!_.isEmpty(_allMsgsArr) ? (
                          <>
                            {_allMsgsArr.map((element, index) => {
                              return (
                                <div key={index}>
                                  <div className="w-full my-4 flex items-center justify-center">
                                    <h6 className="text-blackish-600 text-sm font-normal font-poppins">
                                      {element[0]}
                                    </h6>
                                  </div>
                                  {element[1].map((item, index) => {
                                    return (
                                      <div key={index}>
                                        {loggedInUser?.id == item?.user_id ? (
                                          <div className="flex justify-end">
                                            <div className="my-4 flex justify-between items-end p-5 bg-blackish-600 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl w-96">
                                              <span className="block font-normal font-poppins text-sm w-4/6 text-white">
                                                {item?.message}
                                              </span>
                                              <span className="block text-xs font-normal font-inter text-white">
                                                {moment(
                                                  item?.created_at
                                                ).format(TIME_FORMAT4) ??
                                                  "00:00 PM"}
                                              </span>
                                            </div>
                                          </div>
                                        ) : (
                                          <div
                                            key={index}
                                            className="flex justify-start"
                                          >
                                            <div className="my-4 flex justify-between items-end p-5 bg-blue-600 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl w-96">
                                              <span className="block font-normal font-poppins text-sm w-4/6 text-white">
                                                {item?.message}
                                              </span>
                                              <span className="block text-xs font-normal font-inter text-white">
                                                {moment(
                                                  item?.created_at
                                                ).format(TIME_FORMAT4) ??
                                                  "00:00 PM"}
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <div className="my-2 flex justify-center w-full h-screen items-center">
                            <BeatLoader
                              color="#2563eb"
                              sizeunit={"px"}
                              size={14}
                            />
                          </div>
                        )}
                        {/* {!_.isNull(allMessages) ? (
													<>
														{allMessages.map((e, index) => {
															return (
																<div key={index}>
																	<div className="w-full my-4 flex items-center justify-center">
																		<h6 className="text-blackish-600 text-sm font-normal font-poppins">
																			Today 22 Jan, 2023 -{" "}
																			{moment(e.created_at).format(
																				DATE_FORMAT_THREE
																			)}
																		</h6>
																	</div>

																	{loggedInUser?.id == e?.user_id ? (
																		<div className="flex justify-end">
																			<div className="my-4 flex justify-between items-end p-5 bg-blackish-600 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl w-96">
																				<span className="block font-normal font-poppins text-sm w-4/6 text-white">
																					{e?.message}
																				</span>
																				<span className="block text-xs font-normal font-inter text-white">
																					{moment(e?.created_at).format(
																						TIME_FORMAT4
																					) ?? "00:00 PM"}
																				</span>
																			</div>
																		</div>
																	) : (
																		<div
																			key={index}
																			className="flex justify-start">
																			<div className="my-4 flex justify-between items-end p-5 bg-blue-600 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl w-96">
																				<span className="block font-normal font-poppins text-sm w-4/6 text-white">
																					{e?.message}
																				</span>
																				<span className="block text-xs font-normal font-inter text-white">
																					{moment(e?.created_at).format(
																						TIME_FORMAT4
																					) ?? "00:00 PM"}
																				</span>
																			</div>
																		</div>
																	)}
																</div>
															);
														})}
													</>
												) : (
													<div className="my-2 flex justify-center w-full h-screen items-center">
														<BeatLoader
															color="#2563eb"
															sizeunit={"px"}
															size={14}
														/>

														{/* <p>No Messages</p> */}
                        {/* </div> */}
                        {/* )} */}
                      </div>

                      {/* Input for message sending */}
                      <div className="relative w-full">
                        <form onSubmit={handleSubmit}>
                          <input
                            type="text"
                            placeholder="Type here..."
                            className={
                              "bg-white border-0 border-b border-blackish-600 border-opacity-50 text-gray-900 text-sm focus:ring-transparent focus:border-0 focus:border-b focus:border-blue-500 block w-full p-2.5 pb-4 pr-16 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            }
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            autoComplete={"off"}
                          />
                          <button
                            className="absolute top-auto bottom-4 right-0"
                            type="submit"
                          >
                            <img
                              className="w-5 h-5 object-contain"
                              src="/send.png"
                            />
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="my-2 flex justify-center w-full h-screen items-center">
                      {/* <BeatLoader color="#2563eb" sizeunit={"px"} size={14} /> */}
                      <p>No Messages</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      isProtected: true,
    },
  };
}
