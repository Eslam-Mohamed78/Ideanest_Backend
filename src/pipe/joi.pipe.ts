import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly _schema: Object) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (this._schema[metadata.type]) {
      const validationResult = this._schema[metadata.type].validate(value, {
        abortEarly: false,
      });

      if (validationResult.error) {
        throw new BadRequestException(validationResult.error.message);
      }
    }

    return value;
  }
}
