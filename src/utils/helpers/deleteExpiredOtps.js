import { UserModel } from "../../models/user.model.js";

/**
 * Delete expired otps every 6 hours
 * @returns {Promise<any>} Count of deleted otps which are expired
 */
const deleteExpiredOtps = async () => {
  try {
    const currentTime = new Date();

    const result = await UserModel.updateMany(
      {
        "OTP.expiresIn": { $lt: currentTime },
      },
      { $pull: { OTP: { expiresIn: { $lt: currentTime } } } }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

//run the function once the app is initiated
(async () => {
  await deleteExpiredOtps();
})();

//run the function every 6 hours
setInterval(async () => {
  await deleteExpiredOtps();
}, 6 * 60 * 60 * 1000);
