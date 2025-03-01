import { Router } from "express";
import { validate } from "../../middlewares/validateJoiSchema.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { fileUpload, fileValidation } from "../../utils/multer/multer.js";
import {
    updateUser,
    getUserAccount,
    getOtherUserProfile,
    updatePassword,
    uploadProfilePic,
    uploadCoverPic,
    deleteProfilePic,
    deleteCoverPic,
    softDeleteAccount
} from "./user.controller.js";
import { updateUserSchema, updatePasswordSchema, userIdSchema } from "./user.validate.js";

const router = Router();

router.use(isAuthenticated);

router.route("/")
    .get(getUserAccount)
    .delete(softDeleteAccount);

router.patch("/password", validate(updatePasswordSchema), updatePassword);
router.patch("/update", validate(updateUserSchema), updateUser);

router.get("/profile/:userId", validate(userIdSchema), getOtherUserProfile);

router.route("/profile-pic")
    .post(fileUpload(fileValidation.image).single('image'), uploadProfilePic)
    .delete(deleteProfilePic);

router.route("/cover-pic")
    .post(fileUpload(fileValidation.image).single('image'), uploadCoverPic)
    .delete(deleteCoverPic);

export default router; 