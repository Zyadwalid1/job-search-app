import joi from "joi";

export const fileObject = {
  fieldname: joi.string().required(),
  filename: joi.string().required(),
  path: joi.string().required(),
  size: joi.number().required(),
  destination: joi.string().required(),
  originalname: joi.string().required(),
  encoding: joi.string().required(),
  mimetype: joi.string().required(),
};

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        ...req.params,
        ...req.query,
        file: req.file || req.files || null,
      };
      if (!req.file && !req.files) delete data.file;
      const checkSchema = await schema.validateAsync(data, { abortEarly: false });

      if (checkSchema.error) {
        return next(
          new Error(
            checkSchema.error.details.map((obj) => obj.message).join(", "),
            { cause: 400 }
          )
        );
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
};
