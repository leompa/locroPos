import { ORDER_STATES, PRODUCTS } from '../config/products.js';
import { bootstrapPage } from '../modules/page.js';

bootstrapPage('/barra', () => {
  const barProducts = PRODUCTS.filter((product) => product.area === 'barra');
  const board = document.querySelector('[data-orders-board]');
  board.innerHTML = ORDER_STATES.map((state) => `
    <div class="col-md-6 col-xl-3">
      <div class="card h-100 shadow-sm order-card">
        <div class="card-body">
          <h2 class="h5 text-capitalize">${state}</h2>
          <p class="text-muted small mb-0">${barProducts.map((product) => product.name).join(', ')}</p>
        </div>
      </div>
    </div>
  `).join('');
});
