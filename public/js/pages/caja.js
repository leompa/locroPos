import { createCartStore } from '../modules/cartStore.js';
import { loadCatalog } from '../modules/catalog.js';
import { emitTickets } from '../modules/ticketApi.js';
import { bootstrapPage } from '../modules/page.js';

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

bootstrapPage('/caja', async ({ services }) => {
  const { categories, products } = await loadCatalog(services);
  const store = createCartStore(products);
  const grid = document.querySelector('[data-product-grid]');
  const cartItems = document.querySelector('[data-cart-items]');
  const total = document.querySelector('[data-order-total]');
  const emitButton = document.querySelector('[data-emit-tickets]');
  const eventInput = document.querySelector('[data-event-id]');
  const issuedTicketsCard = document.querySelector('[data-issued-tickets-card]');
  const issuedTickets = document.querySelector('[data-issued-tickets]');
  const pendingTickets = document.querySelector('[data-pending-tickets]');
  const confirmTotal = document.querySelector('[data-confirm-total]');
  const confirmEmitButton = document.querySelector('[data-confirm-emit-tickets]');
  const confirmModalElement = document.querySelector('#ticketConfirmModal');
  const confirmModal = new window.bootstrap.Modal(confirmModalElement);

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

  emitButton.addEventListener('click', () => {
    if (store.getItems().length === 0) {
      return;
    }

    renderPendingTickets();
    confirmModal.show();
  });

  confirmEmitButton.addEventListener('click', async () => {
    confirmEmitButton.disabled = true;
    confirmEmitButton.textContent = 'Grabando...';

    try {
      const result = await emitTickets({
        eventId: eventInput.value.trim(),
        items: store.getItems()
      });

      confirmModal.hide();
      renderIssuedTickets(result.tickets);
      store.clear();
      renderCart();
    } catch (error) {
      window.alert(error.message);
    } finally {
      confirmEmitButton.textContent = 'Confirmar y grabar';
      confirmEmitButton.disabled = false;
    }
  });

  function renderProducts() {
    grid.innerHTML = products.map((product) => {
      const category = categories.find((item) => item.id === product.categoryId);

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

  function renderPendingTickets() {
    const items = store.getItems();
    confirmTotal.textContent = currencyFormatter.format(store.getTotal());
    pendingTickets.innerHTML = items.map((item) => renderTicketPreview({
      numberLabel: 'Sin grabar',
      productName: item.name,
      description: item.description,
      quantity: item.quantity,
      totalPaid: item.totalPaid,
      qrPayload: 'Se genera al confirmar'
    })).join('');
  }

  function renderIssuedTickets(tickets) {
    issuedTicketsCard.classList.remove('d-none');
    issuedTickets.innerHTML = tickets.map((ticket) => renderTicketPreview({
      numberLabel: `#${ticket.ticketNumber}`,
      productName: ticket.productName,
      description: ticket.description,
      quantity: ticket.quantity,
      totalPaid: ticket.totalPaid,
      qrPayload: ticket.qrPayload
    })).join('');
  }

  function renderTicketPreview({ numberLabel, productName, description, quantity, totalPaid, qrPayload }) {
    return `
      <article class="col-md-6 col-xl-4">
        <div class="ticket-preview h-100">
          <div class="d-flex justify-content-between align-items-start">
            <strong class="fs-3">${numberLabel}</strong>
            <span class="badge text-bg-warning">No retirado</span>
          </div>
          <p class="mb-1 fw-bold">${productName}</p>
          <p class="mb-1">${description}</p>
          <p class="mb-1">Cantidad: ${quantity}</p>
          <p class="mb-0">Total: ${currencyFormatter.format(totalPaid)}</p>
          <small class="text-muted d-block mt-2">QR futuro: ${qrPayload}</small>
        </div>
      </article>
    `;
  }
});
