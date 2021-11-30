import React, { useState, useEffect, useContext } from "react";
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
  const { chatRoom, messages, setMessages, getRoomById, setChatRooms } =
    useMessage();
  const [msgToSend, setMsgToSend] = useState("");
  const { currentUser, whoAmI } = useContext(UserContext);
  const [otherUserName, setOtherUserName] = useState("");
  const { socket } = useSocketContext();
  const [newMessage, setNewMessage] = useState({});

  useEffect(() => {
    getUserChatRooms();
  }, []);

  useEffect(() => {
    if (roomid) {
      joinRoomFromParams(roomid);
      getMessages();
      return () => {
        socket.emit("leave", "" + roomid);
      };
    }
  }, [roomid, newMessage]);

  useEffect(() => {
    onChat();
    return () => {
      socket.off("chat");
    };
  }, [messages]);

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
  const getUserChatRooms = async () => {
    let user = await whoAmI();
    if (user && user.chatrooms.length) {
      setChatRooms(user.chatrooms);
    }
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
              {!chatRoom && roomid && <div>
                <p>Waiting to join chatroom (try page reload...)</p>
              </div> }
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
  selectRoomContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
};
