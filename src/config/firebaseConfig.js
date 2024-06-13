// Importamos las funciones necesarias de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCAxxAGAZVmtp305WsuGG4WYbUEgZ5pkYA",
  authDomain: "webnovacurse.firebaseapp.com",
  projectId: "webnovacurse",
  storageBucket: "webnovacurse.appspot.com",
  messagingSenderId: "449593447165",
  appId: "1:449593447165:web:0d829f57004b64121ae494",
  measurementId: "G-Q3CY0224R3",
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Obtenemos los servicios que necesitamos
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore Database
const storage = getStorage(app); // Firebase Storage
const googleProvider = new GoogleAuthProvider(); // Proveedor de autenticación de Google

// Exportamos los servicios para usarlos en otras partes de la aplicación
export { auth, db, storage, googleProvider, app };
