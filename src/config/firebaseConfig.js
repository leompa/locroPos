const defaultFirebaseConfig = Object.freeze({
  apiKey: 'AIzaSyAsqv_bQHXm07yCiFALvEfiIVLOrbBZEOQ',
  authDomain: 'locropost.firebaseapp.com',
  projectId: 'locropost',
  storageBucket: 'locropost.firebasestorage.app',
  messagingSenderId: '309307617731',
  appId: '1:309307617731:web:350c4339c6677ee6494d76',
  measurementId: 'G-08GSR7G5CW'
});

export function getFirebasePublicConfig() {
  return {
    apiKey: process.env.FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
    projectId: process.env.FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
    appId: process.env.FIREBASE_APP_ID || defaultFirebaseConfig.appId,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || defaultFirebaseConfig.measurementId
  };
}

export function renderFirebaseEnvModule() {
  const config = JSON.stringify(getFirebasePublicConfig(), null, 2);

  return `export const firebaseConfig = Object.freeze(${config});\n`;
}
