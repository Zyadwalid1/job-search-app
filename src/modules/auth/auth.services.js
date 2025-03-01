import { generate } from "otp-generator";
import { otpTypes, providers, sendEmailEvent } from "../../../constants.js";
import { UserModel } from "../../models/user.model.js";
import { compareHashedText, hashText } from "../../utils/hashing/hashing.js";
import { checkUserByEmail } from "../../utils/helpers/checkUser.js";
import { sendResponse } from "../../utils/helpers/globalResHandler.js";
import { myEventEmitter } from "../../utils/emails/sendEmail.js";
import { otpVerificationTemplate, forgotPasswordTemplate } from "../../utils/emails/otpVerifyEmail.js";
import { generateToken } from "../../utils/token/token.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
/**
 * send email with otp for account activation
 * @param {String} email
 * @param {string} otpType
 * @param {String} emailSubject
 * @returns
 */
const sendConfirmOtp = (email, otpType, emailSubject, firstName = '') => {
  //create otp for email confirmation
  // Generate 6-digit numeric OTP
  const otp = generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  });

  // Use different templates based on OTP type
  const emailTemplate = otpType === otpTypes.confirmEmail 
    ? otpVerificationTemplate(otp, firstName)
    : forgotPasswordTemplate(otp, firstName);

  myEventEmitter.emit(
    sendEmailEvent,
    email,
    emailSubject,
    emailTemplate
  );
  //hash otp
  const hashedOtp = hashText(otp);
  //otp expiration time
  const expiresIn = new Date(new Date().getTime() + 10 * 60 * 1000);

  return {
    code: hashedOtp,
    otpType,
    expiresIn,
  };
};

export const registerService = async (req, res, next) => {
  const { email, password, firstName, lastName, DOB, mobileNumber, gender } =
    req.body;
  //check if email already exists
  const user = await UserModel.findOne({ email });
  if (user) return next(new Error("this email already exists"));

  const otpObject = sendConfirmOtp(
    email,
    otpTypes.confirmEmail,
    "Account Verification Email",
    firstName
  );
  const newUser = await UserModel.create({
    email,
    password,
    firstName,
    lastName,
    DOB,
    mobileNumber,
    gender,
    OTP: [otpObject],
  });

  return sendResponse(res, 201, "User registered successfully", newUser);
};

export const confirmOtpService = async (req, res, next) => {
  //get otp from req body
  const { otp, email } = req.body;

  const user = await checkUserByEmail(email, next);
  if (!user.OTP?.length) return next(new Error("otp is invalid"));
  //get user with this otp of type confirmEmail
  for (const item of user.OTP) {
    if (item.otpType == otpTypes.confirmEmail) {
      //compare otps
      const compareOtp = compareHashedText({
        plainText: otp,
        hashedValue: item.code,
      });
      const currentTime = new Date().getTime();
      if (!compareOtp || new Date(item.expiresIn).getTime() < currentTime) {
        return next(new Error("otp is invalid"));
      } else {
        //in case of true >> change isConfirmed to true
        await UserModel.updateOne({ email }, { isConfirmed: true });
        break;
      }
    }
  }

  return sendResponse(res, 200, "Email is confirmed successfully");
};

export const loginWithCredentialsService = async (req, res, next) => {
  const { password, email } = req.body;
  const user = await checkUserByEmail(email, next);

  if (user?.freezed || !user?.isConfirmed)
    return next(new Error("user is inactive", { cause: 400 }));

  const comparePasswords = compareHashedText({
    plainText: password,
    hashedValue: user.password,
  });

  if (!comparePasswords) {
    return next(new Error("Credentials are invalid", { cause: 400 }));
  }

  const accessToken = generateToken(
    { id: user._id, email },
    process.env.ACCESS_EXPIRY_TIME
  );
  const refreshToken = generateToken(
    { id: user._id, email },
    process.env.REFRESH_EXPIRY_TIME
  );
  return sendResponse(res, 200, "Logged in successfully", {
    accessToken,
    refreshToken,
  });
};

export const loginWithGmailService = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    console.log('Received idToken:', idToken ? `length: ${idToken.length}` : 'missing');
    
    const clientId = process.env.CLIENT_ID;
    console.log('Client ID:', clientId ? `configured: ${clientId.substring(0, 10)}...` : 'missing');

    if (!clientId) {
      return next(new Error("Google Client ID is not configured"));
    }

    if (!idToken) {
      return next(new Error("ID Token is required"));
    }

    const client = new OAuth2Client();

    try {
      console.log('Attempting to verify token...');
      const ticket = await client.verifyIdToken({
        idToken,
        audience: [clientId], // Allow an array of valid audience values
        issuer: ['accounts.google.com', 'https://accounts.google.com'] // Verify token is from Google
      });
      
      console.log('Token verified successfully');
      const userData = ticket.getPayload();
      console.log('User data retrieved:', userData ? `email: ${userData.email}` : 'failed');

      if (!userData) {
        return next(new Error("Failed to get user data from token"));
      }

      const { email_verified, email, name, picture, family_name, given_name } = userData;
      if (!email_verified) return next(new Error("Email not verified"));

      // Check if user exists with this email (regardless of provider)
      let user = await UserModel.findOne({ email });

      if (user) {
        // Update user's Google-specific information
        user.provider = providers.google;
        user.profilePic = { secure_url: picture, public_id: null };
        user.firstName = user.firstName || given_name || name?.split(' ')[0] || '';
        user.lastName = user.lastName || family_name || name?.split(' ')[1] || '';
        await user.save();

        const accessToken = generateToken(
          { id: user._id, email },
          process.env.ACCESS_EXPIRY_TIME
        );
        const refreshToken = generateToken(
          { id: user._id, email },
          process.env.REFRESH_EXPIRY_TIME
        );
        return sendResponse(res, 200, "Logged in with Google successfully", {
          accessToken,
          refreshToken,
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePic: user.profilePic
          }
        });
      }

      // Create new user if doesn't exist
      const newUser = await UserModel.create({
        email,
        firstName: given_name || name?.split(' ')[0] || '',
        lastName: family_name || name?.split(' ')[1] || '',
        profilePic: { secure_url: picture, public_id: null },
        isConfirmed: true,
        provider: providers.google,
      });

      const accessToken = generateToken(
        { id: newUser._id, email },
        process.env.ACCESS_EXPIRY_TIME
      );
      const refreshToken = generateToken(
        { id: newUser._id, email },
        process.env.REFRESH_EXPIRY_TIME
      );
      return sendResponse(res, 200, "Signed up with Google successfully", {
        accessToken,
        refreshToken,
        user: {
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          profilePic: newUser.profilePic
        }
      });

    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return next(new Error(`Failed to verify Google token: ${verifyError.message}`));
    }
  } catch (error) {
    console.error('Google auth error:', error);
    return next(new Error(`Google authentication failed: ${error.message}`));
  }
};

export const forgotPasswordService = async (req, res, next) => {
  const { email } = req.body;
  //this function handles case of notFound user
  const user = await checkUserByEmail(email);

  const otpObject = sendConfirmOtp(
    email,
    otpTypes.forgetPassword,
    "Reset Password Email",
    user.firstName
  );

  await UserModel.findByIdAndUpdate(user._id, {
    OTP: [otpObject],
  });
  return sendResponse(
    res,
    201,
    "OTP is sent to your email, use it to be able reset your password"
  );
};

export const resetPasswordService = async (req, res, next) => {
  const { otp, newPassword, email } = req.body;
  const user = await checkUserByEmail(email, next);
  if (!user.OTP?.length) return next(new Error("otp is invalid"));
  //get user with this otp of type forgetPassword
  for (const item of user.OTP) {
    if (item.otpType == otpTypes.forgetPassword) {
      //compare otps
      const compareOtp = compareHashedText({
        plainText: otp,
        hashedValue: item.code,
      });
      const currentTime = new Date().getTime();
      if (!compareOtp || new Date(item.expiresIn).getTime() < currentTime) {
        return next(new Error("otp is invalid", { cause: 400 }));
      } else {
        user.password = newPassword;
        user.changeCredentialTime = new Date();
        await user.save();
        break;
      }
    }
  }
  return sendResponse(res, 200, "password reset successfully");
};

export const getNewAccessToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  const decodedToken = jwt.decode(refreshToken);
  //get user
  const user = await checkUserByEmail(decodedToken.email);

  const compareTimes =
    user.changeCredentialTime.getTime() > decodedToken.iat * 1000; //convert it to milliseconds;

  if (compareTimes) {
    return next(new Error("you must login first", { cause: 404 }));
  }
  const accessToken = generateToken(
    { id: user._id, email: decodedToken.email },
    process.env.ACCESS_EXPIRY_TIME
  );
  return sendResponse(res, 200, "New Access Token generated successfully", {
    accessToken,
  });
};
