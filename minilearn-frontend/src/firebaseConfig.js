// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzZoIslY7RgAkINivXmFL_gyr_oNWICVU",
  authDomain: "minilearn-e1004.firebaseapp.com",
  projectId: "minilearn-e1004",
  storageBucket: "minilearn-e1004.appspot.com",
  messagingSenderId: "185397413630",
  appId: "1:185397413630:web:d1150e0ae795a0dabfc7af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Ensure getAuth is called with the initialized app

export { auth }; // Export 'auth'
