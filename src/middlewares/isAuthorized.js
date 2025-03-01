export const isAuthorized = (roles = [""]) => {
  return (req, res, next) => {
    const { user } = req;
    if (!roles.includes(user.role))
      return next(new Error("user is not authorized to do this!"));

    return next();
  };
};
