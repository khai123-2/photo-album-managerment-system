import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserInfoDto } from './dtos/update-user-info.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { comparePass, generateHash } from 'src/utils/bcrypt';
import { UserNotFoundException } from 'src/exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(
    fields?: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User[] | []> {
    return await this.userRepository.find({ where: fields });
  }

  async getUser(
    fields: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    relationOptions?: string[],
  ): Promise<User> {
    return await this.userRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }

  async saveUser(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.getUser({ id });
    if (!user) {
      throw new UserNotFoundException();
    }
    return await this.userRepository.update(id, data);
  }

  async updateUserInfo(
    id: string,
    data: UpdateUserInfoDto,
  ): Promise<UpdateResult> {
    const user = await this.getUser({ id });
    if (!user) {
      throw new UserNotFoundException();
    }
    const username = await this.getUser({ username: data.username });

    if (username) {
      throw new BadRequestException('Username is already exist');
    }

    return await this.userRepository.update(id, data);
  }

  async changePassword(id: string, data: ChangePasswordDto) {
    const user = await this.getUser({ id });
    if (!user) {
      throw new UserNotFoundException();
    }
    const match = await comparePass(data.oldPassword, user.password);
    if (!match) {
      throw new BadRequestException('invalid old password');
    }
    if (data.oldPassword === data.newPassword) {
      throw new BadRequestException(
        'New password should be different from the old password',
      );
    }
    if (data.newPassword !== data.confirmPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match',
      );
    }
    const hashPassword = await generateHash(data.newPassword);
    user.password = hashPassword;
    return await this.userRepository.update(id, user);
  }
}
