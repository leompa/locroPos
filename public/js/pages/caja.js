import { PRODUCTS } from '../config/products.js';
import { bootstrapPage } from '../modules/page.js';

bootstrapPage('/caja', () => {
  const grid = document.querySelector('[data-product-grid]');
  grid.innerHTML = PRODUCTS.map((product) => `
    <div class="col-6 col-lg-3">
      <button class="btn btn-warning w-100 product-button" type="button" data-product-id="${product.id}">
        ${product.name}
      </button>
    </div>
  `).join('');
});
