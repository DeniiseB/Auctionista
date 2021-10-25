import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const AuctionItemContext = createContext();

export const useAuctionItem = () => {
  return useContext(AuctionItemContext);
};

const AuctionItemProvider = (props) => {

  const [auctionItems, setAuctionItems] =useState([])

    useEffect(() => {
      fetchAllAuctionItems()
      
}, []);
  
  
  const fetchAllAuctionItems = async () => {
    
    let response=await fetch("/rest/auctionItems")

    console.log("setting auctionItems")
    setAuctionItems(await response.json())
    
  };

  const postNewAuctionItem = async (itemToPost) => {
    let response = await fetch("/rest/auctionItems", {
      method: "POST",
      body: itemToPost
    })

    console.log(await response.json())
  }

  const values = {
    postNewAuctionItem,
    auctionItems
  };

  return (
    <AuctionItemContext.Provider value={values}>
      {props.children}
    </AuctionItemContext.Provider>
  );
};

export default AuctionItemProvider;
