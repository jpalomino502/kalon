import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCAxxAGAZVmtp305WsuGG4WYbUEgZ5pkYA",
  authDomain: "webnovacurse.firebaseapp.com",
  projectId: "webnovacurse",
  storageBucket: "webnovacurse.appspot.com",
  messagingSenderId: "449593447165",
  appId: "1:449593447165:web:0d829f57004b64121ae494",
  measurementId: "G-Q3CY0224R3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, googleProvider, app };
