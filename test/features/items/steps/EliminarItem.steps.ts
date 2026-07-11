import { defineFeature, loadFeature } from 'jest-cucumber';
import { handler } from '../../../../src/items/infrastructure/bootstrap/App';
import { buildRequest, mockItemDynamoRepository } from '../../../utils/AWSTestHelper';
import { ITEMS_REQUEST } from '../data/request/Items.request';
import { ITEMS_RESPONSE } from '../data/response/Items.response';
import { DATA } from '../data/mock/DataRepository.mock';

const feature = loadFeature('../eliminarItem.feature', { loadRelativePath: true, errors: true });

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Eliminar item exitosamente', ({ given, and, when, then }) => {
    let request: any;
    let response: any;
    const action = 'eliminarItem';

    given(/^que se recibe la peticion (.*)$/, (peticion: string) => {
      const event = ITEMS_REQUEST[peticion.trim()];
      request = buildRequest(action, event.payload, event.query, event.path, event.headers, 'DELETE');
    });

    and(/^se obtiene el item del repositorio (.*)$/, (dataItem: string) => {
      mockItemDynamoRepository(DATA[dataItem.trim()], 'obtenerPorId');
    });

    and('se elimina el item de la tabla dynamo', () => {
      mockItemDynamoRepository(undefined, 'eliminar');
    });

    when('envio la peticion al servicio', async () => {
      response = await handler(request, {});
    });

    then(/^deberia recibir una respuesta exitosa (.*)$/, (mensaje: string) => {
      expect(response).toEqual(ITEMS_RESPONSE[mensaje.trim()]);
    });
  });
});
