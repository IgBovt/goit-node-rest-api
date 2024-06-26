import User from "../models/user.js";
import {
  createUserSchema,
  updateSubscriptionSchema,
} from "../schemas/userSchemas.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

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

    //CREATE AVATAR URL
    const avatarURL = gravatar.url(
      email,
      { s: "200", r: "x", d: "retro" },
      false
    );
    await User.create({
      email,
      password: passwordHash,
      avatarURL,
    });
    res
      .status(201)
      .send({ user: { email, subscription: "starter", avatarURL } });
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
      { id: user._id, email: user.email, subscription: user.subscription },
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

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send({ message: "Not found" });
    }
    res
      .status(200)
      .send({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  const { id } = req.user;
  const { subscription } = req.body;

  try {
    const { error } = updateSubscriptionSchema.validate({
      subscription,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = await User.findById(id);
    if (!contact) {
      return res.status(404).send({
        message: "Not found",
      });
    }
    const result = await User.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).send({ message: "Not found" });
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
