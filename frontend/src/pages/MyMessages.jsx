import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useMessage } from "../contexts/MessageContext";
import { UserContext } from "../contexts/UserContext";
import ChatBox from "../components/chat/ChatBox";
import ChatMessage from "../components/chat/ChatMessage";
import { useSocketContext } from "../contexts/SocketContext";

function MyMessages() {
  const history = useHistory();
  const { roomid } = useParams();
  const {
    chatRoom,
    messages,
    setMessages,
    getRoomById,
    chatRooms,
    setChatRooms,
  } = useMessage();
  const [msgToSend, setMsgToSend] = useState("");
  const { currentUser, whoAmI } = useContext(UserContext);
  const [typing, setTyping] = useState(false);
  const [otherUserName, setOtherUserName] = useState("");
  const { socket, isConnected } = useSocketContext();

  // If chatRoom isnt defined after clicking box, it's because it's not joining in backend
  // Try adding leave room

  useEffect(() => {
    getUserChatRooms();
  }, []);

  useEffect(() => {
    if (roomid) {
      console.log("Using roomid from params");
      joinRoomFromParams(roomid);
      getMessages();
    }
  }, [roomid]);

  // useEffect(() => {
  //   if (roomid) {
  //     console.log("useEffect getMessages");
  //     getMessages();
  //   }
  // }, [chatRoom, roomid]);
  // messages

  const getUserChatRooms = async () => {
    let user = await whoAmI();
    if (user && user.chatrooms.length) {
      setChatRooms(user.chatrooms);
    }
  };

  const joinRoomFromParams = async (id) => {
    // let room = await getRoomById(id);
    console.log("Room: ", id);
    joinRoom(id);
    // change so no fetch needed here?
    // setOtherUserName(getOtherUserName(room));
  };

  const getMessages = async () => {
    let room = await getRoomById(roomid);
    console.log("getMessages");
    if (room.messages.length) {
      let tempArray = [];
      room.messages.map((msg) => tempArray.push(msg));
      setMessages(tempArray);
    }
  };

  async function joinRoom(id) {
    if (id) {
      socket.emit("join", "" + id);
    } else {
      console.log("Room undefined");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    let data = {
      chatroom: chatRoom,
      userId: currentUser.id + "",
      message: msgToSend,
    };
    postMessage(data);

    setMsgToSend("");
    setTyping(false);
  }

  async function postMessage(data) {
    await fetch("/api/message/" + chatRoom.id, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  const pullChildData = (room) => {
    history.push("/my-messages/" + room.id);
  };

  // function getOtherUserName(room) {
  //   let tempArray = [];
  //   for (let user of room.users) {
  //     // currentUser undefined
  //     if (user.id !== currentUser.id) {
  //       tempArray.push(user);
  //     }
  //   }
  //   return tempArray[0].username;
  // }

  function getInputValue(text) {
    setMsgToSend(text);
    setTyping(true);
  }

  return (
    <div className="chatWrapper" style={cosStyles.chatWrapper}>
      {currentUser && currentUser.chatrooms.length > 0 && (
        <>
          <div className="people" style={cosStyles.people}>
            <ChatBox
              emitFromChatBox={pullChildData}
              sendTo={chatRoom !== undefined ? chatRoom : null}
            />
          </div>

          <div style={{ position: "relative", height: "500px" }}>
            <>
              <MainContainer>
                <ChatContainer>
                  <MessageList>
                    {messages &&
                      messages.length > 0 &&
                      messages.map((msg, i) => (
                        <>
                          <ChatMessage
                            key={i}
                            message={msg}
                            sendTo={chatRoom}
                            otherUser={otherUserName}
                          />
                        </>
                      ))}
                    {/* {typing && (
                        <TypingIndicator
                          content={currentUser.username + " is typing"}
                        />
                      )} */}
                  </MessageList>
                </ChatContainer>
              </MainContainer>

              {chatRoom && (
                <div style={cosStyles.inputWrapper} className="chatWrapper">
                  <form
                    action=""
                    onSubmit={handleSubmit}
                    style={cosStyles.form}
                  >
                    <input
                      type="text"
                      style={cosStyles.input}
                      onChange={(e) => getInputValue(e.target.value)}
                      value={msgToSend}
                    />

                    <button type="submit" style={cosStyles.sendBtn}>
                      Send
                    </button>
                  </form>
                </div>
              )}
            </>
            {/* {!isConnected && (
              <div>
                <h3>Connecting...</h3>
              </div>
            )} */}
          </div>
        </>
      )}
      {currentUser && !currentUser.chatrooms.length && (
        <div>
          <h3>You have no chat messages</h3>
        </div>
      )}
    </div>
  );
}

export default MyMessages;

const cosStyles = {
  chatWrapper: {
    display: "grid",
    gridTemplateColumns: "30% 70%",
    padding: "5vh 3vw 5vh 1vw",
    gap: "1vw",
    height: "100vh",
  },
  people: {
    width: "100%",
    backgroundColor: "#c6e3fa",
    borderRadius: "10px",
    height: "87%",
    padding: "2vw 2vw 2vw 2vw",
    overflowY: "scroll",
  },
  inputWrapper: {
    width: "100%",
    height: "10vh",
    borderRadius: "10px",
    border: "1px solid lightGrey",
    marginTop: "3vh",
    display: "grid",
    gridTemplateColumns: "90% 10%",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    backgroundColor: "#c6e3fa",
    border: "none",
    borderRadius: "5px",
    height: "100%",
    width: "100%",
    marginLeft: "5vw",
  },

  sendBtn: {
    width: "50%",
    marginLeft: "13vh",
    border: "none",
    color: "black",
    backgroundColor: "#c6e3fa",
    borderRadius: "10px",
    fontFamily: `"Trebuchet MS", Helvetica, sans-serif`,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "70% 30%",

    flexDirection: "row",
  },
};
