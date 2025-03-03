// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADf1rJUd0Mm1rB1f-IAmY2Vb8nxkDuoCQ",
  authDomain: "shomi-d1016.firebaseapp.com",
  projectId: "shomi-d1016",
  storageBucket: "shomi-d1016.firebasestorage.app",
  messagingSenderId: "969586649898",
  appId: "1:969586649898:web:30e9cb02d6c0fd86d24c53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
export { auth };