import { bootstrapPage } from '../modules/page.js';

bootstrapPage('/pantalla', () => {
  const readyOrders = document.querySelector('[data-ready-orders]');
  readyOrders.innerHTML = '<div class="col-auto"><div class="public-order-number text-success">---</div></div>';
});
