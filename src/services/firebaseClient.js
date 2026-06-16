import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFirebasePublicConfig } from '../config/firebaseConfig.js';

let servicesPromise;

export async function getFirebaseServices() {
  if (servicesPromise) {
    return servicesPromise;
  }

  servicesPromise = initializeFirebaseServices();
  return servicesPromise;
}

async function initializeFirebaseServices() {
  const app = initializeApp(getFirebasePublicConfig());
  const auth = getAuth(app);
  const credential = await signInAnonymously(auth);
  const db = getFirestore(app);

  return { app, auth, db, user: credential.user };
}
