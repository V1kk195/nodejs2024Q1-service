import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { validateUuid } from '../helpers';
import { db } from '../db';

const getUserWithoutPassword = (user: User): User => {
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  return userWithoutPassword;
};

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    const user: User = {
      ...createUserDto,
      createdAt: new Date().getTime(),
      id: uuidv4(),
      updatedAt: new Date().getTime(),
      version: 1,
    };
    db.users.push(user);

    return getUserWithoutPassword(user);
  }

  findAll(): User[] {
    return db.users.map((user) => getUserWithoutPassword(user));
  }

  findOne(id: string): User {
    validateUuid(id);

    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return getUserWithoutPassword(user);
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): User {
    validateUuid(id);

    const userIndex = db.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User ${id} not found`);
    }

    const user = db.users[userIndex];

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException(`Old password is incorrect`);
    }

    db.users[userIndex] = {
      ...user,
      version: user.version + 1,
      updatedAt: new Date().getTime(),
      password: updatePasswordDto.newPassword,
    };

    return getUserWithoutPassword(db.users[userIndex]);
  }

  remove(id: string): void {
    validateUuid(id);

    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    db.users = db.users.filter((user) => user.id !== id);
  }
}
