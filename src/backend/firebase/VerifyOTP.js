import { ref as dbRef, get } from "firebase/database";
import { database } from "./connection";

const verifyCode = async (setCodeSent, setShow, navigate, code, user) => {
  const userRef = dbRef(database, "users/" + user?.uid);

  // Check if the user data already exists
  const snapshot = await get(userRef);
  try {
    const data = await window.confirmationResult.confirm(code);
    console.log(data);
    if (snapshot.exists()) {
      setCodeSent(false);
      setShow(false);
      navigate("/admin/dashboard?location=dashboard");
    } else {
      if (data != undefined) {
        setCodeSent(false);
        setShow(false);
        navigate("/admin/personalDetails");
      }
    }
  } catch (error) {
    alert(error);
  }
};

export default verifyCode;
