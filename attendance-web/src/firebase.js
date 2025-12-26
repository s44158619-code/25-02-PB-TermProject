import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ★ 여기가 핵심!
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAvKX7tnTrS83Xg7CkMz2iOVkMaVVAyA38",
    authDomain: "term-project-yoonoh.firebaseapp.com",
    projectId: "term-project-yoonoh",
    storageBucket: "term-project-yoonoh.firebasestorage.app",
    messagingSenderId: "74172008880",
    appId: "1:74172008880:web:fd1a0c15d212885b9b2e75",
    measurementId: "G-NPVDY8GWLP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();