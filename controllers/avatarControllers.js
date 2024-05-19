import User from "../models/user.js";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";

export const addAvatar = async (req, res, next) => {
  try {
    const avatarPath = path.resolve("public/avatars", req.file.filename);

    await fs.rename(req.file.path, path.resolve(avatarPath));

    const avatar = await Jimp.read(avatarPath);
    await avatar.resize(250, 250).writeAsync(avatarPath);

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

export const getAvatarByName = async (req, res, next) => {
  const { name } = req.params;
  if (!name) {
    return res.status(404).send({ message: "Not found" });
  }
  try {
    res.sendFile(path.resolve("public/avatars", name));
  } catch (error) {
    next();
  }
};
