import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authCheck = (req, res, next) => {
  //TAKE TOKEN//
  const authorizationHeader = req.headers.authorization;

  //CHECK TOKEN`S EXIST//
  if (!authorizationHeader) {
    return res.status(401).send({ message: "Not authorized" });
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);

  //CHECK BEARER//
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized" });
  }

  //VERIFY TOKEN//
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Not authorized" });
    }
    try {
      const user = await User.findById(decode.id);

      if (!user) {
        return res.status(401).send({ message: "Not authorized" });
      }

      if (user.token !== token) {
        return res.status(401).send({ message: "Not authorized" });
      }

      req.user = {
        id: user._id,
        name: user.email,
      };
      next();
    } catch (error) {
      next(error);
    }
  });
};
