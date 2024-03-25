import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { validateUuid } from '../helpers';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.login = createUserDto.login;
    user.password = createUserDto.password;
    user.version = 1;

    let newUser: UserEntity;

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

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
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
  ): Promise<UserEntity> {
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
