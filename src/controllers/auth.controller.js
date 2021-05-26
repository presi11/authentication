import User from "../models/User";
import jwt from "jsonwebtoken";
import config from "../config";
import Role from "../models/Role";

export const signUp = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
    });

    if (req.body.roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      newUser.roles = [role._id];
    }

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, config.SECRET_WORD, {
      expiresIn: 86400, // 1 dia
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

};

export const signIn = async (req, res) => {
  const userFound = await User.findOne({ email: req.body.email }).populate(
    "roles"
  );
  if (!userFound) {
    return res.status(400).json({ message: "Usuario no encontrado" });
  } else {
    const isPasswordValid = await User.comparePassword(
      req.body.password,
      userFound.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ token: null, message: "Contraseña incorrecta" });
    } else {
      const token = jwt.sign({ id: userFound._id }, config.SECRET_WORD, {
        expiresIn: 86400,
      });
      res.json({ token });
    }
  }
};
