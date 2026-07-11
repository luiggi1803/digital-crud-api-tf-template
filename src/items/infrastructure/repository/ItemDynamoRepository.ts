import { Injectable } from '@nestjs/common';
import { AdaptadorDynamo } from '../../../common/infrastructure/adapters/dynamo/AdaptadorDynamo';
import { getRequiredEnv } from '../../../common/config/env';
import { Item } from '../../domain/entities/Item';
import { ItemRepository } from '../../domain/repository/ItemRepository';

@Injectable()
export class ItemDynamoRepository implements ItemRepository {
  private readonly tabla: string;

  constructor(private readonly adaptador: AdaptadorDynamo) {
    this.tabla = getRequiredEnv('DYNAMODB_TABLE_ITEMS');
  }

  async listar(): Promise<Item[]> {
    const resultado = await this.adaptador.listar({ TableName: this.tabla });
    return (resultado.Items as Item[]) ?? [];
  }

  async obtenerPorId(id: string): Promise<Item | null> {
    const resultado = await this.adaptador.obtener({
      TableName: this.tabla,
      Key: { id }
    });
    return (resultado.Item as Item) ?? null;
  }

  async guardar(item: Item): Promise<void> {
    await this.adaptador.insertar({
      TableName: this.tabla,
      Item: item
    });
  }

  async eliminar(id: string): Promise<void> {
    await this.adaptador.eliminar({
      TableName: this.tabla,
      Key: { id }
    });
  }
}
