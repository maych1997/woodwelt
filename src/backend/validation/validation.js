const validateLoginForm = (email, password, setErrors, setLoad) => {
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
  setLoad(false);
  return !newErrors.email && !newErrors.password;
};

const validateCompleteDetails = (address, contact, setErrors, setLoad) => {
  const newErrors = {
    contact: contact ? "" : "Contact is Required",
    address: address ? "" : "Address is Required",
  };
  setErrors(newErrors);
  setLoad(false);
  return !newErrors.contact && !newErrors.address;
};

const validationForOTP = (contactOTP, code, setErrors) => {
  const newErrors = {
    contactOTP: contactOTP ? "" : "Contact is Required",
    code: code ? "" : "OTP is Required.",
  };

  setErrors(newErrors);

  return !newErrors?.contactOTP && !newErrors?.code;
};
export { validateLoginForm, validateCompleteDetails, validationForOTP };
