import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptPassword } from 'src/utils/encrypt-password';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from '../db/user.schema';
import { UsersController } from '../users/user.controller';
import { UsersService } from '../users/users.service';
import { VoteSchema } from 'src/db/vote.schema';
import { VotesController } from './vote.controller';
import { VotesService } from './vote.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Vote', schema: VoteSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [VotesController],
  providers: [VotesService, VotesController],
  exports: [VotesService],
})
export class VotesModule {}
