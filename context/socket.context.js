import { createContext, useContext, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { BASE_URL, CHAT_BASE_URL } from "../constants";
// import { SOCKET_URL } from "config";

const socket = io(CHAT_BASE_URL, {
  reconnection: false,
});

const SocketContext = createContext({
  socket,
});

function SocketsProvider(props) {
  useEffect(() => {
    window.onfocus = function () {
      // document.title = "Chat app";
      socket.onAny((event, ...args) => {});
    };
  }, []);

  //   useEffect(() => {
  //     socket.auth = { id: me?.id, sessionID: me?.username };
  //     socket.id = me?.id as string;
  //   }, [me]);
  useEffect(() => {
    socket.id = 123456789;
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
      {...props}
    />
  );
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
