import { model, Schema, Types } from "mongoose";

const applicationSchema = new Schema({
  jobId: { type: Types.ObjectId, ref: "Job", required: true },
  userId: { type: Types.ObjectId, ref: "User", required: true },
  resume: {
    secure_url: { 
      type: String, 
      required: true,
      validate: {
        validator: function(value) {
          
          return value.endsWith('.pdf');
        },
        message: 'Resume must be a PDF file'
      }
    },
    public_id: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'viewed', 'in consideration', 'rejected'],
    default: 'pending'
  },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  updatedBy: { type: Types.ObjectId, ref: "User" }
}, { timestamps: true });


applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export const ApplicationModel = model("Application", applicationSchema); 