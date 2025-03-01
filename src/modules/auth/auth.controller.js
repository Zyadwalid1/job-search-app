import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  confirmOtpService,
  forgotPasswordService,
  getNewAccessToken,
  loginWithCredentialsService,
  loginWithGmailService,
  registerService,
  resetPasswordService,
} from "./auth.services.js";
import { validate } from "../../middlewares/validateJoiSchema.js";
import {
  confirmOtpSchema,
  forgotPasswordSchema,
  loginWithCredentialsSchema,
  loginWithGmailSchema,
  newTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validate.js";

const router = Router();

//register
router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(registerService)
);
//confirm otp
router.post(
  "/confirm_otp",
  validate(confirmOtpSchema),
  asyncHandler(confirmOtpService)
);

//login with email & password
router.post(
  "/login_credentials",
  validate(loginWithCredentialsSchema),
  asyncHandler(loginWithCredentialsService)
);

//google login & signup
router.post(
  "/google_auth",
  validate(loginWithGmailSchema),
  asyncHandler(loginWithGmailService)
);

//handle forget password endpoint
router.post(
  "/forgot_password",
  validate(forgotPasswordSchema),
  asyncHandler(forgotPasswordService)
);

//handle reset password endpoint
router.post(
  "/reset_password",
  validate(resetPasswordSchema),
  asyncHandler(resetPasswordService)
);

//get new access token
router.post(
  "/refresh_token",
  validate(newTokenSchema),
  asyncHandler(getNewAccessToken)
);

export default router;
