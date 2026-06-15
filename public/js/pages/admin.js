import { COLLECTIONS } from '../config/collections.js';
import { bootstrapPage } from '../modules/page.js';

bootstrapPage('/admin', () => {
  console.info('Firestore collections prepared for future admin features:', COLLECTIONS);
});
