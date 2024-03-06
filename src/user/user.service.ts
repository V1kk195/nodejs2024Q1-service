import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { validateUuid } from '../helpers';

const getUserWithoutPassword = (user: User): User => {
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  return userWithoutPassword;
};

@Injectable()
export class UserService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Missing field login or password');
    }

    const user: User = {
      ...createUserDto,
      createdAt: new Date().getTime(),
      id: uuidv4(),
      updatedAt: new Date().getTime(),
      version: 0,
    };
    this.users.push(user);

    return getUserWithoutPassword(user);
  }

  findAll(): User[] {
    return this.users.map((user) => getUserWithoutPassword(user));
  }

  findOne(id: string): User {
    validateUuid(id);

    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return getUserWithoutPassword(user);
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): User {
    validateUuid(id);

    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User ${id} not found`);
    }

    const user = this.users[userIndex];

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException(`Old password is incorrect`);
    }

    this.users[userIndex] = {
      ...user,
      version: user.version + 1,
      updatedAt: new Date().getTime(),
      password: updatePasswordDto.newPassword,
    };

    return getUserWithoutPassword(this.users[userIndex]);
  }

  remove(id: string): void {
    validateUuid(id);

    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    this.users = this.users.filter((user) => user.id !== id);
  }
}
