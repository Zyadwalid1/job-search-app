import { model, Schema, Types } from "mongoose";
import { JobModel } from "./job.model.js";
import { ApplicationModel } from "./application.model.js";

export const companySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    industry: {
      type: String,
    },
    address: {
      type: String,
    },
    employeesCount: {
      from: { type: Number },
      to: { type: Number },
    },
    companyEmail: { type: String, unique: true },
    createdBy: { type: Types.ObjectId, ref: "User" },
    logo: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    coverPic: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    hrs: [{ type: Types.ObjectId, ref: "User" }],
    bannedAt: { type: Date },
    deletedAt: { type: Date },
    legalAttachment: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


companySchema.pre('remove', async function(next) {
  try {
    const jobs = await JobModel.find({ companyId: this._id });
    const jobIds = jobs.map(job => job._id);
    await ApplicationModel.deleteMany({ jobId: { $in: jobIds } });
    await JobModel.deleteMany({ companyId: this._id });
    
    next();
  } catch (error) {
    next(error);
  }
});

companySchema.virtual('jobs', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'companyId'
});

companySchema.set('toObject', { virtuals: true });
companySchema.set('toJSON', { virtuals: true });

export const CompanyModel = model("Company", companySchema);
