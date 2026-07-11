export const ITEM_MOCK = {
  id: 'item-001',
  nombre: 'Producto A',
  descripcion: 'Descripción del producto',
  precio: 99.9,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

export const DATA: Record<string, unknown> = {
  ITEMS_LIST: [ITEM_MOCK],
  ITEM_ONE: ITEM_MOCK,
  ITEM_EMPTY: null
};
