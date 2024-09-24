// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "flashcard-saas-45d10.firebaseapp.com",
  projectId: "flashcard-saas-45d10",
  storageBucket: "flashcard-saas-45d10.appspot.com",
  messagingSenderId: "24773506597",
  appId: "1:24773506597:web:7ba5ffeade9df020e3b1cc",
  measurementId: "G-XJHVWES8VL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (typeof window !="undefined"){
  isSupported().then((supported)=>{
    if(supported){
      getAnalytics(app);
    }
  })
}

const db= getFirestore(app)

export default db;