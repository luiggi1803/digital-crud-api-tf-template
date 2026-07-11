import { defineFeature, loadFeature } from 'jest-cucumber';
import { handler } from '../../../../src/items/infrastructure/bootstrap/App';
import { buildRequest, mockItemDynamoRepository } from '../../../utils/AWSTestHelper';
import { ITEMS_REQUEST } from '../data/request/Items.request';
import { DATA } from '../data/mock/DataRepository.mock';

const feature = loadFeature('../actualizarItem.feature', { loadRelativePath: true, errors: true });

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Actualizar item exitosamente', ({ given, and, when, then }) => {
    let request: any;
    let response: any;
    const action = 'actualizarItem';

    given(/^que se recibe la peticion (.*)$/, (peticion: string) => {
      const event = ITEMS_REQUEST[peticion.trim()];
      request = buildRequest(action, event.payload, event.query, event.path, event.headers, 'PUT');
    });

    and(/^se obtiene el item del repositorio (.*)$/, (dataItem: string) => {
      mockItemDynamoRepository(DATA[dataItem.trim()], 'obtenerPorId');
    });

    and('se actualiza el item en la tabla dynamo', () => {
      mockItemDynamoRepository(undefined, 'guardar');
    });

    when('envio la peticion al servicio', async () => {
      response = await handler(request, {});
    });

    then('deberia recibir una respuesta con item actualizado', () => {
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.payload.item.precio).toBe(200);
    });
  });
});
