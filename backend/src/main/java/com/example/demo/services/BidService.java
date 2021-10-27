package com.example.demo.services;

import com.example.demo.entities.AuctionItem;
import com.example.demo.entities.Bid;
import com.example.demo.repositories.AuctionItemRepository;
import com.example.demo.repositories.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BidService {  //omvandla unix timestamp här

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private AuctionItemRepository auctionItemRepository;

    public List<Bid> getAll(){
        return bidRepository.findAll();
    }
    public Optional<Bid> getById(long id){
        return bidRepository.findById(id);
    }


    public Bid saveBid(Bid bid){

        AuctionItem itemToChange=auctionItemRepository.findById(bid.getAuctionItem().getId()).get();
        itemToChange.setMinimumBid(Math.round((itemToChange.getMinimumBid() * 110)/100));

        auctionItemRepository.save(itemToChange);

        return bidRepository.save(bid);
    }
}
