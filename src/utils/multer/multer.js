import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";

export const fileValidation = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    pdf: ['application/pdf'],
    video: ['video/mp4']
};

export const fileUpload = (allowedValidations = []) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const folderName = `uploads/${req.user._id}`;
            fs.mkdirSync(folderName, { recursive: true });
            cb(null, folderName);
        },
        filename: (req, file, cb) => {
            const uniqueFileName = `${nanoid()}_${file.originalname}`;
            cb(null, uniqueFileName);
        }
    });

    function fileFilter(req, file, cb) {
        if (allowedValidations.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file format"), false);
        }
    }

    return multer({ storage, fileFilter });
}; 