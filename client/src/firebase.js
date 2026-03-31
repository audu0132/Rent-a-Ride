// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rentrid-e29fd.firebaseapp.com",
  projectId: "rentrid-e29fd",
  storageBucket: "rentrid-e29fd.firebasestorage.app",
  messagingSenderId: "1068277218849",
  appId: "1:1068277218849:web:8966754aa388cea132ed60"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);