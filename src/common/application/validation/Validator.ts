import Joi from 'joi';
import { HttpStatus } from '@nestjs/common';
import CustomException from '../exception/CustomException';
import { ERROR_VALIDAR_DATOS } from '../exception/ErrorConstants';
import { validationMessages } from './ValidationMessages';

export const validate = async (schema: Joi.ObjectSchema, payload: unknown) => {
  const validation = schema.validate(payload, {
    allowUnknown: false,
    abortEarly: false,
    convert: false,
    errors: { language: 'spanish' },
    messages: validationMessages
  });

  if (validation.error) {
    const messagesError: string[] = [];
    validation.error.details.forEach((value) => {
      messagesError.push(value.message);
    });

    throw new CustomException({
      code: ERROR_VALIDAR_DATOS.CODIGO,
      message: ERROR_VALIDAR_DATOS.MENSAJE,
      httpStatus: HttpStatus.BAD_REQUEST,
      details: messagesError
    });
  }
};
