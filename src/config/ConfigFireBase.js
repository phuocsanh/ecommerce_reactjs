import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpkOW6sGikQPzTDLUJwmiGM7m7T0fIvsM",
  authDomain: "tranquil-app-340815.firebaseapp.com",
  projectId: "tranquil-app-340815",
  storageBucket: "tranquil-app-340815.appspot.com",
  messagingSenderId: "763979821762",
  appId: "1:763979821762:web:4513ed05ec36b33f5b815b",
  measurementId: "G-P2E2VPFQWQ",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export { auth, fs, storage };
