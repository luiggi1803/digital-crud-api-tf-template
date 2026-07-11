export const ITEMS_REQUEST: Record<string, any> = {
  REQUEST_OK: {
    payload: {},
    query: {},
    path: {},
    headers: {}
  },
  REQUEST_CREAR_OK: {
    payload: {
      nombre: 'Producto Nuevo',
      descripcion: 'Descripción nueva',
      precio: 150
    },
    query: {},
    path: {},
    headers: {}
  },
  REQUEST_ACTUALIZAR_OK: {
    payload: {
      precio: 200
    },
    query: {},
    path: { id: 'item-001' },
    headers: {}
  },
  REQUEST_OBTENER_OK: {
    payload: {},
    query: {},
    path: { id: 'item-001' },
    headers: {}
  },
  REQUEST_ELIMINAR_OK: {
    payload: {},
    query: {},
    path: { id: 'item-001' },
    headers: {}
  },
  REQUEST_OBTENER_NO_EXISTE: {
    payload: {},
    query: {},
    path: { id: 'no-existe' },
    headers: {}
  }
};
