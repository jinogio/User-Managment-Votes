import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RolesGuard } from './roles.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { LocalStrategy } from './local.strategy';
import { EncryptPassword } from 'src/utils/encrypt-password';
import { UsersModule } from 'src/users/users.module';
import { UserSchema } from 'src/db/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    EncryptPassword,
    AuthService,
    JwtStrategy,
    RolesGuard,
    LocalAuthGuard,
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
