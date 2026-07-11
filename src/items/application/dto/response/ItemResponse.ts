import { Item } from '../../../domain/entities/Item';

export interface ItemListResponse {
  items: Item[];
}

export interface ItemSingleResponse {
  item: Item;
}

export interface ItemMutationResponse {
  item: Item;
}

export interface EliminarItemResponse {
  mensaje: string;
}
