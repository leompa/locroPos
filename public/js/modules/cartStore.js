export function createCartStore(products) {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const quantities = new Map();

  function add(productId) {
    quantities.set(productId, getQuantity(productId) + 1);
  }

  function remove(productId) {
    const nextQuantity = Math.max(0, getQuantity(productId) - 1);

    if (nextQuantity === 0) {
      quantities.delete(productId);
      return;
    }

    quantities.set(productId, nextQuantity);
  }

  function clear() {
    quantities.clear();
  }

  function getQuantity(productId) {
    return quantities.get(productId) || 0;
  }

  function getItems() {
    return Array.from(quantities.entries())
      .map(([productId, quantity]) => {
        const product = productsById.get(productId);
        return {
          productId,
          description: product?.description || product?.name || productId,
          name: product?.name || productId,
          categoryId: product?.categoryId || null,
          unitPrice: product?.price || 0,
          quantity,
          totalPaid: (product?.price || 0) * quantity
        };
      })
      .filter((item) => item.quantity > 0);
  }

  function getTotal() {
    return getItems().reduce((total, item) => total + item.totalPaid, 0);
  }

  return { add, clear, getItems, getQuantity, getTotal, remove };
}
