import { validate } from 'uuid';
import { BadRequestException } from '@nestjs/common';

export const validateUuid = (id: string): void => {
  if (!validate(id)) {
    throw new BadRequestException(`Id ${id} is not valid UUID`);
  }
};
