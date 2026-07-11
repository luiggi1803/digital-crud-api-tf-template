import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from '../../../../../../src/items/infrastructure/controller/ItemController';
import { ItemDomainService } from '../../../../../../src/items/domain/service/ItemDomainService';
import { ItemRequestValidation } from '../../../../../../src/items/application/validation/ItemRequestValidation';
import { RequestDto } from '../../../../../../src/common/application/dto/RequestDto';
import CustomException from '../../../../../../src/common/application/exception/CustomException';
import { ERROR_ITEM_NO_ENCONTRADO } from '../../../../../../src/common/application/exception/ErrorConstants';

describe('ItemController', () => {
  let controller: ItemController;
  let domainService: jest.Mocked<ItemDomainService>;

  const itemMock = {
    id: '1',
    nombre: 'Producto',
    descripcion: 'Desc',
    precio: 50,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  };

  const baseRequest: RequestDto = {
    payload: {},
    query: {},
    path: {},
    user: null,
    trace: {},
    headers: {}
  };

  beforeEach(async () => {
    domainService = {
      listarItems: jest.fn(),
      obtenerItem: jest.fn(),
      crearItem: jest.fn(),
      actualizarItem: jest.fn(),
      eliminarItem: jest.fn()
    } as unknown as jest.Mocked<ItemDomainService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [ItemRequestValidation, { provide: ItemDomainService, useValue: domainService }]
    }).compile();

    controller = module.get<ItemController>(ItemController);
  });

  it('debe listar items', async () => {
    domainService.listarItems.mockResolvedValue([itemMock]);
    const result = await controller.listarItems(baseRequest);
    expect(result).toEqual({ items: [itemMock] });
  });

  it('debe obtener item por id', async () => {
    domainService.obtenerItem.mockResolvedValue(itemMock);
    const result = await controller.obtenerItem({ ...baseRequest, path: { id: '1' } });
    expect(result).toEqual({ item: itemMock });
  });

  it('debe lanzar excepción si item no existe', async () => {
    domainService.obtenerItem.mockResolvedValue(null);
    await expect(controller.obtenerItem({ ...baseRequest, path: { id: 'x' } })).rejects.toMatchObject({
      code: ERROR_ITEM_NO_ENCONTRADO.CODIGO,
      httpStatus: 404
    });
  });

  it('debe crear item', async () => {
    const payload = { nombre: 'A', descripcion: 'B', precio: 1 };
    domainService.crearItem.mockResolvedValue(itemMock);
    const result = await controller.crearItem({ ...baseRequest, payload });
    expect(domainService.crearItem).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ item: itemMock });
  });

  it('debe eliminar item', async () => {
    domainService.eliminarItem.mockResolvedValue(true);
    const result = await controller.eliminarItem({ ...baseRequest, path: { id: '1' } });
    expect(result).toEqual({ mensaje: 'Item eliminado correctamente' });
  });

  it('debe lanzar excepción al eliminar item inexistente', async () => {
    domainService.eliminarItem.mockResolvedValue(false);
    await expect(controller.eliminarItem({ ...baseRequest, path: { id: 'x' } })).rejects.toBeInstanceOf(CustomException);
  });
});
