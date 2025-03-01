/**
 *
 * @param {import("express").Response} res
 * @param {Number} status
 * @param {String} message
 * @param {any} data
 * @returns
 */
export const sendResponse = (res, status = 200, message = "", data = null) => {
  if (!data) return res.status(status).json({ status: "Success", message });
  return res.status(status).json({ status: "Success", message, data });
};
