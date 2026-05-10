// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDv8XIJtEte6G9G0wnZf69lPhdpY2MWda4",
  authDomain: "tiviala-4051e.firebaseapp.com",
  projectId: "tiviala-4051e",
  storageBucket: "tiviala-4051e.firebasestorage.app",
  messagingSenderId: "1083500977032",
  appId: "1:1083500977032:web:1f6711e54d7a8752e0383d",
  measurementId: "G-FLZV10RPEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 
 
export const auth = getAuth(app);
export const db   = getFirestore(app);