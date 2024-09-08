import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./connection";
import { validationForOTP } from "../validation/validation";

const SendOTPCode = async (contactOTP, code, setErrors, setCodeSent) => {
  if (validationForOTP(contactOTP, code, setErrors)) {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible", // or 'normal'
          callback: (response) => {
            // Success callback
            console.log("Recaptcha verified");
          },
          "expired-callback": () => {
            // Expired callback
            console.log("Recaptcha expired");
          },
        }
      );
      signInWithPhoneNumber(auth, `+${contactOTP}`, recaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
        })
        .catch((error) => {
          alert(error);
        });
    } catch (error) {
      alert(error);
    }
    // const confirmation = signInWithPhoneNumber(auth, contactOTP, recaptcha);
    // console.log(confirmation);
    setCodeSent(true);
  }
};

export default SendOTPCode;
