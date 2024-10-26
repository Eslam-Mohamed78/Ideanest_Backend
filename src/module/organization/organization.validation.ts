import * as joi from 'joi';
import { objectId } from '../../constant/joi.validation';

export const createOrganizationSchema = {
  body: joi.object({
    name: joi.string().min(3).required(),
    description: joi.string().min(5).required(),
  }),
};

export const organizationIdSchema = {
  param: objectId.required(),
};

export const updateOrganizationSchema = {
  param: objectId.required(),

  body: joi.object({
    name: joi.string().min(3),
    description: joi.string().min(5),
  }),
};

export const inviteUserToOrganizationSchema = {
  param: objectId.required(),

  body: joi.object({
    user_email: joi.string().email().lowercase().required(),
  }),
};
