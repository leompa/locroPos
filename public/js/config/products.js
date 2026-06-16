export const CATEGORIES = Object.freeze([
  { id: 'comida', name: 'Comida' },
  { id: 'bebida', name: 'Bebida' },
  { id: 'trago', name: 'Trago' }
]);

export const PRODUCTS = Object.freeze([
  { id: 'locro', name: 'Locro', description: 'Porción de locro', categoryId: 'comida', area: 'cocina', price: 0 },
  { id: 'empanadas', name: 'Empanadas', description: 'Unidad de empanada', categoryId: 'comida', area: 'cocina', price: 0 },
  { id: 'panchos', name: 'Panchos', description: 'Pancho completo', categoryId: 'comida', area: 'cocina', price: 0 },
  { id: 'jarra-fernet', name: 'Jarra Fernet', description: 'Jarra de Fernet', categoryId: 'trago', area: 'barra', price: 0 },
  { id: 'vino', name: 'Vino', description: 'Vaso o botella de vino', categoryId: 'bebida', area: 'barra', price: 0 },
  { id: 'cerveza', name: 'Cerveza', description: 'Cerveza', categoryId: 'bebida', area: 'barra', price: 0 },
  { id: 'gaseosa', name: 'Gaseosa', description: 'Gaseosa', categoryId: 'bebida', area: 'barra', price: 0 },
  { id: 'tragos', name: 'Tragos', description: 'Trago preparado', categoryId: 'trago', area: 'barra', price: 0 }
]);

export const ORDER_STATES = Object.freeze([
  'pendiente',
  'preparando',
  'listo',
  'entregado'
]);
