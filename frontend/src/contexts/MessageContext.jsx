import React from "react";
import { createContext, useContext, useState } from "react";

const MessageContext = createContext();

export const useMessage = () => {
  return useContext(MessageContext);
};

const MessageProvider = (props) => {
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState("")
  const [userChatRooms, setUserChatRooms]=useState([])

  function updateMessages(newList) {
    setMessages(newList);
  }
  const values = {
    messages,
    setMessages,
    updateMessages,
    chatRoom,
    setChatRoom,
    userChatRooms,
    setUserChatRooms
  };

  return (
    <MessageContext.Provider value={values}>
      {props.children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;