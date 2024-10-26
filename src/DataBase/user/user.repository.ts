import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly _userModel: Model<User>,
  ) {}

  async create(object: object): Promise<User> {
    return await this._userModel.create(object);
  }

  async findOne(object: object): Promise<User> {
    return await this._userModel.findOne(object);
  }

  async findOneAndUpdate(
    query: object,
    object: object,
  ): Promise<User> {
    return this._userModel.findOneAndUpdate(query, object, {
      new: true,
      useFindAndModify: false,
    });
  }

  async findById(object: object): Promise<User> {
    return await this._userModel.findById(object);
  }

  async findOneWithPassword(object: object): Promise<User> {
    return await this._userModel.findOne(object).select('+password');
  }
}
