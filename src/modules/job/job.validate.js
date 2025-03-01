import joi from "joi";
import { jobLocations, seniorityLevel, workingTime } from "../../../constants.js";
import { validateObjectId } from "../../utils/helpers/isValidMongoObjectId.js";

const jobFields = {
  jobTitle: joi.string().min(3).max(100),
  jobLocation: joi.string().valid(...Object.values(jobLocations)),
  workingTime: joi.string().valid(...Object.values(workingTime)),
  seniorityLevel: joi.string().valid(...Object.values(seniorityLevel)),
  jobDescription: joi.string().min(10),
  technicalSkills: joi.array().items(joi.string()),
  softSkills: joi.array().items(joi.string()),
  companyId: joi.string().custom(validateObjectId),
};

const paginationFields = {
  skip: joi.number().min(0),
  limit: joi.number().min(1),
  sort: joi.string(),
};

export const addJobSchema = joi.object({
  jobTitle: jobFields.jobTitle.required(),
  jobLocation: jobFields.jobLocation.required(),
  workingTime: jobFields.workingTime.required(),
  seniorityLevel: jobFields.seniorityLevel.required(),
  jobDescription: jobFields.jobDescription.required(),
  technicalSkills: jobFields.technicalSkills.required(),
  softSkills: jobFields.softSkills,
  companyId: jobFields.companyId.required(),
}).required();

export const updateJobSchema = joi.object({
  jobId: joi.string().custom(validateObjectId).required(),
  jobTitle: jobFields.jobTitle,
  jobLocation: jobFields.jobLocation,
  workingTime: jobFields.workingTime,
  seniorityLevel: jobFields.seniorityLevel,
  jobDescription: jobFields.jobDescription,
  technicalSkills: jobFields.technicalSkills,
  softSkills: jobFields.softSkills,
}).required();

export const deleteJobSchema = joi.object({
  jobId: joi.string().custom(validateObjectId).required(),
}).required();

export const getCompanyJobsSchema = joi.object({
  companyId: joi.string().custom(validateObjectId).required(),
  companyName: joi.string(),
  ...paginationFields,
}).required();

export const filterJobsSchema = joi.object({
  workingTime: jobFields.workingTime,
  jobLocation: jobFields.jobLocation,
  seniorityLevel: jobFields.seniorityLevel,
  jobTitle: jobFields.jobTitle,
  technicalSkills: jobFields.technicalSkills,
  ...paginationFields,
}).required();

export const getApplicationsSchema = joi.object({
  jobId: joi.string().custom(validateObjectId).required(),
  ...paginationFields,
}).required();

export const applyToJobSchema = joi.object({
  jobId: joi.string().custom(validateObjectId).required(),
  file: joi.object({
    fieldname: joi.string().valid("resume").required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().valid("application/pdf").required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().max(5 * 1024 * 1024).required() // 5MB max
  }).required()
}).required();

export const acceptRejectApplicationSchema = joi.object({
  jobId: joi.string().custom(validateObjectId).required(),
  applicationId: joi.string().custom(validateObjectId).required(),
}).required(); 