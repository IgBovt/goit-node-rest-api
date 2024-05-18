import User from "../models/user.js";
import * as fs from "node:fs/promises";
import path from "node:path";

export const addAvatar = async (req, res, next) => {
  try {
    console.log(req.file);
    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: req.file.filename,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ message: "Not found" });
    }
    res.send(user);
  } catch (error) {
    next();
  }
};

export const getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send({ message: "Not found" });
    }
    if (!user.avatarURL) {
      return res.status(404).send({ message: "Not found" });
    }
    res.sendFile(path.resolve("public/avatars", user.avatarURL));
  } catch (error) {
    next();
  }
};
