import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from './organization.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectModel(Organization.name)
    private readonly _organizationModel: Model<Organization>,
  ) {}

  async create(object: object): Promise<Organization> {
    return await this._organizationModel.create(object);
  }
}
