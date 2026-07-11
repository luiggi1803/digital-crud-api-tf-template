import { ItemDomainService } from '../../../../../../src/items/domain/service/ItemDomainService';
import { ItemRepository } from '../../../../../../src/items/domain/repository/ItemRepository';
import { Item } from '../../../../../../src/items/domain/entities/Item';

jest.mock('uuid', () => ({ v4: () => 'uuid-fijo-123' }));

describe('ItemDomainService', () => {
  let repository: jest.Mocked<ItemRepository>;
  let service: ItemDomainService;

  const itemMock: Item = {
    id: 'uuid-fijo-123',
    nombre: 'Producto A',
    descripcion: 'Descripción',
    precio: 100,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    repository = {
      listar: jest.fn(),
      obtenerPorId: jest.fn(),
      guardar: jest.fn(),
      eliminar: jest.fn()
    };
    service = new ItemDomainService(repository);
    jest.useFakeTimers().setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('debe listar items', async () => {
    repository.listar.mockResolvedValue([itemMock]);
    const result = await service.listarItems();
    expect(result).toEqual([itemMock]);
  });

  it('debe crear un item', async () => {
    repository.guardar.mockResolvedValue();
    const result = await service.crearItem({
      nombre: 'Producto A',
      descripcion: 'Descripción',
      precio: 100
    });
    expect(result).toEqual(itemMock);
    expect(repository.guardar).toHaveBeenCalledWith(itemMock);
  });

  it('debe actualizar un item existente', async () => {
    repository.obtenerPorId.mockResolvedValue(itemMock);
    repository.guardar.mockResolvedValue();
    const result = await service.actualizarItem('uuid-fijo-123', { precio: 150 });
    expect(result?.precio).toBe(150);
  });

  it('debe retornar null al actualizar item inexistente', async () => {
    repository.obtenerPorId.mockResolvedValue(null);
    const result = await service.actualizarItem('no-existe', { precio: 150 });
    expect(result).toBeNull();
  });

  it('debe eliminar un item existente', async () => {
    repository.obtenerPorId.mockResolvedValue(itemMock);
    repository.eliminar.mockResolvedValue();
    const result = await service.eliminarItem('uuid-fijo-123');
    expect(result).toBe(true);
  });
});
