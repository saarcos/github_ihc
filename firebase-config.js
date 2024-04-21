import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
export const firebaseConfig = {
  apiKey: "AIzaSyAeFcfuhgTNoCowkzM8Jhf_g40gAeydhI8",
  authDomain: "loginihc-4b205.firebaseapp.com",
  projectId: "loginihc-4b205",
  storageBucket: "loginihc-4b205.appspot.com",
  messagingSenderId: "1078496797619",
  appId: "1:1078496797619:web:5de6dee8e9714f308de1c6",
  measurementId: "G-RTNRE74YKJ"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);