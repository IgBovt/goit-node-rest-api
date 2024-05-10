import User from "../models/user.js";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const result = await User.create({ email, password });
    res.send(result);
  } catch (error) {
    next(error);
  }
};
