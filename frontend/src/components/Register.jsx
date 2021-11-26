import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import styled from "styled-components";
import { UserContext } from "../contexts/UserContext";
import { useState, useContext } from "react";
import { Modal, InputGroup, FormControl } from "react-bootstrap";

const ErrorMessage = styled.span`
  display: flex;
  justify-content: center;
  background: red;
  color: white;
`;

const SuccessMessage = styled.span`
  display: flex;
  justify-content: center;
  background: green;
  color: white;
`;

export function Register(props) {
  const { modal, toggle } = props;
  const { register, login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmedPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMsg] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [emailIsTaken] = useState(false);

  async function registerUser(e) {
    e.preventDefault();
    if (password === "" || confirmPassword !== password) {
      setpasswordError(true);
      return;
    } else {
      setpasswordError(false);
    }
    if (!email.includes("@")) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }
    if (!username || !fullName) {
      setErrorMessage(true);
      return;
    } else {
      setErrorMessage(false);
    }
    let user = {
      username: username,
      password: password,
      fullName: fullName,
      email: email,
    };
    let userLogin = {
      email: email,
      password: password,
    };
    const response = await register(user);
    if (response !== null) {
      console.log("User registered");
      loginAfterRegister(userLogin);
    } 
  }

  async function loginAfterRegister(userLogin) {
    let loginRes = await login(userLogin);
    console.log("userLogin: ", userLogin)
    console.log("loginRes: ", loginRes)
    if (loginRes !== null) {
      console.log("User logged in");
    } 
  }

  return (
    <div>
      <Modal show={modal} onHide={toggle}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
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
          <div className="input-login-div line">
            <InputGroup className="mb-3">
              <FormControl
                aria-describedby="inputGroup-sizing-default"
                required
                type="text"
                placeholder="Fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="input-login-div line">
            <InputGroup className="mb-3">
              <FormControl
                aria-describedby="inputGroup-sizing-default"
                required
                type="text"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          <div className="input-login-div">
            <InputGroup className="mb-3">
              <FormControl
                aria-describedby="inputGroup-sizing-default"
                required
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
              />
            </InputGroup>
          </div>
          {passwordError && <ErrorMessage>Password did not match</ErrorMessage>}
          {emailError && <ErrorMessage>Choose another email.</ErrorMessage>}
          {errorMessage && (
            <ErrorMessage>You must fill all input fields!</ErrorMessage>
          )}
          {successMsg && (
            <SuccessMessage>Successfully registered a new user!</SuccessMessage>
          )}
          {emailIsTaken && <ErrorMessage>Email is already taken</ErrorMessage>}
        </div>
        <Modal.Footer>
          <button
            className="btn btn-dark btn-lg"
            onClick={(e) => registerUser(e)}
          >
            Register
          </button>{" "}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
