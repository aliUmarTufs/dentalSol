import { Server } from "socket.io";
import { BASE_URL } from "../../constants";
import { supabase } from "../../lib/supabaseClient";

export default function handler(req, res) {
  // console.log(res.socket.server.io);
  // if (res?.socket?.server?.io) {
  //   let socket = res?.socket?.server?.io;
  //   socket.on("joinRoom", async (data, callback) => {
  //     console.log({ data }, socket.id, "data");
  //     callback();
  //   });
  //   socket.on("send-message", async (data, callback) => {
  //     console.log({ data }, "data");
  //     socket.emit("receive-message", data);

  //     callback();
  //   });
  // } else {
  const io = new Server(res.socket.server, {
    path: "/api/socket",
    cors: {
      origin: BASE_URL,
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    // socket.emit("getMessage", { id: "emit message" });
    socket.on("joinRoom", async (data, callback) => {
      console.log({ data }, socket.id, "data");
      socket.join(data?.id);
      // socket.emit("receive-message", data);

      // callback();
    });

    socket.on("createRoom", async (data, callback) => {
      console.log({ data }, "data");
      if (data?.room_name) {
        let checkExistingRoom = await supabase
          .from("room")
          .select("*")
          .eq("room_name", data?.room_name);
        if (checkExistingRoom?.data && checkExistingRoom?.data?.length > 0) {
        } else {
          let createRoom = await supabase.from("room").insert({
            room_name: data?.room_name,
            room_owner: data?.room_owner,
            room_reciever: data?.room_reciever,
            item_id: data?.item_id,
          });
          if (createRoom?.data && createRoom?.data?.length > 0) {
            let createMessage = await supabase.from("message").insert({
              user_id: data?.room_owner,
              message: data?.message,
              room_id: createRoom?.data[0]?.id,
            });
            if (createMessage?.data && createMessage?.data?.length > 0) {
              console.log("MESSAGE CREATE");

              let automatedMessageGenerate = await supabase
                .from("message")
                .insert({
                  user_id: data?.room_reciever,
                  message: "Thanks for message. We'll back to you.",
                  room_id: createRoom?.data[0]?.id,
                });
              let getRoomList = await supabase
                .from("room")
                .select("* , room_owner(*) , room_reciever(*)")
                .or(
                  `room_owner.eq.${data?.room_reciever},room_reciever.eq.${data?.room_reciever}`
                );
              console.log(getRoomList?.data);
              // .eq("room_owner", data?.user_id);
              if (getRoomList?.data) {
                getRoomList?.data?.map((e) => {
                  if (e?.room_owner?.id == data?.room_reciever) {
                    e.opponent = e?.room_reciever;
                  }
                  if (e?.room_reciever?.id == data?.room_reciever) {
                    e.opponent = e?.room_owner;
                  }
                });
                console.log("CONDITION TRUE");
                io.to(data?.room_reciever).emit(
                  "RoomsListLoad",
                  getRoomList?.data
                );
                io.to(data?.room_owner).emit(
                  "RoomsListLoad",
                  getRoomList?.data
                );
              }
            }
          }
        }
      }
      // callback();
    });

    socket.on("getRoomChat", async (data, callback) => {
      if (data?.room_id) {
        let getChatOfUsers = await supabase
          .from("room")
          .select("*")
          .eq("id", data?.room_id);
        if (getChatOfUsers?.data && getChatOfUsers?.data?.length > 0) {
          let itemData = await supabase
            .from("products")
            .select("*")
            .eq("id", getChatOfUsers?.data[0]?.item_id);
          if (itemData?.data && itemData?.data?.length > 0) {
            socket.emit("productDetail", {
              itemDetail: itemData?.data,
              roomDetail: getChatOfUsers?.data,
            });
          }
        }
      }
    });

    socket.on("GetRoomList", async (data, callback) => {
      console.log("GetRoomList Socket Called");
      if (data?.user_id) {
        let getRoomList = await supabase
          .from("room")
          .select("* , room_owner(*) , room_reciever(*)")
          .or(
            `room_owner.eq.${data?.user_id},room_reciever.eq.${data?.user_id}`
          );
        // .eq("room_owner", data?.user_id);
        if (getRoomList?.data) {
          getRoomList?.data?.map((e) => {
            if (e?.room_owner?.id == data?.user_id) {
              e.opponent = e?.room_reciever;
            }
            if (e?.room_reciever?.id == data?.user_id) {
              e.opponent = e?.room_owner;
            }
          });
          socket.emit("RoomsListLoad", getRoomList?.data);
        }
      }
      // callback();
    });

    socket.on("userMessageLoadRequest", async (data, callback) => {
      console.log(data?.room_id, "message load");
      if (data?.room_id) {
        let userMessageLoad = await supabase
          .from("message")
          .select("*")
          .eq("room_id", data?.room_id);
        if (userMessageLoad?.data) {
          let itemData;
          let getRoomData = await supabase
            .from("room")
            .select("*")
            .eq("id", data?.room_id);
          if (getRoomData?.data && getRoomData?.data?.length > 0) {
            if (getRoomData?.data[0]?.item_id) {
              itemData = await supabase
                .from("products")
                .select("*")
                .eq("id", getRoomData?.data[0]?.item_id);
            }
          }
          // let obj = {
          //   message: userMessageLoad?.data,
          //   item: itemData?.data,
          // };

          socket.emit("userMessageLoad", userMessageLoad?.data);
        }
      }
    });

    socket.on("send-message", async (data, callback) => {
      console.log({ data }, "data");
      // socket.emit("receive-message", data);
      let saveChat = await supabase.from("message").insert({
        message: data?.message,
        user_id: data?.user_id,
        room_id: data?.room_id,
      });
      if (saveChat?.data) {
        let userMessageLoad = await supabase
          .from("message")
          .select("*")
          .eq("room_id", data?.room_id);
        if (userMessageLoad?.data) {
          console.log(socket?.rooms);
          let getUser = await supabase
            .from("room")
            .select("*")
            .eq("id", data?.room_id);
          if (getUser?.data && getUser?.data?.length > 0) {
            if (getUser?.data[0]?.room_owner == data?.user_id) {
              io.to(getUser?.data[0]?.room_reciever).emit(
                "userMessageLoad",
                userMessageLoad?.data
              );
            } else {
              io.to(getUser?.data[0]?.room_owner).emit(
                "userMessageLoad",
                userMessageLoad?.data
              );
            }
          }
          socket.emit("userMessageLoad", userMessageLoad?.data);
        }
      }

      console.log(saveChat?.status, saveChat?.statusText);
      // callback();
    });
    console.log("CONNECTED - RENEW", socket.id);
  });
  // }
  //   console.log("Setting up socket");
  //   // const io = new Server(res.socket.server.io, { path: "/api/socket" });

  //   // // listen for connection events
  //   // io.on("connection", (socket) => {
  //   //   console.log(`Client ${socket.id} connected`);

  //   //   // listen for messages from clients
  //   //   socket.on("message", (data) => {
  //   //     console.log(`Received message: ${data}`);

  //   //     // send the message to all clients except the sender
  //   //     socket.broadcast.emit("message", data);
  //   //   });

  //   //   // handle disconnections
  //   //   socket.on("disconnect", () => {
  //   //     console.log(`Client ${socket.id} disconnected`);
  //   //   });
  //   // });

  //   // start the server

  res.end();
}
