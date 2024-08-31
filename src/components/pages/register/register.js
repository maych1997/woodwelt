import React, { forwardRef, useEffect, useState } from "react";
import "./register.css";
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
import Modal from "@mui/material/Modal";
import { Form } from "react-bootstrap";
import firebase from "firebase/compat/app";

const Register = () => {
  const [countries, setCountries] = useState([]);
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
  const [load, setLoad] = useState(false);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("+1");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState("");
  const [isNewUser, setNewUser] = useState(false);
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
  const validateCompleteDetails = () => {
    const newErrors = {
      contact: contact ? "" : "Contact is Required",
      address: address ? "" : "Address is Required",
    };

    setErrors(newErrors);

    return !newErrors.contact && !newErrors.address;
  };
  const validationForOTP = () => {
    const newErrors = {
      contactOTP: contactOTP ? "" : "Contact is Required",
      code:code?"":"OTP is Required."
    };

    setErrors(newErrors);

    return !newErrors.contactOTP && !newErrors.code;
  };

  const registerWithEmail = async () => {
    setLoad(true);
    if (validateForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        // Registered successfully

        const newRef = dbRef(database, "users/" + user.uid);
        set(newRef, {
          uid: user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          contact: "+" + contact,
          profilePicture: url,
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
        if (image == null || image == undefined) {
        } else {
          handleUpload(user);
          setSuccess("User registered successfully!");
          setLoad(false);
          console.log("User Info:", userCredential.user);
        }
        // You can also redirect or perform other actions here
      } catch (error) {
        // Handle Errors here
        console.log(error.code);
        setError(error.message);
        alert(error.message);
        setLoad(false);
        console.error("Error registering user:", error);
      }
    } else {
      setLoad(false);
    }
  };
  const showHidePassword = () => {
    setShowPassword(!showPassword);
  };
  const showHideCnfrmPassword = () => {
    setShowCnfrmPassword(!showCnfrmPassword);
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
  const signUpWithGoogle = async () => {
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
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const [codeSent, setCodeSent] = useState(false);
  const [contactOTP, setContactOtp] = useState(null);
  const SendOTPCode = async () => {
    console.log(contactOTP);
    if (validationForOTP()) {
      try {
        const recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
          'size': 'invisible',  // or 'normal'
          'callback': (response) => {
            // Success callback
            console.log('Recaptcha verified');
          },
          'expired-callback': () => {
            // Expired callback
            console.log('Recaptcha expired');
          }
        });
      
        const confirmation=signInWithPhoneNumber(auth,'+923474077976',recaptchaVerifier);
        setUser(confirmation);
      } catch (error) {
        console.error("Error setting up RecaptchaVerifier:", error);
      }
      // const confirmation = signInWithPhoneNumber(auth, contactOTP, recaptcha);
      // console.log(confirmation);
      setCodeSent(true);
    }
  };
  const verifyCode=async()=>{
    user.confirm(code);
  }
  const ContactModal = () => {
    return (
      // <Modal
      //   centered
      //   show={show}
      //   onHide={() => {
      //     handleClose();
      //   }}
      // >
      //   <Modal.Header closeButton>
      //     <Modal.Title>Sign Up With Contact</Modal.Title>
      //   </Modal.Header>
      //   <Modal.Body>
      //     <div className="modal-div">
      //       <Form>
      //         <Form.Group
      //           className="mb-3"
      //           controlId="exampleForm.ControlInput1"
      //         >
      //           <Form.Group className="mb-3" controlId="phoneInput">
      //             <Form.Label>Contact</Form.Label>
      //             <PhoneInput
      //               country={"us"} // Specify default country if needed
      //               autoFocus
      //               containerClass="phoneInput"
      //               specialLabel="Contact"
      //               onChange={(contactOTP) => {
      //                 setContactOtp(contactOTP);
      //               }}
      //               inputStyle={{ width: "100%" }} // Adjust styles as needed
      //             />
      //           </Form.Group>
      //           <p className="error">{errors.contactOTP}</p>
      //           <Button
      //             disabled={load}
      //             onClick={() => {
      //               SendOTPCode();
      //             }}
      //             className="login-button"
      //             variant="contained"
      //           >
      //             {codeSent ? "Verify OTP" : "Send OTP Code"}
      //           </Button>
      //         </Form.Group>
      //       </Form>
      //     </div>
      //   </Modal.Body>
      // </Modal>
      <div className="parent">
        <div
          open={show}
          onClose={() => {
            handleClose();
          }}
          style={{ display: show ? "flex" : "none" }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="modal-container"
        ></div>
      </div>
    );
  };

  return (
    <>
      <Header></Header>
      {/* <ContactModal></ContactModal> */}
      <div className="container">
        {show ? (
          <div className="modal-div">
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Group controlId="phoneInput">
                  {codeSent==true?<TextField
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
                />:
                  <PhoneInput
                  country={"us"} // Specify default country if needed
                  autoFocus
                  containerClass="phoneInput"
                  specialLabel="Contact"
                  onChange={(contactOTP) => {
                    setContactOtp(contactOTP);
                  }}
                  inputStyle={{ width: "100%" }} // Adjust styles as needed
                />}
                </Form.Group>
                <p className="error">{errors.contactOTP}</p>

                <div id="recaptcha-container"></div>
                <Button
                  id="sign-in-button"
                  disabled={load}
                  onClick={() => {
                    if(codeSent){verifyCode()}else{
                      SendOTPCode();
                    };
                  }}
                  className="login-button"
                  variant="contained"
                >
                  {codeSent ? "Verify OTP" : "Send OTP Code"}
                </Button>
              </Form.Group>
            </Form>
            <div className="signup-container">
              <p className="already-text">Go Back to</p>
              <a
                onClick={() => {
                  setShow(!show);
                }}
              >
                Register
              </a>
            </div>
          </div>
        ) : (
          <div className="subContainer1">
            <p>{error}</p>
            <div className="headingContainer">
              <h1>{isNewUser ? "Complete Profile" : "Register"}</h1>
              <h4>
                {isNewUser
                  ? "Complete the registeration details to proceed"
                  : "Register to create your woodwelt.eu store"}
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
                      {load ? <CircularProgress size={25} /> : "Sign Up"}
                    </Button>
                    <div className="signup-container">
                      <p className="already-text">Already Have an account?</p>
                      <a
                        onClick={() => {
                          navigate("/admin/login");
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
                    <Button
                      className="social-button"
                      onClick={() => {
                        signUpWithGoogle();
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
          <img className="login-image" src={RegisterWallpaper} />
        </div>
      </div>
    </>
  );
};

export default Register;
