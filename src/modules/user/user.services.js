import { UserModel } from "../../models/user.model.js";
import { hashText, compareHashedText } from "../../utils/hashing/hashing.js";
import { encryptText, decryptText } from "../../utils/encryption/encryption.js";
import { ErrorClass } from "../../utils/error/ErrorClass.js";
import cloudinary from "../../utils/cloudinary/cloudinary.js";
import { defaultProfile, defaultCover } from "../../models/user.model.js";

export const updateUserService = async (userId, updateData) => {
    // If updating mobile number, encrypt it
    if (updateData.mobileNumber) {
        console.log('Original mobile number:', updateData.mobileNumber);
        try {
            // Try to decrypt first to check if it's already encrypted
            decryptText(updateData.mobileNumber);
        } catch {
            // If decryption fails, it means the number is not encrypted yet
            updateData.mobileNumber = encryptText(updateData.mobileNumber);
        }
        console.log('Final mobile number to store:', updateData.mobileNumber);
    }

    const user = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
    ).select('-password -OTP');

    if (!user) throw new ErrorClass('User not found', 404);
    return user;
};

export const getUserAccountService = async (userId) => {
    const user = await UserModel.findById(userId).select('-password -OTP');
    if (!user) throw new ErrorClass('User not found', 404);
    return user;
};

export const getOtherUserProfileService = async (userId) => {
    const user = await UserModel.findById(userId)
        .select('firstName lastName mobileNumber profilePic coverPic');
    
    if (!user) throw new ErrorClass('User not found', 404);

    console.log('Raw user mobile number:', user.mobileNumber);
    
    // Handle mobile number (both encrypted and unencrypted cases)
    let mobileNumber = null;
    if (user.mobileNumber && typeof user.mobileNumber === 'string') {
        try {
            // Try to decrypt first
            mobileNumber = decryptText(user.mobileNumber);
        } catch {
            // If decryption fails, it might be unencrypted
            mobileNumber = user.mobileNumber;
            
            // Auto-encrypt unencrypted number for future use
            const encrypted = encryptText(user.mobileNumber);
            await UserModel.findByIdAndUpdate(userId, { mobileNumber: encrypted });
        }
    }

    return {
        userName: `${user.firstName} ${user.lastName}`,
        mobileNumber,
        profilePic: user.profilePic,
        coverPic: user.coverPic
    };
};

export const updatePasswordService = async (userId, { oldPassword, newPassword }) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new ErrorClass('User not found', 404);

    const isMatch = compareHashedText({ plainText: oldPassword, hashedValue: user.password });
    if (!isMatch) throw new ErrorClass('Invalid old password', 400);

    user.password = hashText(newPassword);
    user.changeCredentialTime = new Date();
    await user.save();

    return { message: 'Password updated successfully' };
};

export const uploadProfilePicService = async (userId, file) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new ErrorClass('User not found', 404);

    // Delete old profile pic if exists
    if (user.profilePic?.public_id) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    // Upload new profile pic
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
        folder: `jobSearch/users/${userId}/profile`
    });

    user.profilePic = { secure_url, public_id };
    await user.save();

    return user.profilePic;
};

export const uploadCoverPicService = async (userId, file) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new ErrorClass('User not found', 404);

    // Delete old cover pic if exists
    if (user.coverPic?.public_id) {
        await cloudinary.uploader.destroy(user.coverPic.public_id);
    }

    // Upload new cover pic
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
        folder: `jobSearch/users/${userId}/cover`
    });

    user.coverPic = { secure_url, public_id };
    await user.save();

    return user.coverPic;
};

export const deleteProfilePicService = async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new ErrorClass('User not found', 404);

    if (!user.profilePic?.public_id) {
        throw new ErrorClass('No profile picture to delete', 400);
    }

    // Delete from cloudinary
    await cloudinary.uploader.destroy(user.profilePic.public_id);

    // Reset to default profile pic
    user.profilePic = {
        secure_url: defaultProfile,
        public_id: null
    };
    await user.save();

    return { message: 'Profile picture deleted successfully' };
};

export const deleteCoverPicService = async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new ErrorClass('User not found', 404);

    if (!user.coverPic?.public_id) {
        throw new ErrorClass('No cover picture to delete', 400);
    }

    // Delete from cloudinary
    await cloudinary.uploader.destroy(user.coverPic.public_id);

    // Reset to default cover pic
    user.coverPic = {
        secure_url: defaultCover,
        public_id: null
    };
    await user.save();

    return { message: 'Cover picture deleted successfully' };
};

export const softDeleteAccountService = async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new ErrorClass('User not found', 404);

    user.deletedAt = new Date();
    await user.save();

    return { message: 'Account deleted successfully' };
}; 