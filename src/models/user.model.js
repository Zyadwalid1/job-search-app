import { model, Schema } from "mongoose";
import {
  genders,
  otpTypes,
  providers,
  roles,
  sendEmailEvent,
} from "../../constants.js";
import { isValidDOB } from "../utils/helpers/isValidDOB.js";
import { hashText } from "../utils/hashing/hashing.js";
import { encryptText, decryptText } from "../utils/encryption/encryption.js";
import { myEventEmitter } from "../utils/emails/sendEmail.js";
import { otpVerificationTemplate } from "../utils/emails/otpVerifyEmail.js";
import { generate } from "otp-generator";

export const defaultProfile =
  "https://res.cloudinary.com/dm0nt36nw/image/upload/v1740839597/job_search_app/dy49nxkdetcmbzzrpv9r.png";
export const defaultCover =
  "https://res.cloudinary.com/dm0nt36nw/image/upload/v1740839597/job_search_app/mwxhmxqinj461gucjllt.jpg";

const otpSchema = new Schema({
  otpType: {
    type: String,
    enum: [otpTypes.confirmEmail, otpTypes.forgetPassword],
    required: true,
  },
  code: { type: String },
  expiresIn: { type: Date },
});

const UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === providers.system ? true : false;
      },
    },
    mobileNumber: {
      type: String,
    },
    DOB: {
      type: Date,

      validate: {
        validator: function (value) {
          return isValidDOB(value);
        },
        message: (props) => `${props.value} is not a valid date of birth!`,
      },
    },
    gender: {
      type: String,
      enum: [genders.male, genders.female],
      default: genders.male,
    },
    role: {
      type: String,
      enum: [roles.admin, roles.user],
      default: roles.user,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    freezed: {
      type: Boolean,
      default: false,
    },
    bannedAt: {
      type: Date,
    },
    updatedBy: {
      type: String,
      ref: "User",
    },
    changeCredentialTime: {
      type: Date,
    },
    provider: {
      type: String,
      enum: [...Object.values(providers)],
      default: providers.system,
    },
    profilePic: {
      secure_url: { type: String, default: defaultProfile },
      public_id: String,
    },
    coverPic: {
      secure_url: { type: String, default: defaultCover },
      public_id: String,
    },
    OTP: [otpSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("userName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre("save", function (next) {
  try {
    if (this.provider === providers.google) {
      next();
    } else {
      if (!this.firstName && !this.lastName) {
        this.firstName = this.email.split("@")[0];
        this.lastName = "";
      }
      console.log(this.password);
      const hashedPassword = hashText(this.password);
      const encryptedMobile = encryptText(this.mobileNumber);
      if (this.password) {
        this.password = hashedPassword;
      }
      if (this.mobileNumber) {
        this.mobileNumber = encryptedMobile;
      }
      next();
    }
  } catch (error) {
    next(error);
  }
});

UserSchema.post("find", function(docs) {
  docs.forEach(doc => {
    if (doc.mobileNumber) {
      doc.mobileNumber = decryptText(doc.mobileNumber);
    }
  });
});

UserSchema.post("findOne", function(doc) {
  if (doc && doc.mobileNumber) {
    doc.mobileNumber = decryptText(doc.mobileNumber);
  }
});

export const UserModel = model("User", UserSchema);
