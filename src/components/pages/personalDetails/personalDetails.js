import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./personalDetails.css";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import Gmail from "../../../assets/svg/gmail.svg";
import Mobile from "../../../assets/svg/mobile.svg";
import Show from "../../../assets/icons/show.svg";
import Hide from "../../../assets/icons/hide.svg";
import RegisterWallpaper from "../../../assets/images/e-commerce-3692440_1280.jpg";
import Header from "../../header/header";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  storage,
  database,
  auth,
  provider,
} from "../../../backend/firebase/connection";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  ref as dbRef,
  get,
  onValue,
  ref,
  set,
  update,
} from "firebase/database";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
// import Modal from "@mui/material/Modal";
import { Form } from "react-bootstrap";
import firebase from "firebase/compat/app";
import { Modal } from "react-bootstrap";
const PersonalDetails = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfrmPassword, setShowCnfrmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [load, setLoad] = useState(false);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("+1");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState("");
  const [isNewUser, setNewUser] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [show, setShow] = useState(false);
  const [showDetailsInfo, setDetailsInfo] = useState(false);
  const validateFormForPhoneSignIn = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      firstName: firstName ? "" : "First Name is Required",
      lastName: lastName ? "" : "Last Name is Required",
      address: address ? "" : "Address is Required",
      email: email
        ? emailRegex.test(email)
          ? ""
          : "Invalid email address"
        : "Email is required",
    };
    setErrors(newErrors);
    return (
      !newErrors.email &&
      !newErrors.firstName &&
      !newErrors.lastName &&
      !newErrors.address
    );
  };

  const phoneSignIn = async () => {
      if (validateFormForPhoneSignIn()) {
        const newRef = dbRef(database, "users/" + user?.uid);
        try {
       
          set(newRef, {
            uid: user?.uid,
            firstName: firstName,
            lastName: lastName,
            email: email,
            contact: user.phoneNumber,
            profilePicture: url,
            address: address,
          })
            .then(() => {
              // console.log("Data pushed successfully!");
              // navigate("/admin/dashboard?location=dashboard");
              // setLoad(false);
              if (image == null || image == undefined) {
                navigate("/admin/dashboard?location=dashboard");
                setLoad(false);
              } else {
                handleUpload(user);
                navigate("/admin/dashboard?location=dashboard");
                setLoad(false);
              }
            })
            .catch((error) => {
              console.error("Error pushing data: ", error);
              alert(error.message);
              setLoad(false);
            });
        } catch (error) {
          alert(error);
        }
    }
  };

  const handleUpload = (user) => {
    console.log(user);
    if (image) {
      const imageRef = storageRef(storage, `profilepicture/${image.name}`);
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
          update(dbRef(database, "users/" + user?.uid), {
            profilePicture: url,
          });
          setUrl(null);
          setImage(null);
        })
        .catch((error) => {
          alert(error.message);
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
            <h1>Complete Profile</h1>
            <h4>Complete the registeration details to proceed</h4>
          </div>
          <div className="user-modal-div">
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <div className="form-container">
                  <TextField
                    className="text-input"
                    id="first-name"
                    size="small"
                    label="First Name"
                    variant="outlined"
                    type="text"
                    helperText={errors?.firstName}
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
                    name="lastName"
                    type="text"
                    helperText={errors?.lastName}
                    onChange={(event) => {
                      setLastName(event.target.value);
                    }}
                  />
                  <TextField
                    className="text-input"
                    id="address"
                    size="small"
                    label="Address"
                    variant="outlined"
                    type="text"
                    name="address"
                    helperText={errors?.address}
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
                    name="email"
                    helperText={errors?.email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  />
                  {image != null ? (
                    <p className="fileName">
                      <b>Attached:</b> {image.name}
                    </p>
                  ) : (
                    ""
                  )}
                  <Button variant="contained" component="label">
                    Upload Profile Pictiure
                    <input
                      type="file"
                      hidden
                      onChange={(event) => {
                        setImage(event.target.files[0]);
                      }}
                    />
                  </Button>
                  <Button
                    disabled={load}
                    onClick={() => {
                      phoneSignIn();
                    }}
                    className="login-button"
                    variant="contained"
                  >
                    Confirm
                  </Button>
                  <div className="cancelButtonContainer">
                    <Button
                      disabled={load}
                      onClick={() => {
                        navigate("/admin/register");
                      }}
                      className="cancel-button"
                      variant="contained"
                    >
                      cancel
                    </Button>
                  </div>
                </div>
              </Form.Group>
            </Form>
          </div>
        </div>
        <div className="subContainer2">
          <img className="login-image" src={RegisterWallpaper} />
        </div>
      </div>
    </>
  );
};
export default PersonalDetails;
