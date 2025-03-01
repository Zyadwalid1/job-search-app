import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { validate } from "../../middlewares/validateJoiSchema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadCloudinary } from "../../utils/cloudUpload.js";
import {
  addNewCompanyService,
  deleteCompanyService,
  updateCompanyService,
  getCompanyWithJobsService,
  searchCompanyByNameService,
  uploadCompanyLogoService,
  uploadCompanyCoverService,
  deleteCompanyLogoService,
  deleteCompanyCoverService
} from "./company.services.js";
import {
  addComanySchema,
  deleteComanySchema,
  updateComanySchema,
  uploadLogoSchema,
  uploadCoverPicSchema
} from "./company.validate.js";
import { Router } from "express";

const router = Router();

// Add company
router.post(
  "/register_company",
  asyncHandler(isAuthenticated),
  uploadCloudinary().single("legalAttachment"),
  asyncHandler(validate(addComanySchema)),
  asyncHandler(addNewCompanyService)
);

// Update company data
router.patch(
  "/update_company/:companyId",
  asyncHandler(isAuthenticated),
  asyncHandler(validate(updateComanySchema)),
  asyncHandler(updateCompanyService)
);

// Soft delete company
router.delete(
  "/delete_company/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(validate(deleteComanySchema)),
  asyncHandler(deleteCompanyService)
);

// Search companies by name
router.get(
  "/search",
  asyncHandler(searchCompanyByNameService)
);

// Get company with jobs
router.get(
  "/:companyId",
  asyncHandler(getCompanyWithJobsService)
);

// Upload company logo
router.post(
  "/:companyId/logo",
  asyncHandler(isAuthenticated),
  uploadCloudinary().single("logo"),
  asyncHandler(validate(uploadLogoSchema)),
  asyncHandler(uploadCompanyLogoService)
);

// Upload company cover picture
router.post(
  "/:companyId/cover",
  asyncHandler(isAuthenticated),
  uploadCloudinary().single("coverPic"),
  asyncHandler(validate(uploadCoverPicSchema)),
  asyncHandler(uploadCompanyCoverService)
);

// Delete company logo
router.delete(
  "/:companyId/logo",
  asyncHandler(isAuthenticated),
  asyncHandler(deleteCompanyLogoService)
);

// Delete company cover picture
router.delete(
  "/:companyId/cover",
  asyncHandler(isAuthenticated),
  asyncHandler(deleteCompanyCoverService)
);

export default router;
