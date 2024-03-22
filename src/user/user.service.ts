import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { validateUuid } from '../helpers';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.login = createUserDto.login;
    user.password = createUserDto.password;
    user.version = 1;

    let newUser: User;

    try {
      newUser = await this.usersRepository.save(user);
    } catch (e) {
      throw new ForbiddenException(
        `User with login ${createUserDto.login} already exists`,
      );
    }

    return this.usersRepository.findOneBy({
      id: newUser.id,
    });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    validateUuid(id);

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    validateUuid(id);

    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        password: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException(`Old password is incorrect`);
    }

    user.password = updatePasswordDto.newPassword;

    await this.usersRepository.save(user);

    return this.usersRepository.findOneBy({ id: user.id });
  }

  async remove(id: string): Promise<void> {
    validateUuid(id);

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    await this.usersRepository.delete(id);
  }
}
