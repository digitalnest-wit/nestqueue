// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgwKqyCYg81zw869kesly9UXf0N4SgGtA",
  authDomain: "nestqueue.firebaseapp.com",
  projectId: "nestqueue",
  storageBucket: "nestqueue.firebasestorage.app",
  messagingSenderId: "761302855310",
  appId: "1:761302855310:web:74e0e9a43c2e4c329163df",
  measurementId: "G-RY9LCPZNZ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
