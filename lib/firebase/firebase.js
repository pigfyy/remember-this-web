import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDdMRpfCrhuPo5weD4SoXB-vXMSCsTzqg",
  authDomain: "pigfy-remember-this.firebaseapp.com",
  projectId: "pigfy-remember-this",
  storageBucket: "pigfy-remember-this.appspot.com",
  messagingSenderId: "959885414600",
  appId: "1:959885414600:web:dc66a88090fec71af295fd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, auth, storage, db };
