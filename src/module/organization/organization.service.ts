import { Pagination } from './../../enum/pagination.enum';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAndUpdateOrganizationDto } from './dto/create-and-update-organization.dto';
import { OrganizationRepository } from '../../DataBase/organization/organization.repository';
import { InviteUserToOrganizationDto } from './dto/invite-user-to-organization.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Types } from 'mongoose';
import { UserRepository } from '../../DataBase/user/user.repository';
import { SearchAndPaginationDto } from './dto/search-and-pagination.dto';
import { Organization } from '../../DataBase/organization/organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly _i18n: I18nService,
    private readonly _userRepository: UserRepository,
    private readonly _organizationRepository: OrganizationRepository,
  ) {}

  async createOrganization(body: CreateAndUpdateOrganizationDto) {
    const { name, description } = body;

    const organization = await this._organizationRepository.create({
      name,
      description,
    });

    return { organization_id: organization['_id'] };
  }

  async readOrganization(req: any, id: Types.ObjectId) {
    // make sure the id type isn't a string
    const organization_id = new Types.ObjectId(id);
    const userId = req.user._id;

    const organization =
      await this._organizationRepository.findByIdWithMembers(organization_id);

    if (!organization)
      throw new NotFoundException(
        `${this._i18n.t(`test.NOT_FOUND_ENTITY`, {
          lang: I18nContext.current().lang,
        })}`,
      );

    // Check if the user is a member of the organization
    const isMember = organization.organization_members.some(
      (member) => member._id.toString() === userId.toString(),
    );

    if (!isMember)
      throw new BadRequestException(
        `${this._i18n.t(`test.YOU_ARE_NOT_A_MEMBER`, {
          lang: I18nContext.current().lang,
        })}`,
      );

    return { data: organization };
  }

  async readAllOrganizations(query: SearchAndPaginationDto) {
    const { search, limit, page, paginated } = query;
    let paginatedDocs: Organization[];

    const totalDocs = await this._organizationRepository.findWithMembers({
      ...(search && { name: { $regex: search, $options: 'i' } }),
    });

    if (paginated) {
      paginatedDocs = await this._organizationRepository.findWithPagination(
        {
          ...(search && { name: { $regex: search, $options: 'i' } }),
        },
        page,
        limit,
      );
    }

    return {
      data: paginated ? paginatedDocs : totalDocs,
      total: totalDocs.length,
      ...(paginated && { page: page || 1 }),
      ...(paginated && { limit: limit || Pagination.LIMIT }),
    };
  }

  async updateOrganization(
    id: Types.ObjectId,
    body: CreateAndUpdateOrganizationDto,
  ) {
    // make sure the id type isn't a string
    const organization_id = new Types.ObjectId(id);
    const { name, description } = body;

    if (!name && !description)
      throw new BadRequestException(
        `${this._i18n.t(`test.NO_DATA_PROVIDED_TO_UPDATE`, {
          lang: I18nContext.current().lang,
        })}`,
      );

    const organization = await this._organizationRepository.findByIdAndUpdate(
      organization_id,
      { name, description },
    );

    if (!organization)
      throw new NotFoundException(
        `${this._i18n.t(`test.NOT_FOUND_ENTITY`, {
          lang: I18nContext.current().lang,
        })}`,
      );

    return { data: organization };
  }

  async deleteOrganization(id: Types.ObjectId) {
    // make sure the id type isn't a string
    const organization_id = new Types.ObjectId(id);

    const organization =
      await this._organizationRepository.findByIdAndDelete(organization_id);

    if (!organization)
      throw new NotFoundException(
        `${this._i18n.t(`test.NOT_FOUND_ENTITY`, {
          lang: I18nContext.current().lang,
        })}`,
      );

    return {
      message: `${this._i18n.t(`test.ORGANIZATION_DELETION_SUCCESS`, {
        lang: I18nContext.current().lang,
      })}`,
    };
  }

  async inviteUserToOrganization(
    id: Types.ObjectId,
    body: InviteUserToOrganizationDto,
  ) {
    // make sure the id type isn't a string
    const organization_id = new Types.ObjectId(id);
    const { user_email } = body;

    const isOrganizationExists =
      await this._organizationRepository.findById(organization_id);

    if (!isOrganizationExists)
      throw new NotFoundException(
        `${this._i18n.t(`test.NOT_FOUND_ENTITY`, {
          lang: I18nContext.current().lang,
        })}`,
      );

    const isUserExists = await this._userRepository.findOne({
      email: user_email,
    });

    if (!isUserExists)
      throw new BadRequestException(
        `${this._i18n.t(`test.USER_NOT_FOUND`, {
          lang: I18nContext.current().lang,
        })}`,
      );

    await this._organizationRepository.findByIdAndUpdate(organization_id, {
      $addToSet: { organization_members: isUserExists['_id'] },
    });

    return {
      message: `${this._i18n.t(`test.USER_INVITATION_SUCCESS`, {
        lang: I18nContext.current().lang,
      })}`,
    };
  }
}
