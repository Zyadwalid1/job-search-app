import {
  approveCompanyRequestType,
  approveCompanyResponseType,
  ban_Unban_CompanyRequestType,
  ban_Unban_CompanyResponseType,
  ban_Unban_userRequestType,
  ban_Unban_userResponseType,
  getAllDataResponseType,
} from "./admin.graphql.types.js";
import {
  approveCompanyGraphqlService,
  banOrUnbanCompany,
  banOrUnbanUser,
  getAllDataGraphqlService,
} from "./admin.services.js";

export const adminQueriesController = {
  getAllData: {
    type: getAllDataResponseType,
    resolve: getAllDataGraphqlService,
  },
};

export const adminMutationsController = {
  banUnbanUser: {
    type: ban_Unban_userResponseType,
    args: ban_Unban_userRequestType,
    resolve: banOrUnbanUser,
  },

  banUnbanCompany: {
    type: ban_Unban_CompanyResponseType,
    args: ban_Unban_CompanyRequestType,
    resolve: banOrUnbanCompany,
  },

  approveCompany: {
    type: approveCompanyResponseType,
    args: approveCompanyRequestType,
    resolve: approveCompanyGraphqlService,
  },
};
