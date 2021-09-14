// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCxZt8Z9ktUIQ0ehg2Cfa8sV_D37VeJeQ",
  authDomain: "tisikijinweb.firebaseapp.com",
  projectId: "tisikijinweb",
  storageBucket: "tisikijinweb.appspot.com",
  messagingSenderId: "630058005638",
  appId: "1:630058005638:web:3690efe0a389dddd6a4d07",
  databassURL: "https://tisikijinweb-default-rtdb.firebaseio.com/",
  measurementId: "G-ZC3DWMM344"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
var db = firebase.database();
