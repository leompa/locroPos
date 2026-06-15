import { CATEGORIES, PRODUCTS } from '../config/products.js';
import { createCartStore } from '../modules/cartStore.js';
import { emitTickets } from '../modules/ticketApi.js';
import { bootstrapPage } from '../modules/page.js';

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

bootstrapPage('/caja', () => {
  const store = createCartStore(PRODUCTS);
  const grid = document.querySelector('[data-product-grid]');
  const cartItems = document.querySelector('[data-cart-items]');
  const total = document.querySelector('[data-order-total]');
  const emitButton = document.querySelector('[data-emit-tickets]');
  const eventInput = document.querySelector('[data-event-id]');
  const issuedTicketsCard = document.querySelector('[data-issued-tickets-card]');
  const issuedTickets = document.querySelector('[data-issued-tickets]');

  renderProducts();
  renderCart();

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-product-id]');

    if (!button) {
      return;
    }

    store.add(button.dataset.productId);
    renderCart();
  });

  cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-product-id]');

    if (!button) {
      return;
    }

    store.remove(button.dataset.removeProductId);
    renderCart();
  });

  emitButton.addEventListener('click', async () => {
    emitButton.disabled = true;
    emitButton.textContent = 'Emitiendo...';

    try {
      const result = await emitTickets({
        eventId: eventInput.value.trim(),
        items: store.getItems()
      });

      renderIssuedTickets(result.tickets);
      store.clear();
      renderCart();
    } catch (error) {
      window.alert(error.message);
    } finally {
      emitButton.textContent = 'Emitir tickets';
      emitButton.disabled = store.getItems().length === 0;
    }
  });

  function renderProducts() {
    grid.innerHTML = PRODUCTS.map((product) => {
      const category = CATEGORIES.find((item) => item.id === product.categoryId);

      return `
        <div class="col-6 col-lg-3">
          <button class="btn btn-warning w-100 product-button" type="button" data-product-id="${product.id}">
            <span class="d-block">${product.name}</span>
            <small class="d-block fw-normal">${category?.name || 'Sin categoría'}</small>
          </button>
        </div>
      `;
    }).join('');
  }

  function renderCart() {
    const items = store.getItems();

    emitButton.disabled = items.length === 0;
    total.textContent = currencyFormatter.format(store.getTotal());

    if (items.length === 0) {
      cartItems.innerHTML = '<tr><td colspan="4" class="text-muted">Todavía no hay productos seleccionados.</td></tr>';
      return;
    }

    cartItems.innerHTML = items.map((item) => `
      <tr>
        <td>${item.name}</td>
        <td class="text-end">${item.quantity}</td>
        <td class="text-end">${currencyFormatter.format(item.totalPaid)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" type="button" data-remove-product-id="${item.productId}">-</button>
        </td>
      </tr>
    `).join('');
  }

  function renderIssuedTickets(tickets) {
    issuedTicketsCard.classList.remove('d-none');
    issuedTickets.innerHTML = tickets.map((ticket) => `
      <article class="col-md-6 col-xl-4">
        <div class="ticket-preview h-100">
          <div class="d-flex justify-content-between align-items-start">
            <strong class="fs-3">#${ticket.ticketNumber}</strong>
            <span class="badge text-bg-warning">No retirado</span>
          </div>
          <p class="mb-1 fw-bold">${ticket.productName}</p>
          <p class="mb-1">${ticket.description}</p>
          <p class="mb-1">Cantidad: ${ticket.quantity}</p>
          <p class="mb-0">Total: ${currencyFormatter.format(ticket.totalPaid)}</p>
          <small class="text-muted d-block mt-2">QR futuro: ${ticket.qrPayload}</small>
        </div>
      </article>
    `).join('');
  }
});
