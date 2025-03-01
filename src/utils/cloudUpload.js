import { v2 as cloudinary } from "cloudinary";
import multer, { diskStorage } from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadCloudinary = () => {
  const storage = diskStorage({}); //the post images are temporarily kept in temp folder
  const uploadFile = multer({ storage });
  return uploadFile;
};

export default cloudinary;
