import { roles } from "../../../constants.js";
import { CompanyModel } from "../../models/company.model.js";
import { sendResponse } from "../../utils/helpers/globalResHandler.js";
import cloudinary from "./../../utils/cloudUpload.js";

export const addNewCompanyService = async (req, res, next) => {
  const { body, file, user } = req;
  const { name, companyEmail, description, industry, employeesCount, address } =
    body;
  
  // Check if company name or email exists
  const existingCompany = await CompanyModel.findOne({
    $or: [{ name }, { companyEmail }],
    deletedAt: { $exists: false }
  });
  
  if (existingCompany) {
    return next(new Error("Company name or email already exists"));
  }

  const empCount = employeesCount.split(",");
  let image;
  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.CLOUD_APP_FOLDER}/companies/legalAttachments`,
      }
    );
    image = { secure_url, public_id };
  }

  const companyData = {
    name,
    companyEmail,
    description,
    industry,
    employeesCount: { from: empCount[0], to: empCount[1] },
    address,
    createdBy: user._id,
  };

  if (image?.secure_url) {
    companyData.legalAttachment = image;
  }

  const company = await CompanyModel.create(companyData);
  
  return sendResponse(
    res,
    201,
    "Company account created successfully",
    company
  );
};

export const updateCompanyService = async (req, res, next) => {
  const { user } = req;
  const { companyId } = req.params;
  const { name, description, industry, employeesCount, address, companyEmail } =
    req.body;
  let empCount = [];
  if (employeesCount) {
    empCount = employeesCount.split(",");
  }
  const company = await CompanyModel.findById(companyId);
  if (!company) return next(new Error("Company not found"));
  if (company.bannedAt) return next(new Error("Company is banned"));
  if (company.deletedAt) return next(new Error("Company is soft-deleted"));
  if (user._id.toString() !== company.createdBy.toString())
    return next(new Error("Only company owner can update data"));

  const updatedCompany = await CompanyModel.findByIdAndUpdate(
    companyId,
    {
      name,
      description,
      industry,
      employeesCount: empCount.length
        ? { from: empCount[0], to: empCount[1] }
        : company.employeesCount,
      address,
      companyEmail,
    },
    { new: true }
  );

  return sendResponse(
    res,
    200,
    "company data updated successfully",
    updatedCompany
  );
};

export const deleteCompanyService = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  const company = await CompanyModel.findById(id);
  if (!company) return next(new Error("company is not found"));
  if (company.bannedAt) return next(new Error("company is banned"));
  if (company.deletedAt) return next(new Error("company is soft-deleted"));
  if (
    user._id.toString() !== company.createdBy.toString() ||
    user.role !== roles.admin
  )
    return next(new Error("you cannot delete this company."));

  company.deletedAt = new Date().getTime();
  await company.save();
  return sendResponse(res, 200, "company is soft-deleted successfully");
};

export const getCompanyWithJobsService = async (req, res, next) => {
  const { companyId } = req.params;
  
  const company = await CompanyModel.findById(companyId)
    .populate({
      path: 'jobs',
      select: 'jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills closed'
    });
  
  if (!company) {
    return next(new Error("Company not found"));
  }

  return sendResponse(res, 200, "Company retrieved successfully", company);
};

export const searchCompanyByNameService = async (req, res, next) => {
  const { name } = req.query;
  
  if (!name) {
    return next(new Error("Search query 'name' is required"));
  }

  const companies = await CompanyModel.find({
    name: { $regex: name, $options: 'i' },
    deletedAt: { $exists: false },
    bannedAt: { $exists: false }
  }).select('name description industry address employeesCount companyEmail logo');

  return sendResponse(res, 200, "Companies retrieved successfully", companies);
};

export const uploadCompanyLogoService = async (req, res, next) => {
  const { companyId } = req.params;
  const { user, file } = req;

  const company = await CompanyModel.findById(companyId);
  if (!company) return next(new Error("Company not found"));
  if (company.bannedAt) return next(new Error("Company is banned"));
  if (company.deletedAt) return next(new Error("Company is soft-deleted"));
  if (user._id.toString() !== company.createdBy.toString())
    return next(new Error("Only company owner can upload logo"));

  // Delete old logo if exists
  if (company.logo?.public_id) {
    await cloudinary.uploader.destroy(company.logo.public_id);
  }

  // Upload new logo
  const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
    folder: `${process.env.CLOUD_APP_FOLDER}/companies/${companyId}/logo`
  });

  company.logo = { secure_url, public_id };
  await company.save();

  return sendResponse(res, 200, "Company logo uploaded successfully", company.logo);
};

export const uploadCompanyCoverService = async (req, res, next) => {
  const { companyId } = req.params;
  const { user, file } = req;

  const company = await CompanyModel.findById(companyId);
  if (!company) return next(new Error("Company not found"));
  if (company.bannedAt) return next(new Error("Company is banned"));
  if (company.deletedAt) return next(new Error("Company is soft-deleted"));
  if (user._id.toString() !== company.createdBy.toString())
    return next(new Error("Only company owner can upload cover picture"));

  // Delete old cover if exists
  if (company.coverPic?.public_id) {
    await cloudinary.uploader.destroy(company.coverPic.public_id);
  }

  // Upload new cover
  const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
    folder: `${process.env.CLOUD_APP_FOLDER}/companies/${companyId}/cover`
  });

  company.coverPic = { secure_url, public_id };
  await company.save();

  return sendResponse(res, 200, "Company cover picture uploaded successfully", company.coverPic);
};

export const deleteCompanyLogoService = async (req, res, next) => {
  const { companyId } = req.params;
  const { user } = req;

  const company = await CompanyModel.findById(companyId);
  if (!company) return next(new Error("Company not found"));
  if (company.bannedAt) return next(new Error("Company is banned"));
  if (company.deletedAt) return next(new Error("Company is soft-deleted"));
  if (user._id.toString() !== company.createdBy.toString())
    return next(new Error("Only company owner can delete logo"));

  if (!company.logo?.public_id) {
    return next(new Error("No logo to delete"));
  }

  // Delete from cloudinary
  await cloudinary.uploader.destroy(company.logo.public_id);

  // Remove logo
  company.logo = undefined;
  await company.save();

  return sendResponse(res, 200, "Company logo deleted successfully");
};

export const deleteCompanyCoverService = async (req, res, next) => {
  const { companyId } = req.params;
  const { user } = req;

  const company = await CompanyModel.findById(companyId);
  if (!company) return next(new Error("Company not found"));
  if (company.bannedAt) return next(new Error("Company is banned"));
  if (company.deletedAt) return next(new Error("Company is soft-deleted"));
  if (user._id.toString() !== company.createdBy.toString())
    return next(new Error("Only company owner can delete cover picture"));

  if (!company.coverPic?.public_id) {
    return next(new Error("No cover picture to delete"));
  }

  // Delete from cloudinary
  await cloudinary.uploader.destroy(company.coverPic.public_id);

  // Remove cover pic
  company.coverPic = undefined;
  await company.save();

  return sendResponse(res, 200, "Company cover picture deleted successfully");
};
