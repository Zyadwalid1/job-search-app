import { UserModel } from "../models/user.model.js";
import { verifyToken } from "../utils/token/token.js";

export const isAuthenticated = async (req, res, next) => {
  const { authorization } = req?.headers;
  if (!authorization) return next(new Error("User is unauthenticated"));
  const token = authorization.split(" ")[1];
  if (!token) return next(new Error("Token is required"));
  const data = verifyToken(token);
  const user = await UserModel.findById(data.id);
  if (!user) return next(new Error("User is not found"));
  req.user = user;
  return next();
};
