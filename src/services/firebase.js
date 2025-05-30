
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore'; // Importa lo que necesitas para interactuar con Firestore
import { getAuth, onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyADm65antV68U0h0xQIczX8zdZiv05MQR0",
  authDomain: "app-gastos-42230.firebaseapp.com",
  projectId: "app-gastos-42230",
  storageBucket: "app-gastos-42230.firebasestorage.app",
  messagingSenderId: "705430566366",
  appId: "1:705430566366:web:5a8106500d82adcf64d94f"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, onAuthStateChanged };
