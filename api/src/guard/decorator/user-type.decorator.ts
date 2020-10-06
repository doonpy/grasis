import { CustomDecorator, SetMetadata } from '@nestjs/common';

type UserTypeDecorator = (...userTypes: number[]) => CustomDecorator;

export const UserTypes: UserTypeDecorator = (...userTypes: number[]) =>
  SetMetadata('userTypes', userTypes);
