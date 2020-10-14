import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { UserType } from '../../user/user.resource';

type UserTypeDecorator = (...userTypes: UserType[]) => CustomDecorator;

export const UserTypes: UserTypeDecorator = (...userTypes) => SetMetadata('userTypes', userTypes);
