import { Router } from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { validate } from "../../middlewares/validateJoiSchema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthorized } from "../../middlewares/isAuthorized.js";
import { roles } from "../../../constants.js";
import { fileUpload, fileValidation } from "../../utils/multer/multer.js";
import {
  acceptApplicationService,
  addJobService,
  applyToJobService,
  deleteJobService,
  getAllApplicationsService,
  getAllJobsService,
  getCompanyJobsService,
  rejectApplicationService,
  updateJobService,
} from "./job.services.js";
import {
  acceptRejectApplicationSchema,
  addJobSchema,
  applyToJobSchema,
  deleteJobSchema,
  filterJobsSchema,
  getApplicationsSchema,
  getCompanyJobsSchema,
  updateJobSchema,
} from "./job.validate.js";

const router = Router({ mergeParams: true });

// 1. Add Job (HR or company owner)
router.post(
  "/",
  asyncHandler(isAuthenticated),
  asyncHandler(validate(addJobSchema)),
  asyncHandler(addJobService)
);

// 2. Update Job (only owner)
router.patch(
  "/:jobId",
  asyncHandler(isAuthenticated),
  asyncHandler(validate(updateJobSchema)),
  asyncHandler(updateJobService)
);

// 3. Delete Job (only company HR)
router.delete(
  "/:jobId",
  asyncHandler(isAuthenticated),
  asyncHandler(validate(deleteJobSchema)),
  asyncHandler(deleteJobService)
);

// 4. Get company jobs with filters
router.get(
  "/company/:companyId",
  asyncHandler(validate(getCompanyJobsSchema)),
  asyncHandler(getCompanyJobsService)
);

// 5. Get all jobs with filters
router.get(
  "/",
  asyncHandler(validate(filterJobsSchema)),
  asyncHandler(getAllJobsService)
);

// 6. Get job applications
router.get(
  "/:jobId/applications",
  asyncHandler(isAuthenticated),
  asyncHandler(validate(getApplicationsSchema)),
  asyncHandler(getAllApplicationsService)
);

// 7. Apply to job
router.post(
  "/:jobId/apply",
  asyncHandler(isAuthenticated),
  asyncHandler(isAuthorized(roles.user)),
  fileUpload(fileValidation.pdf).single("resume"),
  asyncHandler(validate(applyToJobSchema)),
  asyncHandler(applyToJobService)
);

// 8. Accept/Reject application
router.patch(
  "/:jobId/applications/:applicationId/accept",
  asyncHandler(isAuthenticated),
  asyncHandler(validate(acceptRejectApplicationSchema)),
  asyncHandler(acceptApplicationService)
);

router.patch(
  "/:jobId/applications/:applicationId/reject",
  asyncHandler(isAuthenticated),
  asyncHandler(validate(acceptRejectApplicationSchema)),
  asyncHandler(rejectApplicationService)
);

export default router; 