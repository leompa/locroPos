import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';
import { firebaseConfig } from '../config/firebaseConfig.js';

let firebaseServices;

export async function initializeFirebase() {
  if (firebaseServices) {
    return firebaseServices;
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  await signInAnonymously(auth);

  firebaseServices = { app, auth, db };
  return firebaseServices;
}
