import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DateComponent from "./DateComponent";
import Counter from "./Counter";
import QuickBid from "./QuickBid";
import { useAuctionItem } from "../contexts/AuctionItemContext";


const AuctionItemCard = (props) => {

   const location = useLocation(); 
  const history = useHistory();
  const { fetchAuctionItem } = useAuctionItem()
  const [item, setItem]=useState({})
  
  useEffect( async () => {
    let auctionItem = await fetchAuctionItem(props.props.id)
    setItem(auctionItem);
  }, []);
  
  

   
  function redirect() {
    history.push("/details/" + props.props.id)
    window.scrollTo(0, 0);
  }

  return (
    <div className="itemWrapper" style={styles.itemWrapper}>
      <div className="mainInfo" style={styles.mainInfo}>
        <div>
          {props.props.bids.length > 0 ? (
            <p>
              Latest bid:{" "}
              {props.props.bids[props.props.bids.length - 1].amount} euro
            </p>
          ) : (
            <p>There are no bids on this item yet</p>
          )}
          <p>Minimum bid possible: {item.minimumBid} euro </p>
          <div >
              <Counter dateFrom={props.props.deadline}></Counter>
          </div>

          {location.pathname === "/" ? (
            <QuickBid props={props.props} />
          ) : (
            <>
              <p>Expiration date: </p>
                <div>
                
                <DateComponent props={new Date(props.props.deadline)} />
                </div>
            </>
          )}
        </div>
        <img
          style={styles.img}
          src={props.props.images.split(",")[props.props.primaryImgIndex]}
          alt=""
          onClick={redirect}
        />
      </div>
      <div className="title" style={styles.title}>
        <h5>{props.props.title}</h5>
      </div>
    </div>
  );

}


export default AuctionItemCard;

const styles = {
  itemWrapper: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "10vh",
    padding: "5vh",
    paddingBottom: "2vh",
    boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.54)",
    borderRadius: "20px",
    color: "black",
  },
  mainInfo: {
    display: "flex",
    flexDirection: "row",
    gap: "2vw",
  },
  img: {
    width: "50%",
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
    paddingTop: "3vh",
  },

  btn: {
    border: "none",
    borderRadius: "5px",
    padding: "0.5vw",
  },

  hover: {
    color: "white",
  },
};