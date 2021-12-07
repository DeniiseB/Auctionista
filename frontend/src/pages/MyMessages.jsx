import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  MainContainer,
  ChatContainer,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import { useMessage } from "../contexts/MessageContext";
import { UserContext } from "../contexts/UserContext";
import ChatBox from "../components/chat/ChatBox";
import ChatMessage from "../components/chat/ChatMessage";
import { useSocketContext } from "../contexts/SocketContext";

function MyMessages() {
  const history = useHistory();
  const { roomid } = useParams();
  const { chatRoom, messages, setMessages, getRoomById } = useMessage();
  const [msgToSend, setMsgToSend] = useState("");
  const { currentUser } = useContext(UserContext);
  const [otherUserName, setOtherUserName] = useState("");
  const { socket } = useSocketContext();
  const [newMessage, setNewMessage] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (roomid) {
      joinRoomFromParams(roomid);
      getMessages();
      return () => {
        socket.emit("leave", "" + roomid);
      };
    } else {
      console.log("No room id!");
    }
  }, [roomid, newMessage]);

  useEffect(() => {
    scrollToBottom();
    onChat();
    return () => {
      socket.off("chat");
    };
  }, [messages]);


    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

  const onChat = () => {
    socket.on("chat", function (data) {
      console.log("Received message", data.message);
      let tempObject = {
        userId: data.userId,
        message: data.message,
      };
      setMessages([...messages, tempObject]);
    });
  };

  const joinRoomFromParams = async (id) => {
    if (id) {
      await socket.emit("join", "" + id);
    } else {
      console.log("Room undefined");
    }
  };

  const getMessages = async () => {
    let room = await getRoomById(roomid);
    if (room && room.messages.length) {
      let tempArray = [];
      room.messages.map((msg) => tempArray.push(msg));
      setMessages(tempArray);
      setOtherUserName(getOtherUserName(room));
    } else {
      console.log("Something went wrong");
    }
  };

  const getOtherUserName = (room) => {
    if (currentUser && room && room.users) {
      for (let user of room.users) {
        if (user.id !== currentUser.id) {
          return user.username;
        }
      }
    } else {
      return null;
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    let data = {
      chatroom: chatRoom,
      userId: currentUser.id + "",
      message: msgToSend,
    };
    postMessage(data);
    setNewMessage(data);

    setMsgToSend("");
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

  function getInputValue(text) {
    setMsgToSend(text);
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

          <div style={cosStyles.messageBox}>
            <>
              <MainContainer>
                <ChatContainer>
                  <MessageList>
                    {roomid && messages && messages.length > 0 && (
                      <>
                        {messages.map((msg, i) => (
                          <>
                            <ChatMessage
                              key={i}
                              message={msg}
                              sendTo={chatRoom}
                              otherUser={otherUserName}
                            />
                          </>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                    {!roomid && (
                      <div
                        className="selectRoomContainer"
                        style={cosStyles.selectRoomContainer}
                      >
                        <h4>
                          <i class="bi bi-arrow-left-short"></i> Select chat
                          room{" "}
                        </h4>
                      </div>
                    )}
                  </MessageList>
                </ChatContainer>
              </MainContainer>

              {roomid && chatRoom && (
                <div style={cosStyles.inputWrapper}>
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
              {!chatRoom && roomid && (
                <div>
                  <p>Waiting to join chatroom (try page reload...)</p>
                </div>
              )}
            </>
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
    backgroundColor: "#2d2319",
  },
  messageBox: {
    position: "relative",
    height: "500px",
    backgroundColor: "#fffffff7",
    borderRadius: "10px",
  },
  people: {
    width: "100%",
    backgroundColor: "#fffffff7",
    borderRadius: "10px",
    height: "87%",
    padding: "2vw 2vw 2vw 2vw",
    overflowY: "scroll",
  },
  inputWrapper: {
    width: "100%",
    height: "10vh",
    borderRadius: "10px",
    border: "4px solid #2d2319",
    backgroundColor: "#fffffff7",
    display: "grid",
    gridTemplateColumns: "90% 10%",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    border: "none",
    backgroundColor: "#fffffff7",
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
    backgroundColor: "#f2d577",
    borderRadius: "10px",
    fontFamily: `"Trebuchet MS", Helvetica, sans-serif`,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "70% 30%",

    flexDirection: "row",
  },
  selectRoomContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginTop: "5rem",
  },
};
