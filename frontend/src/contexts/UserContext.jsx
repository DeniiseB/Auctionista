import React from "react";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    whoAmI();
  }, []);

  const register = async (user) => {
    let res = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(user),
    });
    if (res.status == 200) {
      let fetchedUser = await res.json();
      return fetchedUser;
    } else {
      console.log("Register failed");
      return null;
    }
  };

  const login = async (user) => {
    let res = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(user),
    });
    console.log(res)
    if (res.status == 200) {
      let fetchedUser = await res.json();
      console.log("Logged in: ", fetchedUser);
      setCurrentUser(fetchedUser);
      return fetchedUser;
    } else {
      console.log("Login failed");
      return null;
    }
  };

  const logout = async () => {
    try {
      await fetch("/logout");
      setCurrentUser(null);
      console.log("User logged out")
    } catch {
      console.log("Logout failed");
    }
  };

  const whoAmI = async () => {
    try {
      let res = await fetch("/api/whoami");
      if (res.status == 200) {
        let fetchedUser = await res.json();
        setCurrentUser(fetchedUser);
        console.log("I am: ", fetchedUser);
      } else {
        console.log("Current user not found");
        setCurrentUser(null);
        return null;
      }
    } catch {
      console.log("Something went wrong");
    }
  };

  const values = {
    register,
    login,
    logout,
    whoAmI,
    currentUser,
  };

  return (
    <UserContext.Provider value={values}>{props.children}</UserContext.Provider>
  );
};

export default UserContextProvider;
