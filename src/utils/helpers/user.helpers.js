import { CompanyModel } from "../../models/company.model.js";

// Helper function to check if user is HR or company owner
export const isHROrOwner = async (userId) => {
  const company = await CompanyModel.findOne({
    $or: [{ createdBy: userId }, { hrs: userId }]
  });
  return !!company;
};

// Helper function to check if user is a regular user
export const isRegularUser = async (userId) => {
  const isHR = await isHROrOwner(userId);
  return !isHR;
}; 