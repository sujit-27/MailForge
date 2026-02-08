// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMtkVj_6rGwR9aa3o7xTBR4wJ3MyRVFfc",
  authDomain: "mailforge-254fa.firebaseapp.com",
  projectId: "mailforge-254fa",
  storageBucket: "mailforge-254fa.firebasestorage.app",
  messagingSenderId: "178157581999",
  appId: "1:178157581999:web:2d238f9297b4ad24f9865a",
  measurementId: "G-WZ2PRMDRD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, app };