import React, { useEffect, useState } from "react";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsFillBoxFill,
} from "react-icons/bs";
import "./dashboard.css";
import placeHolder from "../../assets/images/user-place-holder.jpg";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, database } from "../../backend/firebase/connection";
import { onValue, ref } from "firebase/database";
import { CircularProgress, LinearProgress } from "@mui/material";
import { Collapse } from '@mui/material';
function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [data, setData] = useState(null);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      navigate("/admin/login");
      // Redirect to login or home page after logout
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribeAuthState = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    const nodeRef = ref(database, "users/" + user?.uid);

    const unsubscribeData = onValue(nodeRef, (snapshot) => {
      const data = snapshot.val();
      if (data != null) {
        setData(data);
      }
    });
    // Clean up subscription on unmount
    return () => {
      unsubscribeData();
      unsubscribeAuthState();
    };
  }, [user]);

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div
        onClick={() => {
          navigate("/dashboard?location=dashboard");
        }}
        className="sidebar-title"
      >
        <div className="sidebar-brand">
          <BsCart3 className="icon_header" /> Woodwelt.eu
        </div>
        <span
          className="icon close_icon"
          onClick={() => {
            OpenSidebar();
          }}
        >
          X
        </span>
      </div>
      <div className="profileCard">
        <div className="profilePicture">
          <div className="profilePictureContainer">
            <img
              style={{ opacity: data?.profilePicture != null ? 1 : 0.5 }}
              src={
                data?.profilePicture != "" ||
                data?.profilePicture != "" ||
                data.profilePicture.length != 0
                  ? data?.profilePicture
                  : placeHolder
              }
            ></img>
            <div
              style={{
                height: "80px",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                zIndex: 1,
                display: data?.profilePicture == null ? "flex" : "none",
              }}
            >
              <CircularProgress style={{ color: "#fff" }} size={25} />
            </div>
          </div>
          <LinearProgress
            color="inherit"
            style={{
              width: "50%",
              color: "#fff",
              display: data?.firstName == null ? "flex" : "none",
              marginTop: "10px",
            }}
          />
          <LinearProgress
            color="inherit"
            style={{
              width: "80%",
              color: "#fff",
              display: data?.firstName == null ? "flex" : "none",
              marginTop: "10px",
            }}
          />
          <LinearProgress
            color="inherit"
            style={{
              width: "50%",
              color: "#fff",
              display: data?.firstName == null ? "flex" : "none",
              marginTop: "10px",
            }}
          />
          <p style={{ display: data?.firstName == null ? "none" : "flex" }}>
            {data?.firstName} {data?.lastName}
          </p>
          <p style={{ display: data?.email == null ? "none" : "flex" }}>
            {data?.email}
          </p>
          <p style={{ display: data?.contact == null ? "none" : "flex" }}>
            {data?.contact}
          </p>
        </div>
      </div>
      <ul className="sidebar-list">
        <li
          onClick={() => {
            navigate("/admin/dashboard?location=dashboard");
          }}
          className="sidebar-list-item"
        >
          <BsGrid1X2Fill className="icon" /> Dashboard
        </li>
        <li
          onClick={() => {
            navigate("/admin/dashboard?location=products");
          }}
          className="sidebar-list-item"
        >
          <BsFillArchiveFill className="icon" /> Products
        </li>
        <li
          onClick={() => {
            navigate("/admin/dashboard?location=attributes");
          }}
          className="sidebar-list-item"
        >
          <BsFillBoxFill className="icon" /> Product Attributes
        </li>
        <li
          onClick={() => {
            navigate("/dashboard?location=category");
          }}
          className="sidebar-list-item"
        >
          <BsFillGrid3X3GapFill className="icon" /> Categories
        </li>
        <li
          onClick={() => {
            navigate("/dashboard?location=customer");
          }}
          className="sidebar-list-item"
        >
          <BsPeopleFill className="icon" /> Customers
        </li>
        <li className="sidebar-list-item">
          <BsListCheck className="icon" /> Inventory
        </li>
        <li className="sidebar-list-item">
          <BsMenuButtonWideFill className="icon" /> Reports
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => {
            handleLogout();
          }}
        >
          <BsFillGearFill className="icon" /> Setting
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
