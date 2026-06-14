import { initializeFirebase } from './firebase.js';
import { renderNavigation } from './navigation.js';

export async function bootstrapPage(activeRoute, onReady = () => {}) {
  renderNavigation(activeRoute);
  const services = await initializeFirebase();
  onReady(services);
}
