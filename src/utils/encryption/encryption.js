import CryptoJS from "crypto-js";

export const encryptText = (text) => {
  const encryptedText = CryptoJS.AES.encrypt(
    text,
    process.env.ENCRYPTION_KEY
  ).toString();
  return encryptedText;
};

export const decryptText = (cypherText) => {
  const decryptedText = CryptoJS.AES.decrypt(
    cypherText,
    process.env.ENCRYPTION_KEY
  ).toString(CryptoJS.enc.Utf8);
  return decryptedText;
};
