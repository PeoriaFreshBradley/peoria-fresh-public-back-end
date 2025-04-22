import { Type, UsePipes, ValidationPipe } from '@nestjs/common';

// this is our custom validation pipe that we use to insure we have a different validation pipe create and update requests without having to override the create and update methods in the child controllers
export const UseCustomValidationPipes = (type: Type) => {
  return function _UseValidationPipes<T extends { new (...args: any[]): any }>(
    constr: T,
  ) {
    return class extends constr {
      constructor(...args: any[]) {
        super(...args);
      }

      create = UsePipes(
        new ValidationPipe({
          expectedType: type,
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
      )((...params) => super.create(...params));

      update = UsePipes(
        new ValidationPipe({
          expectedType: type,
          whitelist: true,
          forbidNonWhitelisted: true,
          skipMissingProperties: true,
        }),
      )((...params) => super.update(...params));
    };
  };
};
