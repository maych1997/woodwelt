import React, { useState } from "react";
import "./register.css";
import { TextField, Checkbox, FormControlLabel, Button } from "@mui/material";
import Gmail from "../../../assets/svg/gmail.svg";
import Mobile from "../../../assets/svg/mobile.svg";
import Show from "../../../assets/icons/show.svg";
import Hide from "../../../assets/icons/hide.svg";
import LoginWallpaper from "../../../assets/images/login-wallpaper.jpg";
import Header from "../../header/header";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfrmPassword, setShowCnfrmPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const newErrors = {
      email: email
        ? emailRegex.test(email)
          ? ""
          : "Invalid email address"
        : "Email is required",
      password: password
        ? passwordRegex.test(password)
          ? ""
          : "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character"
        : "Password is required",
    };

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const Login = () => {
    if (validateForm()) {
      //Login Action
    }
  };
  const showHidePassword = () => {
    setShowPassword(!showPassword);
  };
  const showHideCnfrmPassword = () => {
    setShowCnfrmPassword(!showCnfrmPassword);
  };
  return (
    <>
      <Header></Header>
      <div className="container">
        <div className="subContainer1">
          <div className="headingContainer">
            <h1>Register</h1>
            <h4>Register to create your woodwelt.eu store</h4>
          </div>
          <div className="form-container">
            <TextField
              className="text-input"
              id="first-name"
              size="small"
              label="First Name"
              variant="outlined"
              type="text"
            />
            <TextField
              className="text-input"
              id="last-name"
              size="small"
              label="Last Name"
              variant="outlined"
              type="text"
            />
            <TextField
              className="text-input"
              id="contact"
              size="small"
              label="Contact"
              variant="outlined"
              type="text"
            />
            <TextField
              className="text-input"
              id="address"
              size="small"
              label="Address"
              variant="outlined"
              type="text"
            />
            <TextField
              className="text-input"
              id="email"
              size="small"
              label="Email"
              variant="outlined"
              type="email"
              helperText={errors.email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <div className="password-container">
              <TextField
                className="text-input"
                type={showPassword == true ? "text" : "password"}
                id="outlined-basic"
                size="small"
                label="Password"
                variant="outlined"
                helperText={errors.password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />

              <img
                onClick={() => {
                  showHidePassword();
                }}
                className="icon"
                src={showPassword ? Hide : Show}
              />
            </div>
            <div className="password-container">
              <TextField
                className="text-input"
                type={showCnfrmPassword == true ? "text" : "password"}
                id="outlined-basic"
                size="small"
                label="Confirm Passsword"
                variant="outlined"
              />
              <img
                onClick={() => {
                  showHideCnfrmPassword();
                }}
                className="icon"
                src={showCnfrmPassword ? Hide : Show}
              />
            </div>
            <div className="button-container">
              <div className="login-container">
                <Button
                  onClick={() => {
                    Login();
                  }}
                  className="login-button"
                  variant="contained"
                >
                  Sign Up
                </Button>
                <div className="signup-container">
                  <p>Already Have an account?</p>
                  <a onClick={()=>{navigate('/')}}>Sign In</a>
                </div>
              </div>
              <div className="or-container">
                <div className="hyphon"></div>
                <p className="signUpSeperator">Or Sign Up With</p>
                <div className="hyphon"></div>
              </div>
              <div className="social-button-container">
                <Button className="social-button" variant="outlined">
                  <img src={Gmail}></img>
                </Button>
                <Button className="social-button" variant="outlined">
                  <img src={Mobile}></img>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="subContainer2">
          <img className="login-image" src={LoginWallpaper} />
        </div>
      </div>
    </>
  );
};

export default Register;
