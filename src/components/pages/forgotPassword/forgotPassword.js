import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
} from "@mui/material";
import {
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  updatePassword,
} from "firebase/auth";
import { auth } from "../../../backend/firebase/connection";

const ForgotPassword = () => {
  const [screen, setScreen] = useState("email");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  // Validation Functions
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email address";
    return "";
  };

  const validateContactNumber = () => {
    if (!contactNumber) return "Contact number is required";
    if (!/^\d{11}$/.test(contactNumber))
      return "Invalid contact number (11 digits required)";
    return "";
  };

  const validatePasswords = () => {
    if (!newPassword || !confirmPassword) return "Both fields are required";
    if (newPassword !== confirmPassword) return "Passwords do not match";
    if (newPassword.length < 6)
      return "Password must be at least 6 characters long";
    return "";
  };

  const handlePasswordResetEmail = async () => {
    const emailError = validateEmail();
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setScreen("success");
    } catch (error) {
      setErrors({ email: "Failed to send reset email. Try again later." });
    }
  };

  const handleSendCode = async () => {
    const contactError = validateContactNumber();
    if (contactError) {
      setErrors({ contactNumber: contactError });
      return;
    }

    try {
      // Replace with Firebase phone verification logic
      setScreen("verifyCode");
    } catch (error) {
      setErrors({ contactNumber: "Failed to send verification code." });
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode === "123456") {
      setScreen("resetPassword");
    } else {
      setErrors({ verificationCode: "Invalid verification code" });
    }
  };

  const handleResetPassword = async () => {
    const passwordError = validatePasswords();
    if (passwordError) {
      setErrors({ newPassword: passwordError });
      return;
    }

    try {
      // Replace with Firebase password update logic
      await updatePassword(auth.currentUser, newPassword);
      setScreen("success");
    } catch (error) {
      setErrors({ newPassword: "Failed to reset password." });
    }
  };

  const renderEmailScreen = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4">Reset Password via Email</Typography>
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors({});
        }}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
      />
      <Button variant="contained" onClick={handlePasswordResetEmail} fullWidth>
        Send Reset Link
      </Button>
      <Button onClick={() => setScreen("contactNumber")} fullWidth>
        Use Contact Number
      </Button>
    </Box>
  );

  const renderContactNumberScreen = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4">Reset via Contact Number</Typography>
      <TextField
        label="Contact Number"
        variant="outlined"
        value={contactNumber}
        onChange={(e) => {
          setContactNumber(e.target.value);
          setErrors({});
        }}
        error={!!errors.contactNumber}
        helperText={errors.contactNumber}
        fullWidth
      />
      <Button variant="contained" onClick={handleSendCode} fullWidth>
        Send Verification Code
      </Button>
      <Button onClick={() => setScreen("email")} fullWidth>
        Use Email
      </Button>
    </Box>
  );

  const renderVerifyCodeScreen = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4">Enter Verification Code</Typography>
      <TextField
        label="Verification Code"
        variant="outlined"
        value={verificationCode}
        onChange={(e) => {
          setVerificationCode(e.target.value);
          setErrors({});
        }}
        error={!!errors.verificationCode}
        helperText={errors.verificationCode}
        fullWidth
      />
      <Button variant="contained" onClick={handleVerifyCode} fullWidth>
        Verify Code
      </Button>
    </Box>
  );

  const renderResetPasswordScreen = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4">Reset Password</Typography>
      <TextField
        label="New Password"
        type="password"
        variant="outlined"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          setErrors({});
        }}
        error={!!errors.newPassword}
        fullWidth
      />
      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setErrors({});
        }}
        error={!!errors.newPassword}
        helperText={errors.newPassword}
        fullWidth
      />
      <Button variant="contained" onClick={handleResetPassword} fullWidth>
        Reset Password
      </Button>
    </Box>
  );

  const renderSuccessScreen = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4">Success</Typography>
      <Typography>
        Your password has been reset. You can now log in with your new
        credentials.
      </Typography>
      <Button onClick={() => setScreen("email")} fullWidth>
        Back to Login
      </Button>
    </Box>
  );

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Paper sx={{ padding: 4, width: "100%" }} elevation={3}>
        {screen === "email" && renderEmailScreen()}
        {screen === "contactNumber" && renderContactNumberScreen()}
        {screen === "verifyCode" && renderVerifyCodeScreen()}
        {screen === "resetPassword" && renderResetPasswordScreen()}
        {screen === "success" && renderSuccessScreen()}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
