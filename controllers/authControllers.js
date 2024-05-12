import User from "../models/user.js";
import { createUserSchema } from "../schemas/userSchemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // VALIDATION //
    const { error } = createUserSchema.validate({ email, password });
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    // FIND EMAIL //
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).send({ message: "Email in use" });
    }

    // CREATE USER //
    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: passwordHash,
    });
    res.status(201).send({ user: { email, subscription: "starter" } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // VALIDATION //
    const { error } = createUserSchema.validate({ email, password });
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    // FIND EMAIL //
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    // FIND PASSWORD //
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    // CREATE TOKEN//
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    await User.findByIdAndUpdate(user._id, {
      token,
    });

    res.send({ token, user: { email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
};
