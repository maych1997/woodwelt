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
import { auth, database, provider } from "../../../backend/firebase/connection";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  ref as dbRef,
  get,
  onValue,
  ref,
  set,
  update,
} from "firebase/database";
import PhoneInput from "react-phone-input-2";

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
  const validateCompleteDetails = () => {
    const newErrors = {
      contact: contact ? "" : "Contact is Required",
      address: address ? "" : "Address is Required",
    };

    setErrors(newErrors);

    return !newErrors.contact && !newErrors.address;
  };

  const Login = async () => {
    setLoad(true);
    if (validateForm()) {
      try {
        await signInWithEmailAndPassword(auth, email, password)
          .then((result) => {
            if (result) {
              setLoad(false);
              navigate("/admin/dashboard?location=dashboard");
            }
          })
          .catch((error) => {
            setLoad(false);
            alert(error);
          });

        // Redirect or show success message
      } catch (error) {
        alert(error.message);
      }
    }
  };
  const showHidePassword = () => {
    setShowPassword(!showPassword);
  };
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);

      // Reference to the user's data in the database
      const userRef = dbRef(database, "users/" + user.uid);

      // Check if the user data already exists
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        // User exists
        console.log("User is returning.");
        setNewUser(false); // or setNewUser(false) to indicate existing user
        navigate("/admin/dashboard?location=dashboard");
      } else {
        // User is new, set data
        await set(userRef, {
          uid: user.uid,
          firstName: user.displayName.split(" ")[0],
          lastName: user.displayName.split(" ")[1],
          email: user.email,
          contact: contact,
          profilePicture: user.photoURL,
          address: address,
        });
        console.log("New user data pushed successfully!");
        setNewUser(true); // or setNewUser(true) to indicate new user
      }

      // Navigate after setting the user state

      setLoad(false);
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(error.message);
      setLoad(false);
    }
  };
  const completeUserDetails = () => {
    if (user != null && validateCompleteDetails()) {
      const newRef = dbRef(database, "users/" + user.uid);
      set(newRef, {
        uid: user.uid,
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1],
        email: user.email,
        contact: contact,
        profilePicture: user.photoURL,
        address: address,
      })
        .then(() => {
          console.log("Data pushed successfully!");
          navigate("/admin/dashboard?location=dashboard");
          setLoad(false);
        })
        .catch((error) => {
          console.error("Error pushing data: ", error);
          alert(error.message);
          setLoad(false);
        });
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
      <Header></Header>
      <div className="container">
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
                      completeUserDetails();
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
                      Login();
                    }}
                    className="login-button"
                    variant="contained"
                  >
                    {load ? <CircularProgress size={25} /> : "Sign In"}
                  </Button>
                  <div className="signup-container">
                    <p>Don't have an account?</p>
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
                      signInWithGoogle();
                    }}
                    variant="outlined"
                  >
                    <img src={Gmail}></img>
                  </Button>
                  <Button className="social-button" variant="outlined">
                    <img src={Mobile}></img>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="subContainer2">
          <img className="login-image" src={LoginWallpaper} />
        </div>
      </div>
    </>
  );
};

export default Login;
