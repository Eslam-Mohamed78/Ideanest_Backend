import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './organization.schema';
import { Model, Types } from 'mongoose';
import { Pagination } from '../../enum/pagination.enum';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectModel(Organization.name)
    private readonly _organizationModel: Model<Organization>,
  ) {}

  async create(object: object): Promise<Organization> {
    return await this._organizationModel.create(object);
  }

  async findById(id: Types.ObjectId): Promise<Organization> {
    return this._organizationModel.findById(id);
  }

  async findByIdWithMembers(id: Types.ObjectId): Promise<Organization> {
    return await this._organizationModel.findById(id).populate({
      path: 'organization_members',
      select: 'name email access_level',
    });
  }

  async findByIdAndUpdate(
    id: Types.ObjectId,
    object: object,
  ): Promise<Organization> {
    return this._organizationModel.findByIdAndUpdate(id, object, {
      new: true,
      useFindAndModify: false,
    });
  }

  async findByIdAndDelete(id: Types.ObjectId): Promise<Organization> {
    return this._organizationModel.findByIdAndDelete(id);
  }

  async findWithMembers(object: object): Promise<Organization[]> {
    return this._organizationModel.find(object).populate({
      path: 'organization_members',
      select: 'name email access_level -_id',
    });
  }

  async findWithPagination(
    object: object,
    page: number = 1,
    limit: number = Pagination.LIMIT,
  ): Promise<Organization[]> {
    return this._organizationModel
      .find(object)
      .populate({
        path: 'organization_members',
        select: 'name email access_level -_id',
      })
      .skip((page - 1) * limit)
      .limit(limit);
  }
}
