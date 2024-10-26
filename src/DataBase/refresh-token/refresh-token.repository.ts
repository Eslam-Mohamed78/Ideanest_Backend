import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './refresh-token.schema';
import { Model } from 'mongoose';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly _refreshTokenModel: Model<RefreshToken>,
  ) {}

  async create(object: object): Promise<RefreshToken> {
    return await this._refreshTokenModel.create(object);
  }

  async findOneAndDelete(object: object): Promise<RefreshToken> {
    return await this._refreshTokenModel.findOneAndDelete(object);
  }
}
