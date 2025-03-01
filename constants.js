import joi from "joi";

export const sendEmailEvent = "sendEmail";

export const genders = {
  male: "Male",
  female: "Female",
};

export const providers = {
  system: "system",
  google: "google",
};

export const roles = {
  user: "User",
  admin: "Admin",
};

export const otpTypes = {
  confirmEmail: "confirmEmail",
  forgetPassword: "forgetPassword",
};

export const jobLocations = {
  onsite: "onsite",
  remotely: "remotely",
  hybrid: "hybrid",
};

export const workingTime = {
  fullTime: "full-time",
  partTime: "part-time",
};
//fresh, **Junior, Mid-Level, Senior,Team-Lead, CTO
export const seniorityLevel = {
  fresh: "fresh",
  junior: "junior",
  midLevel: "Mid-Level",
  senior: "Senior",
  teamLead: "Team-Lead",
  CTO: "CTO",
};

export const fileObject = {
  fieldname: joi.string().required(),
  filename: joi.string().required(),
  path: joi.string().required(),
  size: joi.number().required(),
  destination: joi.string().required(),
  originalname: joi.string().required(),
  encoding: joi.string().required(),
  mimetype: joi.string().required(),
};
