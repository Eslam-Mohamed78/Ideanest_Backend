import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JoiValidationPipe } from '../../pipe/joi.pipe';
import { OrganizationService } from './organization.service';
import { CreateAndUpdateOrganizationDto } from './dto/create-and-update-organization.dto';
import { AuthGuard } from '../../guard/auth.guard';
import {
  organizationIdSchema,
  createOrganizationSchema,
  inviteUserToOrganizationSchema,
  updateOrganizationSchema,
} from './organization.validation';
import { RoleGuard } from '../../guard/role.guard';
import { Roles } from '../../decorator/role.decorator';
import { UserRole } from '../../enum/user.enum';
import { Types } from 'mongoose';
import { InviteUserToOrganizationDto } from './dto/invite-user-to-organization.dto';
import { searchAndPaginationSchema } from '../../constant/joi.validation';
import { SearchAndPaginationDto } from './dto/search-and-pagination.dto';
import { Request } from 'express';

@UseGuards(AuthGuard, RoleGuard)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly _organizationService: OrganizationService) {}

  @Post('')
  @Roles(UserRole.FULL_ACCESS)
  @UsePipes(new JoiValidationPipe(createOrganizationSchema))
  async createOrganization(@Body() body: CreateAndUpdateOrganizationDto) {
    return this._organizationService.createOrganization(body);
  }

  @Get(':organization_id')
  @Roles(UserRole.READ_ONLY)
  @UsePipes(new JoiValidationPipe(organizationIdSchema))
  async readOrganization(
    @Req() req:Request,
    @Param('organization_id') organization_id: Types.ObjectId,
  ) {
    return this._organizationService.readOrganization(req, organization_id);
  }

  @Get('')
  @Roles(UserRole.FULL_ACCESS)
  @UsePipes(new JoiValidationPipe(searchAndPaginationSchema))
  async readAllOrganizations(@Query() query: SearchAndPaginationDto) {
    return this._organizationService.readAllOrganizations(query);
  }

  @Put(':organization_id')
  @Roles(UserRole.FULL_ACCESS)
  @UsePipes(new JoiValidationPipe(updateOrganizationSchema))
  async updateOrganization(
    @Param('organization_id') organization_id: Types.ObjectId,
    @Body() body: CreateAndUpdateOrganizationDto,
  ) {
    return this._organizationService.updateOrganization(organization_id, body);
  }

  @Delete(':organization_id')
  @Roles(UserRole.FULL_ACCESS)
  @UsePipes(new JoiValidationPipe(organizationIdSchema))
  async deleteOrganization(
    @Param('organization_id') organization_id: Types.ObjectId,
  ) {
    return this._organizationService.deleteOrganization(organization_id);
  }

  @Post(':organization_id/invite')
  @Roles(UserRole.FULL_ACCESS)
  @UsePipes(new JoiValidationPipe(inviteUserToOrganizationSchema))
  async inviteUserToOrganization(
    @Param('organization_id') organization_id: Types.ObjectId,
    @Body() body: InviteUserToOrganizationDto,
  ) {
    return this._organizationService.inviteUserToOrganization(
      organization_id,
      body,
    );
  }
}
