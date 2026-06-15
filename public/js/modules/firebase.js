import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { collection, getFirestore } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';
import { COLLECTIONS } from '../config/collections.js';
import { firebaseConfig } from '../config/firebaseConfig.js';

const placeholderValues = new Set([
  '',
  'your-api-key',
  'your-project.firebaseapp.com',
  'your-project-id',
  'your-project.appspot.com',
  'your-sender-id',
  'your-app-id'
]);

let firebaseServices;
let anonymousSessionPromise;

export function hasFirebaseConfig() {
  return Object.values(firebaseConfig).every((value) => !placeholderValues.has(value));
}

export function assertFirebaseConfig() {
  if (!hasFirebaseConfig()) {
    throw new Error('Firebase no está configurado. Complete public/js/config/env.js para GitHub Pages o .env para desarrollo local.');
  }
}

export function initializeFirebase() {
  if (firebaseServices) {
    return firebaseServices;
  }

  assertFirebaseConfig();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const collections = {
    products: collection(db, COLLECTIONS.products),
    orders: collection(db, COLLECTIONS.orders),
    orderItems: collection(db, COLLECTIONS.orderItems),
    configuration: collection(db, COLLECTIONS.configuration)
  };

  firebaseServices = { app, auth, db, collections };
  return firebaseServices;
}

export async function ensureAnonymousSession() {
  if (anonymousSessionPromise) {
    return anonymousSessionPromise;
  }

  const { auth } = initializeFirebase();

  anonymousSessionPromise = new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();

      if (user) {
        resolve(user);
        return;
      }

      try {
        const credential = await signInAnonymously(auth);
        resolve(credential.user);
      } catch (error) {
        anonymousSessionPromise = undefined;
        reject(error);
      }
    }, reject);
  });

  return anonymousSessionPromise;
}

export async function initializeFirebaseApp() {
  const services = initializeFirebase();
  const user = await ensureAnonymousSession();
  return { ...services, user };
}
