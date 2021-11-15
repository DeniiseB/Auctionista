import { render } from '@testing-library/react';
import React, {useState, useEffect, useContext} from 'react'
import { useSocketContext } from "../contexts/SocketContext";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

function OutbiddenNotif() {
  const { socket } = useSocketContext();
  const [myNotif, setMyNotif] = useState(false)
  const { whoAmI, getCurrentUser, currentUserId } = useContext(UserContext);
  const [notif, setNotif] = useState({})
  const [renderPopup, setRenderPopup] = useState(false)

 

  useEffect(async () => {
  
    onOutbidden()
     
    
  }, [])
  
    const onOutbidden = () => {
      socket.on("outbidden", async function (data) {
        let res = await fetch("/api/user/me", {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json",
          }),
        });
        res = await res.json();
        let newData=JSON.stringify(data)
        if (res.id == data.toWho) {
          console.log("this is your notification!")
          await setNotif(data)
          setRenderPopup(true)
          console.log(notif)
        }

       setTimeout(function () {
          setRenderPopup(false)
        }, 8000); 
        
      });
  };
  



  return (
    <>
      {renderPopup ? (
        <div className="notificationWrapper" style={styles.notificationWrapper}>
          <p>
            You have been outbidden on{" "}
            {notif.auctionItemTitle}
          </p>
          <p>Latest bid: {notif.lastBidAmount}₿</p>
          <p>
            Click <Link to={`/details/${notif.auctionItemid}`}>here</Link> to
            see the item
          </p>
        </div>
      ) : null}
    </>
  );
}

export default OutbiddenNotif

const styles = {
  notificationWrapper: {
    width: "20vw",
    
    position: "absolute",
    top: "15vh",
    right: "2vw",
    backgroundColor: "white",
    borderRadius: "10px",
    opacity: "0.7",
    textAlign: "left",
    padding:"1vh"
    
    
  }
}