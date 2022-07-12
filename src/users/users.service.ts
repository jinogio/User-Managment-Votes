import { User } from '../db/user-interface';
import { promisify } from 'util';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EncryptPassword } from '../utils/encrypt-password';
import { UserRegisterDto } from '../users/dto/user-register-dto';
import { UserLoginDto } from '../users/dto/user-login-dto';
import { UserUpdateDto } from './dto/user-update-dto';
import { UserNicknameDto } from './dto/user-nickname-dto';
import { UserPaginationDto } from './dto/pagination-dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: SoftDeleteModel<User>,
    private readonly encryptPassword: EncryptPassword,
  ) {}

  async registerUser(userRegister: UserRegisterDto): Promise<Partial<User>> {
    const existingUser = await this.userModel.findOne({
      nickname: userRegister.nickname,
    });
    if (existingUser) {
      throw new Error('user already register');
    }
    const hashed = await this.encryptPassword.encrypt(userRegister.password);

    const user = new this.userModel({
      ...userRegister,
      password: hashed,
    });

    await user.save();

    const { password, _id, __v, ...registeredUser } = user.toObject();

    return registeredUser;
  }

  async updateUser(
    nickname: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<Partial<User>> {
    const user = await this.userModel.findOne({
      nickname: userUpdateDto.nickname,
    });

    if (!user) {
      throw new Error('user not found');
    }
    if (userUpdateDto.password) {
      const password = await this.encryptPassword.encrypt(
        userUpdateDto.password,
      );
      Object.assign(userUpdateDto, { password });
    }

    Object.assign(user, userUpdateDto);
    await user.save();
    const { password, _id, __v, ...registeredUser } = user.toObject();
    return registeredUser;
  }

  async getUser(userNickname: UserNicknameDto): Promise<User> {
    const existingUser = await this.userModel.findOne(userNickname);
    if (!existingUser) {
      throw new Error('user not found');
    }

    return existingUser;
  }
  async getUserList() {
    const allUsers = await this.userModel.find();
    if (!allUsers) {
      throw new Error('users not found');
    }
    return allUsers;
  }

  async deleteUser(
    userNicknameDto: UserNicknameDto,
  ): Promise<{ deleted: number }> {
    const deleteUser = await this.userModel.softDelete({
      nickname: userNicknameDto,
    });
    return deleteUser;
  }

  async listUser(userPagination: UserPaginationDto) {
    const list = await this.userModel
      .find()
      .sort({ _id: 'asc' })
      .skip((userPagination.page - 1) * userPagination.size)
      .limit(userPagination.size);

    return list;
  }
}
