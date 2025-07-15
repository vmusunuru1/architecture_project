import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCApwcw4uGgGlGmuD3TBhKl-enMHRGdviI",
  authDomain: "mermcloud.firebaseapp.com",
  projectId: "mermcloud",
  storageBucket: "mermcloud.firebasestorage.app",
  messagingSenderId: "421271936671",
  appId: "1:421271936671:web:d6c1eaf05f858d7162ccaa",
  measurementId: "G-6BF3MFQ1EB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
