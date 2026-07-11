import { Item } from '../entities/Item';

export interface ItemRepository {
  listar(): Promise<Item[]>;
  obtenerPorId(id: string): Promise<Item | null>;
  guardar(item: Item): Promise<void>;
  eliminar(id: string): Promise<void>;
}
