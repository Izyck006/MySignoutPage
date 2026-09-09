import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDvOJedjdccwHS5lq3I8UuDzeCsnv-vB4E",
  authDomain: "mysignout-ee7e8.firebaseapp.com",
  projectId: "mysignout-ee7e8",
  storageBucket: "mysignout-ee7e8.firebasestorage.app",
  messagingSenderId: "1028066705972",
  appId: "1:1028066705972:web:49b52472ca4e7d06228061",
  measurementId: "G-DDYTY43DB6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Enforce SESSION persistence (User is logged out securely when the browser tab is closed)
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Failed to set auth persistence:", error);
});

const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code == 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, auth, db, storage, functions };
