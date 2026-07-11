import { ItemRequestValidation } from '../../../../../../src/items/application/validation/ItemRequestValidation';
import CustomException from '../../../../../../src/common/application/exception/CustomException';

describe('ItemRequestValidation', () => {
  const validation = new ItemRequestValidation();

  it('debe validar crear item correctamente', async () => {
    await expect(
      validation.crearItemValidacion({
        nombre: 'Producto',
        descripcion: 'Descripción',
        precio: 10
      })
    ).resolves.toBeUndefined();
  });

  it('debe fallar si falta nombre al crear', async () => {
    await expect(
      validation.crearItemValidacion({
        descripcion: 'Descripción',
        precio: 10
      } as never)
    ).rejects.toBeInstanceOf(CustomException);
  });

  it('debe validar actualizar item correctamente', async () => {
    await expect(validation.actualizarItemValidacion({ id: '1', precio: 20 })).resolves.toBeUndefined();
  });

  it('debe fallar si actualizar item viene sin id', async () => {
    await expect(validation.actualizarItemValidacion({ precio: 20 } as never)).rejects.toBeInstanceOf(CustomException);
  });

  it('debe fallar si actualizar item viene vacío', async () => {
    await expect(validation.actualizarItemValidacion({ id: '1' })).rejects.toBeInstanceOf(CustomException);
  });
});
