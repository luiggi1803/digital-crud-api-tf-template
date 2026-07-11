import { defineFeature, loadFeature } from 'jest-cucumber';
import { handler } from '../../../../src/items/infrastructure/bootstrap/App';
import {
  buildRequest,
  dbExceptionMockRepository,
  mockItemDynamoRepository,
  parseHandlerError
} from '../../../utils/AWSTestHelper';
import { ITEMS_REQUEST } from '../data/request/Items.request';
import { ITEMS_RESPONSE } from '../data/response/Items.response';
import { DATA } from '../data/mock/DataRepository.mock';

const feature = loadFeature('../listarItems.feature', { loadRelativePath: true, errors: true });

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Listar items exitosamente', ({ given, and, when, then }) => {
    let request: any;
    let response: any;
    const action = 'listarItems';

    given(/^que se recibe la peticion (.*)$/, (peticion: string) => {
      const event = ITEMS_REQUEST[peticion.trim()];
      request = buildRequest(action, event.payload, event.query, event.path, event.headers, 'GET');
    });

    and(/^se obtiene la lista de items del repositorio (.*)$/, (dataItems: string) => {
      mockItemDynamoRepository(DATA[dataItems.trim()], 'listar');
    });

    when('envio la peticion al servicio', async () => {
      response = await handler(request, {});
    });

    then(/^deberia recibir una respuesta exitosa (.*)$/, (mensaje: string) => {
      expect(response).toEqual(ITEMS_RESPONSE[mensaje.trim()]);
    });
  });

  test('Al listar items se muestra un mensaje de error', ({ given, and, when, then }) => {
    let request: any;
    let response: any;
    const action = 'listarItems';

    given(/^que se recibe la peticion (.*)$/, (peticion: string) => {
      const event = ITEMS_REQUEST[peticion.trim()];
      request = buildRequest(action, event.payload, event.query, event.path, event.headers, 'GET');
    });

    and('la base de datos no responde al listar', () => {
      dbExceptionMockRepository('listar');
    });

    when('envio la peticion al servicio', async () => {
      response = await handler(request, {});
    });

    then(/^se debe mostrar la siguiente respuesta (.*) y (.*)$/, (mensaje: string, detalle: string) => {
      expect(response.statusCode).toBe(500);
      const error = parseHandlerError(response);
      expect(error.message).toEqual(mensaje);
      expect(error.details).toEqual(detalle.split(','));
    });
  });
});
