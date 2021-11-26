import React, {useState, useEffect} from 'react'
import { useSocketContext } from "../contexts/SocketContext";
import { Link } from "react-router-dom";

function OutbiddenNotif() {
  const { socket } = useSocketContext();
  const [notif, setNotif] = useState({})
  const [renderPopup, setRenderPopup] = useState(false)

 

  useEffect(() => {
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