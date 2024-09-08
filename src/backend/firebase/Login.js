import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, database, provider } from "./connection";
import { ref as dbRef, get, set } from "firebase/database";
import { validateLoginForm } from "../validation/validation";

const LoginAPI = async (email, password, setErrors, setLoad, navigate) => {
  if (validateLoginForm(email, password, setErrors, setLoad)) {
    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          if (result) {
            setLoad(false);
            navigate("/admin/dashboard?location=dashboard");
          }
        })
        .catch((error) => {
          setLoad(false);
          alert(error);
        });

      // Redirect or show success message
    } catch (error) {
      alert(error.message);
    }
  }
};

const signInWithGoogle = async (
  contact,
  address,
  setNewUser,
  setLoad,
  navigate
) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log(user);

    // Reference to the user's data in the database
    const userRef = dbRef(database, "users/" + user?.uid);

    // Check if the user data already exists
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      // User exists
      if (user != null) {
        console.log("User is returning.");
        setNewUser(false); // or setNewUser(false) to indicate existing user
        navigate("/admin/dashboard?location=dashboard");
      }
    } else {
      // User is new, set data
      await set(userRef, {
        uid: user?.uid,
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1],
        email: user.email,
        contact: "+" + contact,
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

export { LoginAPI, signInWithGoogle };
