import { model, Schema, Types } from "mongoose";
import { jobLocations, seniorityLevel, workingTime } from "../../constants.js";
import { ApplicationModel } from "./application.model.js";

const JobSchema = new Schema({
  jobTitle: {
    type: String,
  },
  jobLocation: {
    type: String,
    enum: [jobLocations.onsite, jobLocations.hybrid, jobLocations.remotely],
  },
  workingTime: {
    type: String,
    enum: [workingTime.fullTime, workingTime.partTime],
  },
  seniorityLevel: {
    type: String,
    enum: [
      seniorityLevel.fresh,
      seniorityLevel.junior,
      seniorityLevel.midLevel,
      seniorityLevel.senior,
      seniorityLevel.CTO,
    ],
  },
  jobDescription: {
    type: String,
  },
  technicalSkills: [{ type: String }],
  softSkills: [{ type: String }],
  addedBy: { type: Types.ObjectId, ref: "User" },
  updatedBy: { type: Types.ObjectId, ref: "User" },
  closed: { type: Boolean, default: false },
  companyId: { type: Types.ObjectId, ref: "Company" },
}, { timestamps: true });

JobSchema.pre('remove', async function(next) {
  try {
    await ApplicationModel.deleteMany({ jobId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

export const JobModel = model("Job", JobSchema);
