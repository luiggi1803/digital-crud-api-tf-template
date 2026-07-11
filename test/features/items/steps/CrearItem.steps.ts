import { defineFeature, loadFeature } from 'jest-cucumber';
import { handler } from '../../../../src/items/infrastructure/bootstrap/App';
import {
  buildRequest,
  dbExceptionMockRepository,
  mockItemDynamoRepository,
  parseHandlerError
} from '../../../utils/AWSTestHelper';
import { ITEMS_REQUEST } from '../data/request/Items.request';

const feature = loadFeature('../crearItem.feature', { loadRelativePath: true, errors: true });

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Crear item exitosamente', ({ given, and, when, then }) => {
    let request: any;
    let response: any;
    const action = 'crearItem';

    given(/^que se recibe la peticion (.*)$/, (peticion: string) => {
      const event = ITEMS_REQUEST[peticion.trim()];
      request = buildRequest(action, event.payload, event.query, event.path, event.headers, 'POST');
    });

    and('se registra el item en la tabla dynamo', () => {
      mockItemDynamoRepository(undefined, 'guardar');
    });

    when('envio la peticion al servicio', async () => {
      response = await handler(request, {});
    });

    then('deberia recibir una respuesta con item creado', () => {
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.payload.item.nombre).toBe('Producto Nuevo');
      expect(body.payload.item.precio).toBe(150);
    });
  });

  test('Al crear item se muestra un mensaje de error', ({ given, and, when, then }) => {
    let request: any;
    let response: any;
    const action = 'crearItem';

    given(/^que se recibe la peticion (.*)$/, (peticion: string) => {
      const event = ITEMS_REQUEST[peticion.trim()];
      request = buildRequest(action, event.payload, event.query, event.path, event.headers, 'POST');
    });

    and('la base de datos no responde al guardar', () => {
      dbExceptionMockRepository('guardar');
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
