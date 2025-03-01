// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA65CYPr13g3CGOohMurpMjRw_E1pnLJkE",
  authDomain: "olympus-garden-876c1.firebaseapp.com",
  projectId: "olympus-garden-876c1",
  storageBucket: "olympus-garden-876c1.appspot.com", // Corregido el storageBucket
  messagingSenderId: "482178063118",
  appId: "1:482178063118:web:e27a167d1d80286a7a155f",
  measurementId: "G-DSSCYZ5443"
};

// Inicialización modular
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const storage = getStorage(app);

export { db };