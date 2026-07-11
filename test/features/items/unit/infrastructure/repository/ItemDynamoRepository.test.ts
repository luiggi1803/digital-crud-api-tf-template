import { ItemDynamoRepository } from '../../../../../../src/items/infrastructure/repository/ItemDynamoRepository';
import { AdaptadorDynamo } from '../../../../../../src/common/infrastructure/adapters/dynamo/AdaptadorDynamo';

describe('ItemDynamoRepository', () => {
  const itemMock = {
    id: '1',
    nombre: 'Producto',
    descripcion: 'Desc',
    precio: 10,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  };

  let adaptador: {
    listar: jest.Mock;
    obtener: jest.Mock;
    insertar: jest.Mock;
    eliminar: jest.Mock;
  };

  beforeEach(() => {
    process.env.DYNAMODB_TABLE_ITEMS = 'UE2-digital-crud-api-dev-items';
    adaptador = {
      listar: jest.fn(),
      obtener: jest.fn(),
      insertar: jest.fn(),
      eliminar: jest.fn()
    };
  });

  it('debe listar items desde dynamodb', async () => {
    adaptador.listar.mockResolvedValue({ Items: [itemMock] });
    const repository = new ItemDynamoRepository(adaptador as unknown as AdaptadorDynamo);
    const result = await repository.listar();
    expect(result).toEqual([itemMock]);
  });

  it('debe obtener item por id', async () => {
    adaptador.obtener.mockResolvedValue({ Item: itemMock });
    const repository = new ItemDynamoRepository(adaptador as unknown as AdaptadorDynamo);
    const result = await repository.obtenerPorId('1');
    expect(result).toEqual(itemMock);
  });

  it('debe guardar item', async () => {
    const repository = new ItemDynamoRepository(adaptador as unknown as AdaptadorDynamo);
    await repository.guardar(itemMock);
    expect(adaptador.insertar).toHaveBeenCalledWith({
      TableName: 'UE2-digital-crud-api-dev-items',
      Item: itemMock
    });
  });
});
