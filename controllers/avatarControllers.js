export const addAvatar = async (req, res, next) => {
  try {
    res.send("AVATAR");
  } catch (error) {
    next();
  }
};
