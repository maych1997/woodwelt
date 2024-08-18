import React, { useState } from "react";
import "./register.css";
import { TextField, Checkbox, FormControlLabel, Button } from "@mui/material";
import Gmail from "../../../assets/svg/gmail.svg";
import Mobile from "../../../assets/svg/mobile.svg";
import LoginWallpaper from "../../../assets/images/login-wallpaper.jpg";
import Header from "../../header/header";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate=useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [checked,setChecked]=useState(false);
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const newErrors = {
      email: email ? (emailRegex.test(email) ? '' : 'Invalid email address') : 'Email is required',
      password: password ? (passwordRegex.test(password) ? '' : 'Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character') : 'Password is required',
    };

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const Login = () => {
    if (validateForm()) {
      //Login Action
    }
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
          <TextField
            className="text-input"
            type="password"
            id="outlined-basic"
            size="small"
            label="Password"
            variant="outlined"
            helperText={errors.password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <div className="action-container">
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onClick={()=>{setChecked(!checked)}}
                  sx={{
                    color: "#BFC9CA",
                    "&.Mui-checked": {
                      color: "#1976d2",
                    },
                  }}
                />
              }
              label={"Remember Me"}
            />
            <a onClick={()=>{navigate('/forgot-password')}} className="forget-password">
              Forgot Password
            </a>
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
                Login
              </Button>
              <div className="signup-container">
                <p>Don't have an account?</p>
                <a href="#">Sign Up</a>
              </div>
            </div>
            <div className="or-container">
              <div className="hyphon"></div>
              <p>Or Login With</p>
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
