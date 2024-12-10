import React, { useState, useRef, useEffect } from "react";
import "./dashboard.css"; // Ensure styles for the menu are in this file
import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { auth } from "../../backend/firebase/connection";
import { signOut } from "firebase/auth";

function UserMenu() {
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);
	const navigate = useNavigate();

	// Close the menu if clicked outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

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
	
	const editProfiile=()=>{
		setMenuOpen((prevState) => !prevState)
		navigate("/admin/dashboard?location=editProfile");
		
	}

	return (
		<div className="user-menu-container" ref={menuRef}>
			<div
				className="user-icon"
				onClick={() => setMenuOpen((prevState) => !prevState)}
			>
				<BsPersonCircle className="icon" />
			</div>
			{menuOpen && (
				<div className="user-menu">
					<div className="menu-item" onClick={() => {editProfiile()}}>
						Edit Profile
					</div>
					<div
						className="menu-item"
						onClick={() => {
							handleLogout();
						}}
					>
						Logout
					</div>
				</div>
			)}
		</div>
	);
}

export default UserMenu;
