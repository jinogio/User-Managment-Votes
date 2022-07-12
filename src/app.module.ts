import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { VotesModule } from './votes/vote.module';

@Module({
  imports: [
    UsersModule,
    VotesModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
