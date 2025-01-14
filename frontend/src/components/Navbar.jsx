import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { UserContext } from "../contexts/UserContext";
import { useState, useContext } from "react";
import { NavDropdown } from "react-bootstrap";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { Link } from "react-router-dom";
import Search from "./search/Search";

function Navbar() {
  const { currentUser, logout } =
    useContext(UserContext);
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const [showPopup, setShowPopup] = useState(false)
 
  const toggleLogin = () => setLogin(!login);
  const toggleRegister = () => setRegister(!register);

  const pull_data = (data) => {
    console.log(data);
    setShowPopup(data);
    setTimeout(function () {
      setShowPopup(false);
    }, 4000);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={styles.navbar}>
      <a href="/" style={styles.mainName} className="link">
        Auctionista
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div>
        <Search />
      </div>
      {!currentUser ? (
        <div style={styles.loginButtons}>
          <div>
            <button
              className="btn btn-outline-light btn-lg"
              onClick={toggleLogin}
            >
              Login
            </button>
            <Login toggle={toggleLogin} modal={login} func={pull_data}></Login>
          </div>
          <div style={styles.registerButton}>
            <button
              className="btn btn-outline-light btn-lg"
              onClick={toggleRegister}
            >
              Register
            </button>
            <Register
              toggle={toggleRegister}
              modal={register}
              func={pull_data}
            ></Register>
          </div>
        </div>
      ) : (
        <div
          className="collapse navbar-collapse"
          id="navbarNavDropdown"
          style={styles.ul}
        >
          <ul className="navbar-nav">
            <NavDropdown
              style={{ fontFamily: "Montserrat, sans-serif" }}
              id="nav-dropdown-dark-example"
              title={"Hello " + currentUser.username}
              menuVariant="dark"
            >
              <NavDropdown.Item>
                <Link to="/create-new-listing" className="link">
                  Create new auction
                </Link>
              </NavDropdown.Item>

              <NavDropdown.Item>
                <Link to="/my-listings" className="link">
                  Current listings
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to="/my-messages" className="link">
                  Chat
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>
                <Link to="/" className="link">
                  Log out
                </Link>
              </NavDropdown.Item>
            </NavDropdown>
          </ul>
        </div>
      )}
      <div
        className="collapse navbar-collapse"
        id="navbarNavDropdown"
        style={styles.ul}
      ></div>
      <div
        className="loggedin"
        style={showPopup ? styles.loggedIn : styles.hide}
      >
        <p>Logged in</p>
      </div>
  
    </nav>
  );
}

export default Navbar;

const styles = {
  navbar: {
    backgroundColor: "black",
    padding: "1vw 2vw 1vw 3vw",
    color: "white",
  },
  loginButtons: {
    fontFamily: "Montserrat, sans-serif",
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    right: "0",
    marginRight: "60px",
  },
  registerButton: {
    marginLeft: "10px",
  },

  loggedIn: {
    position: "absolute",
    width: "13vw",
    height: "5vh",
    backgroundColor: "green",
    top: "11.2vh",
    right: "10vw",
    opacity: "0.8",
    borderRadius: "5px",
    textAlign: "center",
  },

  ul: {
    fontSize: "1.2em",
    paddingLeft: "8vw",
  },
  mainName: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "1.7em",
    color: "white",
  },

  hide: {
    display: "none",
  },
};
