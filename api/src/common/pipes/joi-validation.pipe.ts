import { AnySchema } from '@hapi/joi';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: AnySchema) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public transform(value: any): any {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(error.message);
    }
    return value;
  }
}
