import { GraphQLString } from "graphql";
import { getAllDataResponseType } from "./admin.graphql.types.js";
import { UserModel } from "../../models/user.model.js";
import { CompanyModel } from "../../models/company.model.js";
import { isAuthenticatedGraphql } from "../../graphQl_middlewares/isAuthenticated.js";
import { roles } from "../../../constants.js";

/**
 * check if company exists
 * @param {String} companyId
 * @returns Promise<Mongodb Document>
 */
const checkCompany = async (companyId) => {
  const company = await CompanyModel.findOne({
    _id: companyId,
    deletedAt: { $exists: false },
  });
  if (!company) throw new Error("company is not found");

  return company;
};
/**
 * check if current user's role is admin
 * @param {String} auth
 */
const isAdmin = async (auth) => {
  const currentUser = await isAuthenticatedGraphql(auth);
  if (currentUser.role !== roles.admin)
    throw new Error("you are not authenticated to perfom this action");
};

export const getAllDataGraphqlService = async (parent, args) => {
  const user = await isAuthenticatedGraphql(args.auth);
  if (user.role !== roles.admin) {
    throw new Error("Unauthorized: Only admins can access this data");
  }

  const data = await Promise.all([
    UserModel.find()
      .select(
        "firstName lastName email profilePic coverPic gender DOB mobileNumber role bannedAt deletedAt"
      )
      .lean(),
    CompanyModel.find()
      .select(
        "name description industry address employeesCount companyEmail createdBy logo coverPic hrs bannedAt deletedAt legalAttachment isApproved"
      )
      .lean(),
  ]);

  return {
    message: "Success",
    statusCode: 200,
    data: { users: data[0], companies: data[1] },
  };
};

export const banOrUnbanUser = async (parent, args) => {
  const admin = await isAuthenticatedGraphql(args.auth);
  if (admin.role !== roles.admin) {
    throw new Error("Unauthorized: Only admins can ban/unban users");
  }

  const user = await UserModel.findById(args.userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.bannedAt) {
    user.bannedAt = undefined;
    await user.save();
    return {
      message: "User has been unbanned successfully",
      statusCode: 200,
    };
  } else {
    
    user.bannedAt = new Date();
    await user.save();
    return {
      message: "User has been banned successfully",
      statusCode: 200,
    };
  }
};

export const banOrUnbanCompany = async (parent, args) => {
  // Check if admin
  const admin = await isAuthenticatedGraphql(args.auth);
  if (admin.role !== roles.admin) {
    throw new Error("Unauthorized: Only admins can ban/unban companies");
  }

  // Find company
  const company = await CompanyModel.findById(args.companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  // Toggle ban status
  if (company.bannedAt) {
    // If company is banned, unban them
    company.bannedAt = undefined;
    await company.save();
    return {
      message: "Company has been unbanned successfully",
      statusCode: 200,
    };
  } else {
    // If company is not banned, ban them
    company.bannedAt = new Date();
    await company.save();
    return {
      message: "Company has been banned successfully",
      statusCode: 200,
    };
  }
};

export const approveCompanyGraphqlService = async (parent, args) => {
  // Check if admin
  const admin = await isAuthenticatedGraphql(args.auth);
  if (admin.role !== roles.admin) {
    throw new Error("Unauthorized: Only admins can approve companies");
  }

  // Find company
  const company = await CompanyModel.findById(args.companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  // Check if company is already approved
  if (company.isApproved) {
    throw new Error("Company is already approved");
  }

  // Approve company
  company.isApproved = true;
  await company.save();

  return {
    message: "Company has been approved successfully",
    statusCode: 200,
  };
};
