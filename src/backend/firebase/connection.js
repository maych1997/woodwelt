// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCU4mTtcinbYRMQ7PNOPruprPxLB_u8c8o",
  authDomain: "woodwelt-6d1f2.firebaseapp.com",
  projectId: "woodwelt-6d1f2",
  storageBucket: "woodwelt-6d1f2.appspot.com",
  messagingSenderId: "835595537240",
  appId: "1:835595537240:web:540ae91e1f6b6dbacaf32d",
  measurementId: "G-V87ZYS2LLC",
  databaseURL: "https://woodwelt-6d1f2-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database=getDatabase(app);
export const storage = getStorage(app);