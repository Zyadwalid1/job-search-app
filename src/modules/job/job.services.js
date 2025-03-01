import { CompanyModel } from "../../models/company.model.js";
import { JobModel } from "../../models/job.model.js";
import { ApplicationModel } from "../../models/application.model.js";
import cloudinary from "../../utils/cloudUpload.js";
import { sendEmail } from "../../utils/emails/sendEmail.js";
import { io } from "../../../index.js";

// 1. Add Job
export const addJobService = async (req, res, next) => {
  const { companyId } = req.body;
  const userId = req.user._id;

  // Check if user is HR or company owner
  const company = await CompanyModel.findById(companyId);
  if (!company) return next(new Error("Company not found"));
  
  if (company.createdBy.toString() !== userId.toString() && 
      !company.hrs.includes(userId)) {
    return next(new Error("Not authorized to add jobs for this company"));
  }

  const job = await JobModel.create({
    ...req.body,
    addedBy: userId
  });

  return res.json({ message: "Job created successfully", data: job });
};

// 2. Update Job
export const updateJobService = async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;
  const updateData = req.body;

  const job = await JobModel.findById(jobId);
  if (!job) return next(new Error("Job not found"));

  const company = await CompanyModel.findById(job.companyId);
  if (!company) return next(new Error("Company not found"));

  // Check if user is company owner
  if (company.createdBy.toString() !== userId.toString()) {
    return next(new Error("Only company owner can update jobs"));
  }

  const updatedJob = await JobModel.findByIdAndUpdate(
    jobId,
    {
      ...updateData,
      updatedBy: userId
    },
    { new: true }
  );

  return res.json({ message: "Job updated successfully", data: updatedJob });
};

// 3. Delete Job
export const deleteJobService = async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await JobModel.findById(jobId);
  if (!job) return next(new Error("Job not found"));

  const company = await CompanyModel.findById(job.companyId);
  if (company.createdBy.toString() !== userId.toString()) {
    return next(new Error("Only company owner can delete jobs"));
  }

  await JobModel.findByIdAndDelete(jobId);
  await ApplicationModel.deleteMany({ jobId });

  return res.json({ message: "Job deleted successfully" });
};

// 4. Get Company Jobs
export const getCompanyJobsService = async (req, res, next) => {
  const { companyId } = req.params;
  const { skip = 0, limit = 10, sort = "-createdAt", companyName } = req.query;

  let query = { companyId };
  if (companyName) {
    const company = await CompanyModel.findOne({ 
      name: { $regex: companyName, $options: "i" } 
    });
    if (company) query.companyId = company._id;
  }

  const jobs = await JobModel.find(query)
    .sort(sort)
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .populate("companyId", "name industry");

  const total = await JobModel.countDocuments(query);

  return res.json({ 
    message: "Jobs retrieved successfully", 
    data: jobs,
    total,
    skip: parseInt(skip),
    limit: parseInt(limit)
  });
};

// 5. Get All Jobs with Filters
export const getAllJobsService = async (req, res, next) => {
  const { 
    skip = 0, 
    limit = 10, 
    sort = "-createdAt",
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills
  } = req.query;

  let query = {};
  if (workingTime) query.workingTime = workingTime;
  if (jobLocation) query.jobLocation = jobLocation;
  if (seniorityLevel) query.seniorityLevel = seniorityLevel;
  if (jobTitle) query.jobTitle = { $regex: jobTitle, $options: "i" };
  if (technicalSkills) {
    query.technicalSkills = { 
      $all: Array.isArray(technicalSkills) ? technicalSkills : [technicalSkills] 
    };
  }

  const jobs = await JobModel.find(query)
    .sort(sort)
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .populate("companyId", "name industry");

  const total = await JobModel.countDocuments(query);

  return res.json({ 
    message: "Jobs retrieved successfully", 
    data: jobs,
    total,
    skip: parseInt(skip),
    limit: parseInt(limit)
  });
};

// 6. Get Job Applications
export const getAllApplicationsService = async (req, res, next) => {
  const { jobId } = req.params;
  const { skip = 0, limit = 10, sort = "-appliedAt" } = req.query;
  const userId = req.user._id;

  const job = await JobModel.findById(jobId);
  if (!job) return next(new Error("Job not found"));

  const company = await CompanyModel.findById(job.companyId);
  if (company.createdBy.toString() !== userId.toString() && 
      !company.hrs.includes(userId)) {
    return next(new Error("Not authorized to view applications"));
  }

  const applications = await ApplicationModel.find({ jobId })
    .sort(sort)
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .populate("userId", "-password -OTP");

  const total = await ApplicationModel.countDocuments({ jobId });

  return res.json({ 
    message: "Applications retrieved successfully", 
    data: applications,
    total,
    skip: parseInt(skip),
    limit: parseInt(limit)
  });
};

// 7. Apply to Job
export const applyToJobService = async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await JobModel.findById(jobId);
  if (!job) return next(new Error("Job not found"));

  // Check if already applied
  const existingApplication = await ApplicationModel.findOne({ jobId, userId });
  if (existingApplication) {
    return next(new Error("You have already applied to this job"));
  }

  // Upload resume to cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `${process.env.CLOUD_APP_FOLDER}/applications/${userId}/resumes`,
    resource_type: "raw"
  });

  const application = await ApplicationModel.create({
    jobId,
    userId,
    resume: { secure_url, public_id }
  });

  // Emit socket event
  const company = await CompanyModel.findById(job.companyId);
  const hrs = [company.createdBy, ...company.hrs];
  hrs.forEach(hrId => {
    io.to(hrId.toString()).emit("newApplication", {
      jobId,
      applicationId: application._id,
      jobTitle: job.jobTitle
    });
  });

  return res.json({ message: "Applied successfully", data: application });
};

// 8. Accept Application
export const acceptApplicationService = async (req, res, next) => {
  const { jobId, applicationId } = req.params;
  const userId = req.user._id;

  const job = await JobModel.findById(jobId);
  if (!job) return next(new Error("Job not found"));

  const company = await CompanyModel.findById(job.companyId);
  if (!company) return next(new Error("Company not found"));

  // Check if user is HR or company owner
  if (company.createdBy.toString() !== userId.toString() && 
      !company.hrs.includes(userId)) {
    return next(new Error("Not authorized to accept applications"));
  }

  const application = await ApplicationModel.findById(applicationId)
    .populate("userId", "email firstName lastName");
  if (!application) return next(new Error("Application not found"));

  if (application.status === 'accepted') {
    return next(new Error("Application is already accepted"));
  }

  application.status = 'accepted';
  application.updatedBy = userId;
  application.updatedAt = new Date();
  await application.save();

  // Send acceptance email
  await sendEmail(
    application.userId.email,
    `Congratulations! Your application for ${job.jobTitle} has been accepted`,
    `
      <h1>Application Accepted</h1>
      <p>Dear ${application.userId.firstName} ${application.userId.lastName},</p>
      <p>We are pleased to inform you that your application for the position of ${job.jobTitle} has been accepted.</p>
      <p>Our HR team will contact you soon with further details.</p>
      <p>Best regards,<br>${company.name} Team</p>
    `
  );

  return res.json({ message: "Application accepted successfully" });
};

// 8. Reject Application
export const rejectApplicationService = async (req, res, next) => {
  const { jobId, applicationId } = req.params;
  const userId = req.user._id;

  const job = await JobModel.findById(jobId);
  if (!job) return next(new Error("Job not found"));

  const company = await CompanyModel.findById(job.companyId);
  if (!company) return next(new Error("Company not found"));

  // Check if user is HR or company owner
  if (company.createdBy.toString() !== userId.toString() && 
      !company.hrs.includes(userId)) {
    return next(new Error("Not authorized to reject applications"));
  }

  const application = await ApplicationModel.findById(applicationId)
    .populate("userId", "email firstName lastName");
  if (!application) return next(new Error("Application not found"));

  if (application.status === 'rejected') {
    return next(new Error("Application is already rejected"));
  }

  application.status = 'rejected';
  application.updatedBy = userId;
  application.updatedAt = new Date();
  await application.save();

  // Send rejection email
  await sendEmail(
    application.userId.email,
    `Update on your application for ${job.jobTitle}`,
    `
      <h1>Application Status Update</h1>
      <p>Dear ${application.userId.firstName} ${application.userId.lastName},</p>
      <p>Thank you for your interest in the ${job.jobTitle} position at ${company.name}.</p>
      <p>After careful consideration, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current needs.</p>
      <p>We appreciate your time and interest in ${company.name}, and we wish you success in your job search.</p>
      <p>Best regards,<br>${company.name} Team</p>
    `
  );

  return res.json({ message: "Application rejected successfully" });
}; 