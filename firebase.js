import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDa5Yz6hfdrgbiwAsZYMX52zRWSYk91dCY",
  authDomain: "pantry-tracker-d579c.firebaseapp.com",
  projectId: "pantry-tracker-d579c",
  storageBucket: "pantry-tracker-d579c.appspot.com",
  messagingSenderId: "992869643164",
  appId: "1:992869643164:web:8f8e0dd3140652e9f64e59",
  measurementId: "G-GRQ5RS2211",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
