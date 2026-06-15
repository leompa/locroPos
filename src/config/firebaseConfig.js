export function getFirebasePublicConfig() {
  return {
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || ''
  };
}

export function renderFirebaseEnvModule() {
  const config = JSON.stringify(getFirebasePublicConfig(), null, 2);

  return `export const firebaseConfig = Object.freeze(${config});\n`;
}
