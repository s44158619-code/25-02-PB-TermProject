import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAvKX7tnTrS83Xg7CkMz2iOVkMaVVAyA38",
    authDomain: "term-project-yoonoh.firebaseapp.com",
    projectId: "term-project-yoonoh",
    storageBucket: "term-project-yoonoh.firebasestorage.app",
    messagingSenderId: "74172008880",
    appId: "1:74172008880:web:fd1a0c15d212885b9b2e75",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);