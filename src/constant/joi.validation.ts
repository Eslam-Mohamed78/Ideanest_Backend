import * as joi from 'joi';
import { Types } from 'mongoose';
export const objectId = joi.string().custom((value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message({ custom: 'Invalid objectId!' });
});

export const searchAndPaginationSchema = {
  query: joi
    .object({
      search: joi.string().allow(''),
      page: joi.number().integer().min(1).allow(''),
      limit: joi.number().integer().allow(''),
      paginated: joi.boolean().allow(''),
    })
    .required(),
};
