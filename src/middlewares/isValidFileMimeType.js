import { fileTypeFromBuffer } from "file-type";
import fs from "fs";

export const isValidFileType = (validTypes = [""]) => {
  return async (req, res, next) => {
    const filePath = req.file.path;
    
    const buffer = fs.readFileSync(filePath);

    const type = await fileTypeFromBuffer(buffer);

    if (!type || !validTypes.includes(type.mime))
      return next(new Error("invalid file mime type"));

    return next();
  };
};
