import Joi from 'joi';
import { Injectable } from '@nestjs/common';
import { validate } from '../../../common/application/validation/Validator';
import { ActualizarItemRequest } from '../dto/request/ActualizarItemRequest';
import { CrearItemRequest } from '../dto/request/CrearItemRequest';
import { ObtenerItemRequest } from '../dto/request/ObtenerItemRequest';

@Injectable()
export class ItemRequestValidation {
  public async obtenerItemValidacion(payload: ObtenerItemRequest): Promise<void> {
    const schema = Joi.object().keys({
      id: Joi.string().required()
    });
    await validate(schema, payload);
  }

  public async crearItemValidacion(payload: CrearItemRequest): Promise<void> {
    const schema = Joi.object().keys({
      nombre: Joi.string().trim().required(),
      descripcion: Joi.string().trim().required(),
      precio: Joi.number().min(0).required()
    });
    await validate(schema, payload);
  }

  public async actualizarItemValidacion(payload: ActualizarItemRequest & ObtenerItemRequest): Promise<void> {
    const schema = Joi.object()
      .keys({
        id: Joi.string().required(),
        nombre: Joi.string().trim().optional(),
        descripcion: Joi.string().trim().optional(),
        precio: Joi.number().min(0).optional()
      })
      .min(2);
    await validate(schema, payload);
  }

  public async eliminarItemValidacion(payload: ObtenerItemRequest): Promise<void> {
    const schema = Joi.object().keys({
      id: Joi.string().required()
    });
    await validate(schema, payload);
  }
}
