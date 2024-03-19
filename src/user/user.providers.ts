import { DataSource } from 'typeorm';
import { User } from './entity/user.entity';
import { dbConstants } from '../constants';

export const userProviders = [
  {
    provide: dbConstants.USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [dbConstants.DATA_SOURCE],
  },
];
