package com.example.demo.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class User {

    @Id // primary key
    @GeneratedValue // enables auto increment
    private long id;

    private String fullName;

    @Column(unique=true)
    private String username;

    private String email;
    private String password;

    @OneToMany(mappedBy="owner")
    @JsonIgnoreProperties({"owner"})
    private List<AuctionItem> myAuctionItems;

    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String providerId;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_chatrooms",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "chatroom_id")
    )
    private List<ChatRoom> chatrooms;

    @JsonIgnore
    @JsonProperty(value = "password")
    public String getPassword() {
        return password;
    }

    // enable password from frontend when logging in
    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }

    public void updateChatrooms(ChatRoom chatRoom) {
       this.chatrooms.add(chatRoom);
   }


}
