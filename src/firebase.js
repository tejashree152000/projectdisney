import {initializeApp} from 'firebase/app';
import{ getFirestore } from 'firebase/firestore';
import{ getAuth,GoogleAuthProvider} from 'firebase/auth';
import{ getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyCAKE8prqnLb4GRLCWQjLPvB0IsxYXwJQQ",
    authDomain: "disney-clone-14a91.firebaseapp.com",
    projectId: "disney-clone-14a91",
    storageBucket: "disney-clone-14a91.appspot.com",
    messagingSenderId: "570224995588",
    appId: "1:570224995588:web:05c88b8ead8d767543f451",
    measurementId: "G-6F8D4C3WSF"
  };

  const app = initializeApp(firebaseConfig);
  //const db = getFirestore();
  const db = getFirestore(app);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const storage = getStorage(app);

  export { auth, provider, storage, db };
  export default db;
