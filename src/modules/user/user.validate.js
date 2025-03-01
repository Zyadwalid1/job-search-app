import joi from "joi";
import { genders } from "../../../constants.js";
import { isValidDOB } from "../../utils/helpers/isValidDOB.js";

export const userUpdateFields = {
    firstName: joi.string().min(3).max(30),
    lastName: joi.string().min(3).max(30),
    mobileNumber: joi.string().pattern(/^01[0125][0-9]{8}$/),
    DOB: joi.date().custom((value, helpers) => {
        const checkDob = isValidDOB(value);
        if (!checkDob) return helpers.error("any.invalid");
        return value;
    }),
    gender: joi.string().valid(...Object.values(genders))
};

export const updateUserSchema = joi.object({
    firstName: userUpdateFields.firstName,
    lastName: userUpdateFields.lastName,
    mobileNumber: userUpdateFields.mobileNumber,
    DOB: userUpdateFields.DOB,
    gender: userUpdateFields.gender
}).min(1).required();

export const updatePasswordSchema = joi.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required()
}).required();

export const userIdSchema = joi.object({
    userId: joi.string().hex().length(24).required()
}).required(); 