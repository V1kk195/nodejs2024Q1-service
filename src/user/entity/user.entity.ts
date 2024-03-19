import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  login: string;

  @Column()
  password: string;

  @Column('int')
  @Generated('increment')
  version: number; // integer number, increments on update

  @Column('timestamp')
  createdAt: number; // timestamp of creation

  @Column('timestamp')
  updatedAt: number; // timestamp of last update
}
