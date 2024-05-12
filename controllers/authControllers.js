import User from "../models/user.js";
import { createUserSchema } from "../schemas/userSchemas.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { error } = createUserSchema.validate({ email, password });
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).send({ message: "Email in use" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, password: passwordHash });

    res.status(201).send({ user: email });
  } catch (error) {
    next(error);
  }
};
