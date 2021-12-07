import React, { useContext } from "react";
import { Message } from "@chatscope/chat-ui-kit-react";
import { UserContext } from "../../contexts/UserContext";

function ChatMessage(props) {
  const { currentUser } = useContext(UserContext);

  return (
    <>
      {currentUser && (
        <Message
          model={{
            message: props.message.message,
            direction:
              props.message.userId == currentUser.id ? "outgoing" : "incoming",
            position: "single",
          }}
          style={props.message.userId == currentUser.id ? styles.messageOutgoing : styles.messageIncoming}
        >
        </Message>
      )}
    </>
  );
}

export default ChatMessage;


const styles = {
  messageOutgoing: {
    margin: "1rem",
    padding: "1rem",
    width: "20rem",
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "#e0f379",
    borderRadius: "15px",
    marginLeft: "auto",
  },
  messageIncoming: {
    margin: "1rem",
    padding: "1rem",
    width: "20rem",
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "#f2d577",
    borderRadius: "15px",
  },
};