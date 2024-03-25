import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column({ unique: true })
  login: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    type: 'int',
    default: 1,
  })
  version: number; // integer number, increments on update

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => new Date(value).valueOf(),
    },
  })
  createdAt: number | Date; // timestamp of creation

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: {
      to: (value: Date) => value,
      from: (value: string) => new Date(value).valueOf(),
    },
  })
  updatedAt: number | Date; // timestamp of last update

  @BeforeUpdate()
  updateVersion() {
    this.version = this.version + 1;
  }

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();
  }
}
