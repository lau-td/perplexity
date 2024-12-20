import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'IS_PUBLIC';
export const IsPublic = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
