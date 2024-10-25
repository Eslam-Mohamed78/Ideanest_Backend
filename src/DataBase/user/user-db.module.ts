import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { User, userSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
    ]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserDBModule {}
