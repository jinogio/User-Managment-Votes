import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../db/user-interface';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { EncryptPassword } from 'src/utils/encrypt-password';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private encryptPassword: EncryptPassword,
    private jwtService: JwtService,
    @InjectModel('User') private readonly userModel: SoftDeleteModel<User>,
  ) {}

  async validateUser(nickname: string, password: string): Promise<any> {
    const profile = await this.userModel.findOne({ nickname });
    const [salt] = profile.password.split('.');

    const hashedPassword = await this.encryptPassword.encrypt(password, salt);

    if (profile.password === hashedPassword) {
      return this.login(profile);
    }
    return null;
  }

  async login(profile: User) {
    const payload = { nickname: profile.nickname, role: profile.role };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.KEY }),
    };
  }
}
