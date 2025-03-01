import fs from "fs";
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
// // Manually define __dirname for ESM compatibility
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const upload = (dest) => {
  const storage = diskStorage({
    destination: (req, file, cb) => {
      const userId = req.user._id;
      const filePath = path.join(dest, `users/${userId}`);

      fs.mkdirSync(filePath, { recursive: true });
      cb(null, filePath);
    },
    filename: (req, file, cb) => {
      const fileName = `${nanoid()}__${file.originalname}`;
      cb(null, fileName);
    },
  });
  const uploadFile = multer({ storage });
  return uploadFile;
};
