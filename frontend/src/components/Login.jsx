import React from 'react'
import "bootstrap/dist/css/bootstrap.css";
import styled from "styled-components";
import { UserContext } from "../contexts/UserContext"
import { useState, useContext } from "react";
import { Modal, InputGroup, FormControl } from "react-bootstrap";

const ErrorMessage = styled.span`
  display: flex;
  justify-content: center;
  background: red;
  color: white;
  `

const SuccessMessage = styled.span`
  display: flex;
  justify-content: center;
  background: green;
  color: white;
`

export function Login(props) {
  const { modal, toggle } = props;
  const { login } = useContext(UserContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(false)
  const [successMsg] = useState(false)


   function openPopup() {
     props.func(true);
   }
 
  
  async function logIn(e) {
    e.preventDefault()
    setErrorMessage(false)
    let user = {
      username: username,
      password: password
    }
    const response = await login(user)
    if (response !== null) {
      openPopup();
    } else {
      console.log("Login failed");
    }
  }


  return (
    <div>
      <Modal show={modal} onHide={toggle}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <div className="input-login-div-wrap">
          <div className="input-login-div line">
            <InputGroup className="mb-3">
              <FormControl
                aria-describedby="inputGroup-sizing-default"
                required
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="input-login-div">
            <InputGroup className="mb-3">
              <FormControl
                aria-describedby="inputGroup-sizing-default"
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </div>
          {errorMessage && <ErrorMessage>Bad credentials</ErrorMessage>}
          {successMsg && <SuccessMessage>Login successfull</SuccessMessage>}
        </div>

        <Modal.Footer>
          <div className="loginFooter" style={styles.loginFooter}>
            <button className="btn btn-dark btn-lg" onClick={(e) => logIn(e)}>
              Login
            </button>{" "}
            <div className="social" style={styles.social}>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const styles = {
  socialLogin: {
    width: "30%",
  },
  loginFooter: {
    display: "flex",
    gap: "10vw",
    alignItems: "center",
    justifyContent: "spaceBetween",
    textAlign: "center",
  },
  social: {
    display: "flex",
    gap: "1vw",
  },
  socialLogos: {
    marginRight:"1vw"
  },
  logos: {
    marginLeft:"10vw"
  }
};