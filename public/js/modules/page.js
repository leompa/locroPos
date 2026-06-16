import { initializeFirebaseApp } from './firebase.js';
import { renderNavigation } from './navigation.js';

export async function bootstrapPage(activeRoute, onReady = () => {}) {
  renderNavigation(activeRoute);

  try {
    const services = await initializeFirebaseApp();
    await onReady({ services, firebaseReady: true });
  } catch (error) {
    console.warn(error.message);
    renderFirebaseWarning(error.message);
    await onReady({ services: null, firebaseReady: false, error });
  }
}

function renderFirebaseWarning(message) {
  const main = document.querySelector('main');

  if (!main) {
    return;
  }

  const alert = document.createElement('div');
  alert.className = 'alert alert-warning';
  alert.setAttribute('role', 'alert');
  alert.textContent = message;
  main.prepend(alert);
}
