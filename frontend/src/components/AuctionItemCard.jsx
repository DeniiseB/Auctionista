import { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Counter from "./Counter";
import { useAuctionItem } from "../contexts/AuctionItemContext";
import { UserContext } from "../contexts/UserContext";
import { useBidContext } from "../contexts/BidContext";
import BootstrapModal from "./BootstrapModal";
import { useSocketContext } from "../contexts/SocketContext";

const AuctionItemCard = (props) => {
  const location = useLocation();
  const history = useHistory();
  const { fetchAuctionItem } = useAuctionItem();
  const [item, setItem] = useState({});
  const { currentUser } = useContext(UserContext);
  const { postNewBid } = useBidContext();
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState("");
  const { socket } = useSocketContext();

  useEffect(() => {
    fetchAndSetAuctionItem();
  }, []);

  const fetchAndSetAuctionItem = async () => {
    let auctionItem = await fetchAuctionItem(props.props.id);
    setItem(auctionItem);
    onNotif();
  };

  async function sendNotif() {
    console.log("sending id " + item.id);
    let toSend = {
      updateItemId: item.id,
    };
    await fetch("/api/bid-notifs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toSend),
    });
  }

  async function sendOutbiddenNotif(newBid) {
    if (
      item.bids.length > 0 &&
      item.bids[item.bids.length - 1].user_id !== currentUser.id.toString()
    ) {
      let outbiddenNotif = {
        fromLogin: currentUser.username,
        toWho: item.bids[item.bids.length - 1].user_id,
        auctionItemid: props.props.id,
        auctionItemTitle: props.props.title,
        lastBidAmount: newBid,
      };

      await fetch("/api/outbidden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(outbiddenNotif),
      });
    } else {
      console.log("Last bid was your own bid or you are the first bidder");
    }
  }

  const onNotif = () => {
    socket.on("notifications", function (data) {
      console.log("new notification about updating item received");
      if (window.location.pathname === "/") {
        if (props.props.id == data.updateItemId) {
          updateItem(data.updateItemId);
        }
      }
    });
  };

  async function updateItem(itemId) {
    let auctionItem = await fetchAuctionItem(itemId);
    setItem(auctionItem);
  }

  const toggleModal = () => {
    setShow(!show);
  };

  async function quickBid() {
    if (!currentUser) {
      setModalText("Please log in");
      toggleModal();
    } else {
      const bidToPost = {
        amount: item.minimumBid,
        time: new Date(),
        user_id: currentUser.id,
        auctionItem: item,
      };

      let res = await postNewBid(bidToPost);

      if (!res.error) {
        setModalText("You placed bid worth of " + bidToPost.amount + " ₿");
        updateItem(item.id);
        toggleModal();
        sendNotif();
        sendOutbiddenNotif(item.minimumBid);
      }
    }
  }

  function redirect() {
    history.push("/details/" + props.props.id);
    window.scrollTo(0, 0);
  }

  return (
    <div
      className="itemWrapper"
      style={
        window.location.pathname === "/my-listings"
          ? styles.myListings
          : styles.itemWrapper
      }
    >
      <div className="mainInfo" style={styles.mainInfo}>
        <div>
          {item.bids && item.bids.length > 0 ? (
            <p>
              Current price:{" "}
              <strong>{item.bids[item.bids.length - 1].amount}</strong>{" "}
              <i className="bi bi-currency-bitcoin"></i>
            </p>
          ) : (
            <p>
              Current price: <strong>{item.startPrice}</strong>{" "}
              <i className="bi bi-currency-bitcoin"></i>
            </p>
          )}
          <p>
            Minimum bid:{" "}
            <strong>
              {item.minimumBid}
              <i className="bi bi-currency-bitcoin"></i>{" "}
            </strong>
          </p>
          {location.pathname === "/" && currentUser && item.owner ? (
            <div>
              <button
                className="quickBid"
                style={styles.btn}
                onClick={quickBid}
                disabled={currentUser.id === item.owner.id ? "disabled" : ""}
              >
                Place quick bid
              </button>
              <BootstrapModal
                toggle={toggleModal}
                modal={show}
                text={modalText}
              />
            </div>
          ) : null}
          <div style={styles.counter}>
            {props.props.expired || props.props.sold ? null : (
              <Counter dateFrom={props.props.deadline}></Counter>
            )}
          </div>
        </div>
        <div style={styles.imageContainer}>
          <img
            style={styles.img}
            src={props.props.images.split(",")[props.props.primaryImgIndex]}
            alt=""
            onClick={redirect}
          />
        </div>
      </div>
      <div className="title" style={styles.title}>
        <h5 style={{ marginBottom: "0" }}>{props.props.title}</h5>
      </div>
    </div>
  );
};

export default AuctionItemCard;

const styles = {
  itemWrapper: {
    width: "45%",
    display: "flex",
    flexDirection: "column",
    marginBottom: "3vh",
    padding: "2rem",
    boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.54)",
    borderRadius: "20px",
    border: "solid 1px black",
    color: "black",
    backgroundColor: "white",
  },
  myListings: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginBottom: "3vh",
    padding: "2rem",
    boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.54)",
    borderRadius: "20px",
    border: "solid 1px black",
    color: "black",
    backgroundColor: "white",
  },
  mainInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "left",
  },
  imageContainer: {
    height: "12rem",
    width: "60%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
    paddingTop: "3vh",
    fontFamily: "Montserrat, sans-serif",
  },
  btn: {
    border: "none",
    borderRadius: "5px",
    padding: "0.5vw",
  },
  hover: {
    color: "white",
  },
  counter: {
    marginTop: "15px",
  },
  textContainer: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Montserrat, sans-serif",
    fontSize: "14px",
  },
};
