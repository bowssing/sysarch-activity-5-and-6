// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJuXp_WPJCiha6qp4Lsc8tDx9J0geCEsc",
  authDomain: "sysarch-firebase-act.firebaseapp.com",
  projectId: "sysarch-firebase-act",
  storageBucket: "sysarch-firebase-act.appspot.com",
  messagingSenderId: "143642907268",
  appId: "1:143642907268:web:cd6ba2174c852b8415a8d1",
  measurementId: "G-CCLNSKDBTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

export const storage = getStorage(app);