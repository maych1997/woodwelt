import React, { useEffect, useState } from "react";
import "./login.css";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import Gmail from "../../../assets/svg/gmail.svg";
import Mobile from "../../../assets/svg/mobile.svg";
import LoginWallpaper from "../../../assets/images/login-wallpaper.jpg";
import Header from "../../header/header";
import Show from "../../../assets/icons/show.svg";
import Hide from "../../../assets/icons/hide.svg";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../backend/firebase/connection";
import { onAuthStateChanged } from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import { LoginAPI, signInWithGoogle } from "../../../backend/firebase/User/Login/Login";
import verifyCode from "../../../backend/firebase/User/Login/VerifyOTP";
import SendOTPCode from "../../../backend/firebase/User/Login/OTP";
import completeUserDetails from "../../../backend/firebase/User/Login/Details";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [load, setLoad] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isNewUser, setNewUser] = useState(false);
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [code, setCode] = useState("+1");
  const [codeSent, setCodeSent] = useState(false);
  const [contactOTP, setContactOtp] = useState(null);
  const [show, setShow] = useState(false);
  const showHidePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  return (
    <>
      <Header></Header>
      <div className="container">
        {show ? (
          <div className="modal-div">
            {codeSent == true ? (
              <TextField
                className="text-input"
                id="otp"
                size="small"
                label="OTP"
                variant="outlined"
                type="text"
                helperText={errors.address}
                onChange={(event) => {
                  setCode(event.target.value);
                }}
              />
            ) : (
              <PhoneInput
                country={"us"} // Specify default country if needed
                autoFocus
                containerClass="phoneInput"
                specialLabel="Contact"
                onChange={(contactOTP) => {
                  setContactOtp(contactOTP);
                }}
                inputStyle={{ width: "100%" }} // Adjust styles as needed
              />
            )}
            <p className="error">
              {codeSent ? errors.code : errors.contactOTP}
            </p>

            <div id="recaptcha-container"></div>
            <Button
              id="sign-in-button"
              disabled={load}
              onClick={() => {
                if (codeSent) {
                  verifyCode(setCodeSent, setShow, navigate, code, user);
                } else {
                  SendOTPCode(contactOTP, code, setErrors, setCodeSent);
                }
              }}
              className="login-button"
              variant="contained"
            >
              {codeSent ? "Verify OTP Code" : "Send OTP Code"}
            </Button>

            <div className="login-action-container">
              <p className="already-text">Go Back to </p>
              <a
                onClick={() => {
                  setCodeSent(false);
                  handleClose();
                }}
              >
                Login
              </a>
            </div>
          </div>
        ) : (
          <div className="subContainer1">
            <div className="headingContainer">
              <h1>{isNewUser ? "Complete Profile" : "Login"}</h1>
              <h4>
                {isNewUser
                  ? "Complete the registeration details to proceed"
                  : "Login to access your woodwelt.eu admin dashboard"}
              </h4>
            </div>
            {isNewUser ? (
              <div className="form-container">
                <div>
                  <PhoneInput
                    containerClass="phoneInput"
                    specialLabel="Contact"
                    value={contact}
                    onChange={(contact) => {
                      setContact(contact);
                    }}
                    inputStyle={{ width: "100%" }} // Adjust styles as needed
                  />
                  <p className="error">{errors.contact}</p>
                </div>
                <TextField
                  className="text-input"
                  id="address"
                  size="small"
                  label="Address"
                  variant="outlined"
                  type="text"
                  helperText={errors.address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                  }}
                />
                <div className="button-container">
                  <div className="login-container">
                    <Button
                      disabled={load}
                      onClick={() => {
                        completeUserDetails(
                          address,
                          contact,
                          setErrors,
                          setLoad,
                          navigate,
                          user
                        );
                      }}
                      className="login-button"
                      variant="contained"
                    >
                      {load ? <CircularProgress size={25} /> : "Done"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
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
                    className="eye-icon"
                    src={showPassword ? Hide : Show}
                  />
                </div>
                <div className="action-container">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onClick={() => {
                          setChecked(!checked);
                        }}
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
                  <a
                    onClick={() => {
                      navigate("/forgot-password");
                    }}
                    className="forget-password"
                  >
                    Forgot Password
                  </a>
                </div>
                <div className="button-container">
                  <div className="login-container">
                    <Button
                      disabled={load}
                      onClick={() => {
                        setLoad(true);
                        LoginAPI(email, password, setErrors, setLoad, navigate);
                      }}
                      className="login-button"
                      variant="contained"
                    >
                      {load ? <CircularProgress size={25} /> : "Sign In"}
                    </Button>
                    <div className="signup-container">
                      <p className="already-text">Don't have an account?</p>
                      <a
                        onClick={() => {
                          navigate("/admin/register");
                        }}
                      >
                        Sign Up
                      </a>
                    </div>
                  </div>
                  <div className="or-container">
                    <div className="hyphon"></div>
                    <p>Or Login With</p>
                    <div className="hyphon"></div>
                  </div>
                  <div className="social-button-container">
                    <Button
                      className="social-button"
                      onClick={() => {
                        signInWithGoogle(
                          contact,
                          address,
                          setNewUser,
                          setLoad,
                          navigate
                        );
                      }}
                      variant="outlined"
                    >
                      <img src={Gmail}></img>
                    </Button>
                    <Button
                      onClick={() => {
                        handleShow();
                      }}
                      className="social-button"
                      variant="outlined"
                    >
                      <img src={Mobile}></img>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="subContainer2">
          <img className="login-image" src={LoginWallpaper} />
        </div>
      </div>
    </>
  );
};

export default Login;
