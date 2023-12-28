// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPRZHQF_sIfe1IFuGWSVZR7lRqkXxqWno",
    authDomain: "chat-9f394.firebaseapp.com",
    projectId: "chat-9f394",
    storageBucket: "chat-9f394.appspot.com",
    messagingSenderId: "1037061071683",
    appId: "1:1037061071683:web:08acc912a5643e7af3c5f6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();