import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDdbAEP2U_OQCAChq9ZYQ9utYTsvFOUK80",
  authDomain: "instapostcloud.firebaseapp.com",
  projectId: "instapostcloud",
  storageBucket: "instapostcloud.appspot.com",
  messagingSenderId: "369241477050",
  appId: "1:369241477050:web:4e68b9ee9dadef802e9783",
  measurementId: "G-KFVRF0DHCS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
