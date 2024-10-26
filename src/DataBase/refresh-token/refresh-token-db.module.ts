import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, refreshTokenSchema } from './refresh-token.schema';
import { Module } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: refreshTokenSchema },
    ]),
  ],
  providers: [RefreshTokenRepository],
  exports: [RefreshTokenRepository],
})
export class RefreshTokenDBModule {}
