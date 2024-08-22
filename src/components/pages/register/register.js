import React, { useState } from "react";
import "./register.css";
import { TextField, Checkbox, FormControlLabel, Button, Modal, Box, CircularProgress } from "@mui/material";
import Gmail from "../../../assets/svg/gmail.svg";
import Mobile from "../../../assets/svg/mobile.svg";
import Show from "../../../assets/icons/show.svg";
import Hide from "../../../assets/icons/hide.svg";
import RegisterWallpaper from "../../../assets/images/e-commerce-3692440_1280.jpg";
import Header from "../../header/header";
import { useNavigate } from "react-router-dom";
import { storage, database, auth } from "../../../backend/firebase/connection";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref as dbRef, push } from "firebase/database";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [cnfrmPass, setCnfrmPass] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfrmPassword, setShowCnfrmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [load,setLoad]=useState(false);
  const [url, setUrl] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const newErrors = {
      firstName: firstName ? "" : "First Name is Required",
      lastName: lastName ? "" : "Last Name is Required",
      contact: contact ? "" : "Contact is Required",
      address: address ? "" : "Address is Required",
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
      cnfrmPass: cnfrmPass
        ? passwordRegex.test(cnfrmPass)
          ? password == cnfrmPass
            ? ""
            : "Passwords Dont Match"
          : "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character"
        : "Confirm your password",
    };

    setErrors(newErrors);
    return (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.firstName &&
      !newErrors.lastName &&
      !newErrors.contact &&
      !newErrors.address &&
      !newErrors.cnfrmPass
    );
  };

  const registerWithEmail = async () => {
    if (validateForm()) {

      // try {
      //   const userCredential = (await createUserWithEmailAndPassword(auth, email, password));
      //   const user=userCredential.user;
      //   // Registered successfully
      //   if(image==null){
      //     setSuccess('User registered successfully!');
      //     console.log('User Info:', userCredential.user);
      //   }else{
      //     handleUpload();
      //     await updateProfile(user, {
      //       displayName: firstName+' '+lastName,
      //       photoURL: url!=null?url:'',
      //       phoneNumber:contact!=null?contact:'',
      //     });
      //     console.log('User Info:', userCredential.user);
      //   }
      //   // You can also redirect or perform other actions here
      // } catch (error) {
      //   // Handle Errors here
      //   setError(error.message);
      //   console.error('Error registering user:', error);
      // }
      alert('Yet To Be Implemented');
    }
  };
  const showHidePassword = () => {
    setShowPassword(!showPassword);
  };
  const showHideCnfrmPassword = () => {
    setShowCnfrmPassword(!showCnfrmPassword);
  };
  const handleUpload = () => {
    if (image) {
      const imageRef = storageRef(storage, `images/${image.name}`);
      const uploadTask = uploadBytes(imageRef, image);

      uploadTask
        .then((snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);

          return getDownloadURL(imageRef);
        })
        .then((url) => {
          setUrl(url);
          push(dbRef(database, "images"), { url: url });
        })
        .catch((error) => {
          console.error(error);
        });
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
              id="first-name"
              size="small"
              label="First Name"
              variant="outlined"
              type="text"
              helperText={errors.firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
            <TextField
              className="text-input"
              id="last-name"
              size="small"
              label="Last Name"
              variant="outlined"
              type="text"
              helperText={errors.lastName}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
            <TextField
              className="text-input"
              id="contact"
              size="small"
              label="Contact"
              variant="outlined"
              type="text"
              helperText={errors.contact}
              onChange={(event) => {
                setContact(event.target.value);
              }}
            />
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
            <div className="password-container">
              <TextField
                className="text-input"
                type={showCnfrmPassword == true ? "text" : "password"}
                id="outlined-basic"
                size="small"
                label="Confirm Passsword"
                variant="outlined"
                helperText={errors.cnfrmPass}
                onChange={(event) => {
                  setCnfrmPass(event.target.value);
                }}
              />
              <img
                onClick={() => {
                  showHideCnfrmPassword();
                }}
                className="eye-icon"
                src={showCnfrmPassword ? Hide : Show}
              />
            </div>
            {image!=null?<p className="fileName"><b>Attached:</b> {image.name}</p>:''}
            <Button disabled={load} variant="contained" component="label">
            {load?<CircularProgress size={25}/>:'Upload Profile Pictiure'}
              <input
                type="file"
                hidden
                onChange={(event) => {
                  setImage(event.target.files[0]);
                }}
              />
            </Button>
            <div className="button-container">
              <div className="login-container">
                <Button
                  disabled={load}
                  onClick={() => {
                    registerWithEmail();
                  }}
                  className="login-button"
                  variant="contained"
                >
                  {load?<CircularProgress size={25}/>:'Sign In'}
                </Button>
                <div className="signup-container">
                  <p>Already Have an account?</p>
                  <a
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Sign In
                  </a>
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
          <img className="login-image" src={RegisterWallpaper} />
        </div>
      </div>
    </>
  );
};

export default Register;
