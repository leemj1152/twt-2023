import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDCqQCrPT7C6tecQ-GyDfzyvobc0r94qc",
  authDomain: "twt-2023.firebaseapp.com",
  projectId: "twt-2023",
  storageBucket: "twt-2023.appspot.com",
  messagingSenderId: "691993231973",
  appId: "1:691993231973:web:49c405d8abeff74509bc8c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
