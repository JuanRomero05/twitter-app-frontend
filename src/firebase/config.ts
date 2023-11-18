// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoojfUz0lj4NbetA0PTDDA9ScqzZYTntY",
  authDomain: "mobile-apps-d0b43.firebaseapp.com",
  projectId: "mobile-apps-d0b43",
  storageBucket: "mobile-apps-d0b43.appspot.com",
  messagingSenderId: "668669699901",
  appId: "1:668669699901:web:b59cc3e17de71a080b8754"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)