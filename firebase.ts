import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6i-wOzxIejB2cZYmXSqXsym9hNrRtnA",
  authDomain: "form-tahfidz.firebaseapp.com",
  projectId: "form-tahfidz",
  storageBucket: "form-tahfidz.firebasestorage.app",
  messagingSenderId: "1004886101925",
  appId: "1:1004886101925:web:c018647bc414c6d960a24c",
  measurementId: "G-1Z5VGJW82E"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);