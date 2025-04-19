// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDO9CzeNqKIz41jzdH5baUkLyd2N5rqgWg",
  authDomain: "indeguru-dad12.firebaseapp.com",
  projectId: "indeguru-dad12",
  storageBucket: "indeguru-dad12.firebasestorage.app",
  messagingSenderId: "155298066952",
  appId: "1:155298066952:web:8de2618e256494970697bd",
  measurementId: "G-X66NBPEKPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { auth };