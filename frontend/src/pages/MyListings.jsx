import React, { useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useEffect, useContext } from "react";
import AuctionItemCard from "../components/AuctionItemCard";
import { useAuctionItem } from "../contexts/AuctionItemContext";

function MyListings() {
  const { currentUser } = useContext(UserContext);
  const { fetchMyListings, relistItem } = useAuctionItem();
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    fetchAndSetListings();
  }, []);

  const fetchAndSetListings = async () => {
    let response = await fetchMyListings(currentUser.id, 2, 2);
    setMyListings(response);
    console.log(response);
  };

  async function relistAuction(e, itemId) {
    e.stopPropagation();
    await relistItem(itemId);
    let response = await fetchMyListings(currentUser.id, 2, 2);
    setMyListings(response);
  }
  return (
    <>
      <div className="pageWrapper" style={styles.pageWrapper}>
        <h4>My current listings</h4>
        <div className="itemsWrapper" style={styles.itemWrapper}>
          {currentUser && myListings && myListings.length > 0 ? (
            myListings.map((item) => (
              <div classname="listingItem">
                <AuctionItemCard props={item} />
                {item.expired ? (
                  <div className="relistWrapper" style={styles.relistWrapper}>
                    <p>This item has been expired</p>
                    <button
                      className="relistBtn"
                      style={styles.relistBtn}
                      onClick={(e) => relistAuction(e, item.id)}
                    >
                      Relist
                    </button>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <p>There are no auctions at this moment :,(</p>
          )}
        </div>
      </div>
    </>
  );
}

export default MyListings;

const styles = {
  itemWrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "5vw",
    padding: "5vh 2vw",
  },

  pageWrapper: {
    width: "100%",

    padding: "3vw",
    textAlign: "left",
    color: "rgb(226, 89, 55)",
  },
  relistWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: "2vw",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 4vh 2vh 4vh",
  },
  relistBtn: {
    border: "none",
    borderRadius: "5px",
    padding: "0.5vw",
    width: "8vw",
  },
};
