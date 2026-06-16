import { getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';
import { CATEGORIES, PRODUCTS } from '../config/products.js';

export async function loadCatalog(services) {
  if (!services?.collections) {
    return { categories: CATEGORIES, products: PRODUCTS, source: 'fallback' };
  }

  const [categories, products] = await Promise.all([
    loadCollection(services.collections.categories, CATEGORIES),
    loadCollection(services.collections.products, PRODUCTS)
  ]);

  return {
    categories,
    products,
    source: products === PRODUCTS ? 'fallback' : 'firestore'
  };
}

async function loadCollection(collectionRef, fallbackRows) {
  const snapshot = await getDocs(query(collectionRef, orderBy('sortOrder')));

  if (snapshot.empty) {
    return fallbackRows;
  }

  return snapshot.docs
    .map((documentSnapshot) => ({ id: documentSnapshot.id, ...documentSnapshot.data() }))
    .filter((row) => row.active !== false);
}
