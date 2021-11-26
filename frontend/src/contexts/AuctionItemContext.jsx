import React from "react";
import { createContext, useContext, useState, useEffect } from "react";


const AuctionItemContext = createContext();

export const useAuctionItem = () => {
  return useContext(AuctionItemContext);
};

const AuctionItemProvider = (props) => {
  const [auctionItems, setAuctionItems] = useState([]);
  const [imgPaths, setImgPaths] = useState([]);
  const [specificItem, setSpecificItem] = useState({})



  useEffect(() => {
    fetchItemsInBatch(0, 1);
  }, []);


  const fetchItemsInBatch = async (offsetValue, id) => {
    let response = await fetch(
      "/rest/auction-items/batch/" + offsetValue + "/" + id
    );
    let items = await response.json();
    console.log("items in batch are ", items);

    if (auctionItems.length === 0) {
      setAuctionItems(items);
    
    } else {
      console.log("fetching when not 0");
      setAuctionItems([...auctionItems, ...items]);
    }
  };

  const fetchAuctionItem = async (id) => {
    let res = await fetch("/rest/auction-items/" + id);
    try {
      let fetchedItem = await res.json();
      setSpecificItem(fetchedItem)
      return fetchedItem;
    } catch {
      console.log("No item found");
    }
  };

  const fetchAuctionItemByTitle = async (userInput) => {
    let res = await fetch("/api/auction-items/search?title=" + userInput);
    try {
      let fetchedItems = await res.json();
      setAuctionItems(fetchedItems);
      return fetchedItems;
    } catch {
      console.log(res.statusText);
    }
  };

  const postNewAuctionItem = async (itemToPost) => {
    let response = await fetch("/rest/auction-items", {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(itemToPost),
    });
    console.log(await response.json());
    return response;
  };

  const updateAuctionItem = async (id, values) => {
    let response = await fetch("/rest/auction-items/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    return response;
  };

  const fetchMyListings = async (userId, sold, expired) => {
    let response = await fetch(
      "/api/my-auction-items?userId=" +
        userId +
        "&sold=" +
        sold +
        "&expired=" +
        expired +
        "&orderBy=asc"
    );
    if (response.status == 200) {
      return await response.json();
    } else {
      return null;
    }
  };

  const relistItem = async (itemId) => {
    let response = await fetch("/api/relist/" + itemId);
    if (response.status == 200) {
      return await response.json();
    } else {
      return null;
    }
  };

  const values = {
    postNewAuctionItem,
    auctionItems,
    setImgPaths,
    fetchAuctionItem,
    fetchItemsInBatch,
    fetchAuctionItemByTitle,
    setAuctionItems,
    fetchMyListings,
    relistItem,
    updateAuctionItem,
    specificItem,
    setSpecificItem,
  };

  return (
    <AuctionItemContext.Provider value={values}>
      {props.children}
    </AuctionItemContext.Provider>
  );
};

export default AuctionItemProvider;
