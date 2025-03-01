import { asyncHandler } from "../../utils/error/asyncHandler.js";
import { 
    updateUserService,
    getUserAccountService,
    getOtherUserProfileService,
    updatePasswordService,
    uploadProfilePicService,
    uploadCoverPicService,
    deleteProfilePicService,
    deleteCoverPicService,
    softDeleteAccountService
} from "./user.services.js";

export const updateUser = asyncHandler(async (req, res) => {
    const user = await updateUserService(req.user._id, req.body);
    return res.json({ message: "User updated successfully", user });
});

export const getUserAccount = asyncHandler(async (req, res) => {
    const user = await getUserAccountService(req.user._id);
    return res.json({ user });
});

export const getOtherUserProfile = asyncHandler(async (req, res) => {
    const profile = await getOtherUserProfileService(req.params.userId);
    return res.json({ profile });
});

export const updatePassword = asyncHandler(async (req, res) => {
    const result = await updatePasswordService(req.user._id, req.body);
    return res.json(result);
});

export const uploadProfilePic = asyncHandler(async (req, res) => {
    const profilePic = await uploadProfilePicService(req.user._id, req.file);
    return res.json({ message: "Profile picture uploaded successfully", profilePic });
});

export const uploadCoverPic = asyncHandler(async (req, res) => {
    const coverPic = await uploadCoverPicService(req.user._id, req.file);
    return res.json({ message: "Cover picture uploaded successfully", coverPic });
});

export const deleteProfilePic = asyncHandler(async (req, res) => {
    const result = await deleteProfilePicService(req.user._id);
    return res.json(result);
});

export const deleteCoverPic = asyncHandler(async (req, res) => {
    const result = await deleteCoverPicService(req.user._id);
    return res.json(result);
});

export const softDeleteAccount = asyncHandler(async (req, res) => {
    const result = await softDeleteAccountService(req.user._id);
    return res.json(result);
}); 