import jwt from "jsonwebtoken";
export const generateToken = (payload, expirationTime) => {
  //create access token
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: expirationTime,
  });
  return token;
};
export const verifyToken = (token) => {
  //verify access token
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return payload;
};
