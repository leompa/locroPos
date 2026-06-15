export const PRODUCTS = Object.freeze([
  { id: 'locro', name: 'Locro', area: 'cocina' },
  { id: 'empanadas', name: 'Empanadas', area: 'cocina' },
  { id: 'panchos', name: 'Panchos', area: 'cocina' },
  { id: 'jarra-fernet', name: 'Jarra Fernet', area: 'barra' },
  { id: 'vino', name: 'Vino', area: 'barra' },
  { id: 'cerveza', name: 'Cerveza', area: 'barra' },
  { id: 'gaseosa', name: 'Gaseosa', area: 'barra' },
  { id: 'tragos', name: 'Tragos', area: 'barra' }
]);

export const ORDER_STATES = Object.freeze([
  'pendiente',
  'preparando',
  'listo',
  'entregado'
]);
