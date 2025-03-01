import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { genders, roles } from "../../../constants.js";

const EmployeesCountType = new GraphQLObjectType({
  name: "EmployeesCount",
  fields: {
    from: { type: GraphQLInt },
    to: { type: GraphQLInt },
  },
});

const MediaType = new GraphQLObjectType({
  name: "MediaType",
  fields: {
    secure_url: { type: GraphQLString },
    public_id: { type: GraphQLString },
  },
});

export const companyData = new GraphQLObjectType({
  name: "companyData",
  fields: {
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    industry: { type: GraphQLString },
    address: { type: GraphQLString },
    employeesCount: { type: EmployeesCountType },
    companyEmail: { type: GraphQLString },
    createdBy: { type: GraphQLString },
    logo: { type: MediaType },
    coverPic: { type: MediaType },
    hrs: { type: new GraphQLList(GraphQLString) },
    bannedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
    legalAttachment: { type: MediaType },
  },
});

export const userData = new GraphQLObjectType({
  name: "userData",
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    mobileNumber: { type: GraphQLString },
    DOB: { type: GraphQLString },
    gender: {
      type: new GraphQLEnumType({
        name: "genderEnumTypes",
        values: {
          female: { value: genders.female },
          male: { value: genders.male },
        },
      }),
    },
    role: {
      type: new GraphQLEnumType({
        name: "roleTypes",
        values: {
          admin: { value: roles.admin },
          user: { value: roles.user },
        },
      }),
    },
    profilePic: { type: MediaType },
    coverPic: { type: MediaType },
  },
});

const AllDataType = new GraphQLObjectType({
  name: "allData",
  fields: {
    users: { type: new GraphQLList(userData) },
    companies: { type: new GraphQLList(companyData) },
  },
});

export const getAllDataResponseType = new GraphQLObjectType({
  name: "getAllDataResponseType",
  fields: {
    message: { type: GraphQLString },
    statusCode: { type: GraphQLInt },
    data: { type: AllDataType },
  },
});

export const ban_Unban_userRequestType = {
  userId: { type: new GraphQLNonNull(GraphQLString) },
  auth: { type: new GraphQLNonNull(GraphQLString) },
};

export const ban_Unban_userResponseType = new GraphQLObjectType({
  name: "ban_Unban_userResponseType",
  fields: {
    message: { type: GraphQLString },
    statusCode: { type: GraphQLInt },
  },
});

export const ban_Unban_CompanyRequestType = {
  companyId: { type: new GraphQLNonNull(GraphQLString) },
  auth: { type: new GraphQLNonNull(GraphQLString) },
};

export const ban_Unban_CompanyResponseType = new GraphQLObjectType({
  name: "ban_Unban_CompanyResponseType",
  fields: {
    message: { type: GraphQLString },
    statusCode: { type: GraphQLInt },
  },
});

export const approveCompanyRequestType = {
  companyId: { type: new GraphQLNonNull(GraphQLString) },
  auth: { type: new GraphQLNonNull(GraphQLString) },
};

export const approveCompanyResponseType = new GraphQLObjectType({
  name: "approveCompanyResponseType",
  fields: {
    message: { type: GraphQLString },
    statusCode: { type: GraphQLInt },
  },
});
