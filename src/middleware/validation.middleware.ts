import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/http.exception';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validationMiddleware = <T>(type: any, skipMissingProperties = false): express.RequestHandler => {
  return (req, res, next) => {
    validate(plainToInstance(type, req.body), { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const message = errors.map((error: ValidationError) => Object.values(error.constraints!)).join(', ');
        next(new HttpException(400, message));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
