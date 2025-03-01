import { default as joi, default as Joi } from "joi";
import { fileObject } from "../../../constants.js";
import { UserModel } from "../../models/user.model.js";
import { validateObjectId } from "../../utils/helpers/isValidMongoObjectId.js";

const checkCompanyName = async (value) => {
  const user = await UserModel.findOne({ name: value });
  if (user) throw new Joi.ValidationError("this name already exists");
};

const checkCompanyEmail = async (value) => {
  const user = await UserModel.findOne({ email: value });
  if (user) throw new Joi.ValidationError("this email already exists");
};

const compantFields = {
  name: joi.string().external(checkCompanyName),
  description: joi.string(),
  industry: joi.string(),
  address: joi.string(),
  employeesCount: joi.string(), // 20,40
  companyEmail: joi.string().email().custom(checkCompanyEmail),
  createdBy: joi.string().custom(validateObjectId), //company owner
  approvedByAdmin: joi.boolean(),
  hrs: joi.array().items(joi.string().custom(validateObjectId)),
};

export const addComanySchema = joi
  .object({
    name: compantFields.name.required(),
    description: compantFields.description,
    industry: compantFields.industry,
    address: compantFields.address.required(),
    employeesCount: compantFields.employeesCount,
    companyEmail: compantFields.companyEmail.required(),
    file: joi
      .object({
        ...fileObject,
        fieldname: joi.string().valid("legalAttachment"),
      })
      .required(),
  })
  .required();

export const updateComanySchema = joi
  .object({
    companyId: joi.string().required(),
    name: joi.string(),
    description: compantFields.description,
    industry: compantFields.industry,
    address: compantFields.address,
    employeesCount: compantFields.employeesCount,
    companyEmail: joi.string(),
    hrs: compantFields.hrs
  })
  .required();

export const uploadLogoSchema = joi
  .object({
    companyId: joi.string().custom(validateObjectId).required(),
    file: joi.object({
      ...fileObject,
      fieldname: joi.string().valid("logo"),
    }),
  })
  .required();

export const uploadCoverPicSchema = joi
  .object({
    companyId: joi.string().custom(validateObjectId).required(),
    file: joi.object({
      ...fileObject,
      fieldname: joi.string().valid("coverPic"),
    }),
  })
  .required();

export const deleteComanySchema = joi.object({
  id: joi.string().required(),
});
