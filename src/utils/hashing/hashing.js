import bcrypt from "bcrypt";

export const hashText = (text) => {
  const hashedValue = bcrypt.hashSync(text, Number(process.env.SALT_ROUNDS));
  return hashedValue;
};
export const compareHashedText = ({ plainText, hashedValue }) => {
  const isValid = bcrypt.compareSync(plainText, hashedValue);
  return isValid;
};
