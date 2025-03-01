import joi from "joi";
import { genders } from "../../../constants.js";
import { isValidDOB } from "../../utils/helpers/isValidDOB.js";

export const userFields = {
  firstName: joi.string().min(3).max(30).messages({
    "string.base": "FirstName should be a type of text.",
    "string.empty": "FirstName cannot be empty.",
    "string.min": "FirstName should have a minimum length of 3 characters.",
    "string.max": "FirstName should have a maximum length of 30 characters.",
    "any.required": "FirstName is required.",
  }),
  lastName: joi.string().min(3).max(30).messages({
    "string.base": "FirstName should be a type of text.",
    "string.empty": "FirstName cannot be empty.",
    "string.min": "FirstName should have a minimum length of 3 characters.",
    "string.max": "FirstName should have a maximum length of 30 characters.",
    "any.required": "FirstName is required.",
  }),
  password: joi.string().messages({
    "string.empty": "Password cannot be empty.",
    "any.required": "Password is required.",
  }),
  confirmPassword: joi.string().valid(joi.ref("password")).messages({
    "any.only": "Passwords do not match.",
    "any.required": "Confirm Password is required.",
  }),
  mobileNumber: joi.string().pattern(/^01[0125][0-9]{8}$/), //
  email: joi.string().email().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email cannot be empty.",
    "any.required": "Email is required.",
  }),
  DOB: joi
    .date()
    .custom(function (value, helpers) {
      const checkDob = isValidDOB(value);
      if (!checkDob) return helpers.error("any.invalid");
      return value;
    })
    .messages({
      "date.base": "Date of Birth should be a valid date.",
      "date.empty": "Date of Birth cannot be empty.",
      "any.required": "Date of Birth is required.",
      "any.invalid": "Invalid date of birth.",
    }),
  isConfirmed: joi.boolean().messages({
    "boolean.base": "isConfirmed should be a boolean value.",
  }),
  gender: joi
    .string()
    .valid(...Object.values(genders))
    .messages({
      "any.only": 'Gender must be either "male" or "female".',
      "string.empty": "Gender cannot be empty.",
      "any.required": "Gender is required.",
    }),
};

export const registerSchema = joi
  .object({
    firstName: userFields.firstName,
    lastName: userFields.lastName,
    email: userFields.email.required(),
    password: userFields.password.required(),
    confirmPassword: userFields.confirmPassword.required(),
    mobileNumber: userFields.mobileNumber.required(),
    DOB: userFields.DOB.required(),
    gender: userFields.gender,
  })
  .required();

export const confirmOtpSchema = joi
  .object({
    email: userFields.email.required(),
    otp: joi.string().required().messages({
      "string.email": "Please enter a valid otp.",
      "string.empty": "otp cannot be empty.",
      "any.required": "otp is required.",
    }),
  })
  .required();

export const forgotPasswordSchema = joi
  .object({
    email: userFields.email.required(),
  })
  .required();

export const loginWithGmailSchema = joi
  .object({
    idToken: joi.string().required().messages({
      "string.empty": "idToken cannot be empty.",
      "any.required": "idToken is required.",
    }),
  })
  .required();

export const newTokenSchema = joi
  .object({
    refreshToken: joi.string().required().messages({
      "string.empty": "refreshToken cannot be empty.",
      "any.required": "refreshToken is required.",
    }),
  })
  .required();

export const loginWithCredentialsSchema = joi
  .object({
    email: userFields.email.required(),
    password: userFields.password.required(),
  })
  .required();

export const resetPasswordSchema = joi
  .object({
    email: userFields.email.required(),
    otp: joi.string().required().messages({
      "string.empty": "otp cannot be empty.",
      "any.required": "otp is required.",
    }),
    newPassword: joi.string().required().messages({
      "string.empty": "Password cannot be empty.",
      "any.required": "Password is required.",
    }),
    confirmNewPassword: joi
      .string()
      .valid(joi.ref("newPassword"))
      .required()
      .messages({
        "any.only": "Passwords do not match.",
        "any.required": "Confirm Password is required.",
      }),
  })
  .required();
