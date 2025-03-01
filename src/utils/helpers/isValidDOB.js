/**
 * check if DOB is less than current time and user age to be at least 18 years old
 * @param {Date} dob
 */
export const isValidDOB = (dob = new Date()) => {
  if (!dob) return false;

  const userDob = dob.getTime();
  const currentTime = new Date().getTime();

  const diff = currentTime - userDob;
  //get difference between current date and user birth date in milliseconds and convert it to years
  const formattedDiff = diff / 1000 / 60 / 60 / 24 / 365;

  return formattedDiff >= 18;
};
