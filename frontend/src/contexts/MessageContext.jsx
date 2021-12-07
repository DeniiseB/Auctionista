import React from "react";
import { createContext, useContext, useState } from "react";

const MessageContext = createContext();

export const useMessage = () => {
  return useContext(MessageContext);
};

const MessageProvider = (props) => {
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState("");

  const createNewRoom = async (roomInfo) => {
    try {
      let response = await fetch("/rest/chatroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomInfo),
      });
      return response.json();
    } catch {
      console.log("Creating new room failed");
      return null;
    }
  };

  const getRoomById = async (id) => {
    try {
      let res = await fetch("/rest/chatroom/" + id);
      if (res.status == 200) {
        let fetchedItem = await res.json();
        return fetchedItem;
      }
      else {
        return null
      }

    } catch {
      console.log("No item found");
      return null
    }
  };

  const values = {
    messages,
    setMessages,
    chatRoom,
    setChatRoom,
    getRoomById,
    createNewRoom
  };

  return (
    <MessageContext.Provider value={values}>
      {props.children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
