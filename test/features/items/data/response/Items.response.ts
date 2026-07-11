import { ITEM_MOCK } from '../mock/DataRepository.mock';

export const ITEMS_RESPONSE: Record<string, any> = {
  RESPONSE_LISTAR_OK: {
    statusCode: 200,
    body: JSON.stringify({
      payload: {
        items: [ITEM_MOCK]
      }
    })
  },
  RESPONSE_OBTENER_OK: {
    statusCode: 200,
    body: JSON.stringify({
      payload: {
        item: ITEM_MOCK
      }
    })
  },
  RESPONSE_ELIMINAR_OK: {
    statusCode: 200,
    body: JSON.stringify({
      payload: {
        mensaje: 'Item eliminado correctamente'
      }
    })
  }
};
