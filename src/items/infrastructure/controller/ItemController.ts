import { Controller } from '@nestjs/common';
import { RequestDto } from '../../../common/application/dto/RequestDto';
import CustomException from '../../../common/application/exception/CustomException';
import { ERROR_ERROR_INTERNO, ERROR_ITEM_NO_ENCONTRADO } from '../../../common/application/exception/ErrorConstants';
import { HTTP_CONSTANT } from '../../../common/core/http.constant';
import { Logger } from '../../../common/Logger';
import { ActualizarItemRequest } from '../../application/dto/request/ActualizarItemRequest';
import { CrearItemRequest } from '../../application/dto/request/CrearItemRequest';
import { ObtenerItemRequest } from '../../application/dto/request/ObtenerItemRequest';
import { ItemListResponse, ItemMutationResponse, ItemSingleResponse } from '../../application/dto/response/ItemResponse';
import { ItemRequestValidation } from '../../application/validation/ItemRequestValidation';
import { ItemDomainService } from '../../domain/service/ItemDomainService';

@Controller()
export class ItemController {
  private readonly logger: Logger = new Logger(ItemController.name);

  constructor(
    private readonly requestValidator: ItemRequestValidation,
    private readonly itemDomainService: ItemDomainService
  ) {}

  public async listarItems(request: RequestDto): Promise<ItemListResponse> {
    this.logger.log('listarItems request:', request);
    try {
      const items = await this.itemDomainService.listarItems();
      const response = { items };
      this.logger.log('listarItems response:', response);
      return response;
    } catch (exception) {
      this.logger.error('Error en listarItems', exception);
      throw new CustomException({
        code: ERROR_ERROR_INTERNO.CODIGO,
        message: ERROR_ERROR_INTERNO.MENSAJE,
        httpStatus: HTTP_CONSTANT.INTERNAL_SERVER_ERROR_STATUS.code,
        details: exception instanceof Error ? exception.message : String(exception),
        exception: exception instanceof Error ? exception : undefined
      });
    }
  }

  public async obtenerItem(request: RequestDto): Promise<ItemSingleResponse> {
    this.logger.log('obtenerItem request:', request);
    const payload = { id: (request.path as ObtenerItemRequest).id };
    await this.requestValidator.obtenerItemValidacion(payload);
    const item = await this.itemDomainService.obtenerItem(payload.id);
    if (!item) {
      throw new CustomException({
        code: ERROR_ITEM_NO_ENCONTRADO.CODIGO,
        message: ERROR_ITEM_NO_ENCONTRADO.MENSAJE,
        httpStatus: HTTP_CONSTANT.NOT_FOUND_STATUS.code
      });
    }
    const response = { item };
    this.logger.log('obtenerItem response:', response);
    return response;
  }

  public async crearItem(request: RequestDto): Promise<ItemMutationResponse> {
    this.logger.log('crearItem request:', request);
    const payload = { ...request.payload } as CrearItemRequest;
    await this.requestValidator.crearItemValidacion(payload);
    try {
      const item = await this.itemDomainService.crearItem(payload);
      const response = { item };
      this.logger.log('crearItem response:', response);
      return response;
    } catch (exception) {
      this.logger.error('Error en crearItem', exception);
      throw new CustomException({
        code: ERROR_ERROR_INTERNO.CODIGO,
        message: ERROR_ERROR_INTERNO.MENSAJE,
        httpStatus: HTTP_CONSTANT.INTERNAL_SERVER_ERROR_STATUS.code,
        details: exception instanceof Error ? exception.message : String(exception),
        exception: exception instanceof Error ? exception : undefined
      });
    }
  }

  public async actualizarItem(request: RequestDto): Promise<ItemMutationResponse> {
    this.logger.log('actualizarItem request:', request);
    const id = (request.path as ObtenerItemRequest).id;
    const payload = { ...request.payload } as ActualizarItemRequest;
    await this.requestValidator.actualizarItemValidacion(payload);
    const item = await this.itemDomainService.actualizarItem(id, payload);
    if (!item) {
      throw new CustomException({
        code: ERROR_ITEM_NO_ENCONTRADO.CODIGO,
        message: ERROR_ITEM_NO_ENCONTRADO.MENSAJE,
        httpStatus: HTTP_CONSTANT.NOT_FOUND_STATUS.code
      });
    }
    const response = { item };
    this.logger.log('actualizarItem response:', response);
    return response;
  }

  public async eliminarItem(request: RequestDto): Promise<{ mensaje: string }> {
    this.logger.log('eliminarItem request:', request);
    const payload = { id: (request.path as ObtenerItemRequest).id };
    await this.requestValidator.eliminarItemValidacion(payload);
    const eliminado = await this.itemDomainService.eliminarItem(payload.id);
    if (!eliminado) {
      throw new CustomException({
        code: ERROR_ITEM_NO_ENCONTRADO.CODIGO,
        message: ERROR_ITEM_NO_ENCONTRADO.MENSAJE,
        httpStatus: HTTP_CONSTANT.NOT_FOUND_STATUS.code
      });
    }
    const response = { mensaje: 'Item eliminado correctamente' };
    this.logger.log('eliminarItem response:', response);
    return response;
  }
}
