import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2G2EgSIFbvGi29YNs2-5bci9nSE0vhas",
  authDomain: "fir-billmagic.firebaseapp.com",
  projectId: "fir-billmagic",
  storageBucket: "fir-billmagic.appspot.com",
  messagingSenderId: "268743317748",
  appId: "1:268743317748:web:f0f120cde40d47de8da6a1",
};

// Initialize Firebase
let myApp = initializeApp(firebaseConfig);

const auth = getAuth(myApp);
const firestore = getFirestore(myApp);

export { auth, firestore };
