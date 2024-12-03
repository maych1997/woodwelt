import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { auth, database, storage } from "../../../backend/firebase/connection";
import { ref as dbRef, get, update } from "firebase/database";
import {
	ref as storageRef,
	uploadBytes,
	getDownloadURL,
} from "firebase/storage";
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Show from "../../../assets/icons/show.svg";
import Hide from "../../../assets/icons/hide.svg";
import "./editProfile.css";

const EditProfile = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [userData, setUserData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		contact: "",
		address: "",
		profilePicture: null,
	});

	// Password update states
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [cnfrmNewPass, setCnfrmNewPass] = useState("");
	const [passwordUpdateEnabled, setPasswordUpdateEnabled] = useState(false);

	const [image, setImage] = useState(null);
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showCnfrmNewPassword, setShowCnfrmNewPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});

	// Fetch user data on component mount
	useEffect(() => {
		const currentUser = auth.currentUser;
		if (currentUser) {
			setUser(currentUser);
			fetchUserData(currentUser.uid);
		} else {
			navigate("/admin/login");
		}
	}, []);

	// Fetch user data from Firebase Realtime Database
	const fetchUserData = async (uid) => {
		try {
			const userRef = dbRef(database, `users/${uid}`);
			const snapshot = await get(userRef);
			if (snapshot.exists()) {
				const data = snapshot.val();
				setUserData({
					firstName: data.firstName || "",
					lastName: data.lastName || "",
					email: data.email || "",
					contact: data.contact ? data.contact.replace("+", "") : "",
					address: data.address || "",
					profilePicture: data.profilePicture || null,
				});
			}
		} catch (error) {
			console.error("Error fetching user data:", error);
			alert("Failed to fetch user data");
		}
	};

	// Validation function
	const validateForm = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

		const newErrors = {};

		// Validate first name and last name
		if (!userData.firstName) newErrors.firstName = "First Name is required";
		if (!userData.lastName) newErrors.lastName = "Last Name is required";

		// Validate email
		if (!userData.email) {
			newErrors.email = "Email is required";
		} else if (!emailRegex.test(userData.email)) {
			newErrors.email = "Invalid email address";
		}

		// Validate contact and address
		if (!userData.contact) newErrors.contact = "Contact is required";
		if (!userData.address) newErrors.address = "Address is required";

		// Validate password update if enabled
		if (passwordUpdateEnabled) {
			// Old password validation
			if (!oldPassword) {
				newErrors.oldPassword =
					"Current password is required to update password";
			}

			// New password validation
			if (newPassword) {
				if (!passwordRegex.test(newPassword)) {
					newErrors.newPassword =
						"Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character";
				} else if (newPassword !== cnfrmNewPass) {
					newErrors.cnfrmNewPass = "New passwords do not match";
				}
			} else {
				newErrors.newPassword = "New password is required";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle image upload
	const handleImageUpload = async () => {
		if (image && user) {
			try {
				const imageRef = storageRef(
					storage,
					`profilepicture/${user.uid}_${image.name}`
				);
				const snapshot = await uploadBytes(imageRef, image);
				const downloadURL = await getDownloadURL(imageRef);
				return downloadURL;
			} catch (error) {
				console.error("Image upload error:", error);
				alert("Failed to upload profile picture");
				return null;
			}
		}
		return userData.profilePicture;
	};

	// Update profile handler
	const handleUpdateProfile = async () => {
		if (validateForm()) {
			setLoading(true);
			try {
				// Upload image if new image is selected
				const profilePictureUrl = await handleImageUpload();

				// Prepare update data
				const updateData = {
					firstName: userData.firstName,
					lastName: userData.lastName,
					email: userData.email,
					contact: "+" + userData.contact,
					address: userData.address,
					profilePicture: profilePictureUrl,
				};

				// Update user data in database
				const userRef = dbRef(database, `users/${user.uid}`);
				await update(userRef, updateData);

				// Handle password update if enabled
				if (passwordUpdateEnabled && newPassword) {
					// Re-authenticate user
					const credential = EmailAuthProvider.credential(
						user.email,
						oldPassword
					);
					await reauthenticateWithCredential(user, credential);

					// Update password
					await updatePassword(user, newPassword);
				}

				alert("Profile updated successfully!");
				navigate("/admin/dashboard?location=dashboard");
			} catch (error) {
				console.error("Update error:", error);
				alert("Failed to update profile: " + error.message);
			} finally {
				setLoading(false);
			}
		}
	};

	// Input change handlers
	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setUserData((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	return (
		<div className="container">
			<div className="subContainer1">
				<div className="headingContainer">
					<h3>Update Profile</h3>
				</div>
				<div className="form-container">
					{/* First Name */}
					<TextField
						id="firstName"
						className="text-input"
						label="First Name"
						variant="outlined"
						size="small"
						value={userData.firstName}
						onChange={handleInputChange}
						error={!!errors.firstName}
						helperText={errors.firstName}
					/>

					{/* Last Name */}
					<TextField
						id="lastName"
						className="text-input"
						label="Last Name"
						variant="outlined"
						size="small"
						value={userData.lastName}
						onChange={handleInputChange}
						error={!!errors.lastName}
						helperText={errors.lastName}
					/>

					{/* Contact */}
					<div>
						<PhoneInput
							containerClass="phoneInput"
							specialLabel="Contact"
							value={userData.contact}
							onChange={(contact) =>
								setUserData((prev) => ({ ...prev, contact }))
							}
							inputStyle={{ width: "100%" }}
						/>
						{errors.contact && <p className="error">{errors.contact}</p>}
					</div>

					{/* Address */}
					<TextField
						id="address"
						className="text-input"
						label="Address"
						variant="outlined"
						size="small"
						value={userData.address}
						onChange={handleInputChange}
						error={!!errors.address}
						helperText={errors.address}
					/>

					{/* Email */}
					<TextField
						id="email"
						className="text-input"
						label="Email"
						variant="outlined"
						size="small"
						type="email"
						value={userData.email}
						onChange={handleInputChange}
						error={!!errors.email}
						helperText={errors.email}
					/>

					{/* Password Update Toggle */}
					<div className="password-toggle-container">
						<Button
							variant="outlined"
							onClick={() => setPasswordUpdateEnabled(!passwordUpdateEnabled)}
						>
							{passwordUpdateEnabled
								? "Disable Password Update"
								: "Update Password"}
						</Button>
					</div>

					{/* Password Update Section */}
					{passwordUpdateEnabled && (
						<>
							{/* Old Password */}
							<div className="password-container">
								<TextField
									id="oldPassword"
									className="text-input"
									type={showOldPassword ? "text" : "password"}
									label="Current Password"
									variant="outlined"
									size="small"
									value={oldPassword}
									onChange={(e) => setOldPassword(e.target.value)}
									error={!!errors.oldPassword}
									helperText={errors.oldPassword}
								/>
								<img
									onClick={() => setShowOldPassword(!showOldPassword)}
									className="eye-icon"
									src={showOldPassword ? Hide : Show}
									alt="Toggle old password visibility"
								/>
							</div>

							{/* New Password */}
							<div className="password-container">
								<TextField
									id="newPassword"
									className="text-input"
									type={showNewPassword ? "text" : "password"}
									label="New Password"
									variant="outlined"
									size="small"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									error={!!errors.newPassword}
									helperText={errors.newPassword}
								/>
								<img
									onClick={() => setShowNewPassword(!showNewPassword)}
									className="eye-icon"
									src={showNewPassword ? Hide : Show}
									alt="Toggle new password visibility"
								/>
							</div>

							{/* Confirm New Password */}
							<div className="password-container">
								<TextField
									id="cnfrmNewPass"
									className="text-input"
									type={showCnfrmNewPassword ? "text" : "password"}
									label="Confirm New Password"
									variant="outlined"
									size="small"
									value={cnfrmNewPass}
									onChange={(e) => setCnfrmNewPass(e.target.value)}
									error={!!errors.cnfrmNewPass}
									helperText={errors.cnfrmNewPass}
								/>
								<img
									onClick={() => setShowCnfrmNewPassword(!showCnfrmNewPassword)}
									className="eye-icon"
									src={showCnfrmNewPassword ? Hide : Show}
									alt="Toggle confirm password visibility"
								/>
							</div>
						</>
					)}

					{/* Profile Picture Preview */}
					{userData.profilePicture && (
						<div className="profile-preview">
							<img
								src={userData.profilePicture}
								alt="Current Profile"
								style={{ maxWidth: "100px", borderRadius: "50%" }}
							/>
						</div>
					)}

					{/* Profile Picture Upload */}
					<Button variant="contained" component="label">
						Update Profile Picture
						<input
							type="file"
							hidden
							onChange={(event) => {
								setImage(event.target.files[0]);
							}}
						/>
					</Button>

					{image && (
						<p className="fileName">
							<b>Selected:</b> {image.name}
						</p>
					)}

					{/* Update Button */}
					<div className="button-container">
						<Button
							disabled={loading}
							onClick={handleUpdateProfile}
							className="login-button"
							variant="contained"
						>
							{loading ? <CircularProgress size={25} /> : "Update Profile"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditProfile;
