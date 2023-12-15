// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDj22gF7bNArPZBwgpL4NszHYMk3HswmF4",
  authDomain: "chatapp-reactjs-d9214.firebaseapp.com",
  projectId: "chatapp-reactjs-d9214",
  storageBucket: "chatapp-reactjs-d9214.appspot.com",
  messagingSenderId: "456168029210",
  appId: "1:456168029210:web:d11312db95deae99fd25a3",
  measurementId: "G-G8XVQN3XNK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
