import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC0yAJnC95Zu7sIIMz0uSp3dDMT4fbjbLk",
    authDomain: "firetag-89547.firebaseapp.com",
    projectId: "firetag-89547",
    storageBucket: "firetag-89547.appspot.com",
    messagingSenderId: "189206675295",
    appId: "1:189206675295:web:be355cfed6de96883a80ea",
    measurementId: "G-JHPHY1BVJF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app