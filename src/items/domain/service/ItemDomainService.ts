import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '../../../common/Logger';
import { Item } from '../entities/Item';
import { ItemRepository } from '../repository/ItemRepository';
import { CrearItemRequest } from '../../application/dto/request/CrearItemRequest';
import { ActualizarItemRequest } from '../../application/dto/request/ActualizarItemRequest';

@Injectable()
export class ItemDomainService {
  private readonly logger: Logger = new Logger(ItemDomainService.name);

  constructor(@Inject('ItemRepository') private readonly itemRepository: ItemRepository) {}

  public async listarItems(): Promise<Item[]> {
    this.logger.log('listarItems');
    return this.itemRepository.listar();
  }

  public async obtenerItem(id: string): Promise<Item | null> {
    return this.itemRepository.obtenerPorId(id);
  }

  public async crearItem(params: CrearItemRequest): Promise<Item> {
    const ahora = new Date().toISOString();
    const item: Item = {
      id: uuidv4(),
      nombre: params.nombre,
      descripcion: params.descripcion,
      precio: params.precio,
      createdAt: ahora,
      updatedAt: ahora
    };

    await this.itemRepository.guardar(item);
    return item;
  }

  public async actualizarItem(id: string, params: ActualizarItemRequest): Promise<Item | null> {
    const existente = await this.itemRepository.obtenerPorId(id);
    if (!existente) {
      return null;
    }

    const actualizado: Item = {
      id: existente.id,
      nombre: params.nombre ?? existente.nombre,
      descripcion: params.descripcion ?? existente.descripcion,
      precio: params.precio ?? existente.precio,
      createdAt: existente.createdAt,
      updatedAt: new Date().toISOString()
    };

    await this.itemRepository.guardar(actualizado);
    return actualizado;
  }

  public async eliminarItem(id: string): Promise<boolean> {
    const existente = await this.itemRepository.obtenerPorId(id);
    if (!existente) {
      return false;
    }

    await this.itemRepository.eliminar(id);
    return true;
  }
}
