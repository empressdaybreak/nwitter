import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDw4MvSr31mDTtN-vL1RJMvA2CLFZShLBs",
    authDomain: "nwitter-e2846.firebaseapp.com",
    projectId: "nwitter-e2846",
    storageBucket: "nwitter-e2846.appspot.com",
    messagingSenderId: "1022797235316",
    appId: "1:1022797235316:web:dec5003b4fb075828f3d21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authService = getAuth();
export const dbService = getFirestore(app);
export const storageService = getStorage(app);
