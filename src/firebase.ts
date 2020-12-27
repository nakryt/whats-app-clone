import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBmku4nvzoc2ADmUIQLHi0a6EK2E2kIb0I",
  authDomain: "whats-app-clone-7599c.firebaseapp.com",
  projectId: "whats-app-clone-7599c",
  storageBucket: "whats-app-clone-7599c.appspot.com",
  messagingSenderId: "607585291379",
  appId: "1:607585291379:web:7c33ebcb0b0c6f4948ee06",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
