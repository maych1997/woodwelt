import { validateCompleteDetails } from "../validation/validation";
import { database } from "./connection";
import { ref as dbRef, set } from "firebase/database";

const completeUserDetails = (
  address,
  contact,
  setErrors,
  setLoad,
  navigate,
  user
) => {
  if (
    user != null &&
    validateCompleteDetails(address, contact, setErrors, setLoad)
  ) {
    const newRef = dbRef(database, "users/" + user?.uid);
    set(newRef, {
      uid: user?.uid,
      firstName: user.displayName.split(" ")[0],
      lastName: user.displayName.split(" ")[1],
      email: user.email,
      contact: "+" + contact,
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

export default completeUserDetails;
