import { UserModel } from "../models/user.model.js";
import { verifyToken } from "../utils/token/token.js";

export const isAuthenticatedGraphql = async (auth) => {
  const userData = verifyToken(auth);
  const user = await UserModel.findById(userData.id);
  if (!user) throw new Error("user is not found");
  if (user.bannedAt)
    throw new Error("you are banned, so cannnot perfom this action");
  return user;
};
