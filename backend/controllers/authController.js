import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Jwt from "jsonwebtoken";

const expireDate = new Date(Date.now() + 3600000);

// ================= SIGN UP =================
export const signUp = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);

    const { username, email, password } = req.body;

    // ✅ validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ✅ hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // ✅ create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isUser: true,
    });

    await newUser.save();

    res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("SIGNUP ERROR:", error);
    next(error);
  }
};

// ================= SIGN IN =================
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ✅ check user
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    // ✅ check password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return next(errorHandler(401, "Wrong credentials"));

    // ✅ tokens
    const accessToken = Jwt.sign(
      { id: validUser._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    const refreshToken = Jwt.sign(
      { id: validUser._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // ✅ save refresh token
    const updatedUser = await User.findByIdAndUpdate(
      validUser._id,
      { refreshToken },
      { new: true }
    );

    const { password: hashedPassword, ...rest } = updatedUser._doc;

    res.status(200).json({
      accessToken,
      refreshToken,
      ...rest,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    next(error);
  }
};

// ================= REFRESH TOKEN =================
export const refreshToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(errorHandler(403, "No header provided"));
    }

    const tokenData = req.headers.authorization.split(" ")[1];
    const refreshToken = tokenData.split(",")[0];

    if (!refreshToken) {
      return next(errorHandler(401, "Not authenticated"));
    }

    const decoded = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const user = await User.findById(decoded.id);

    if (!user) return next(errorHandler(403, "Invalid token"));

    const newAccessToken = Jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    const newRefreshToken = Jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    await User.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.log("REFRESH ERROR:", error);
    next(error);
  }
};

// ================= GOOGLE LOGIN =================
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = Jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN
      );

      const { password, ...rest } = user._doc;

      return res.status(200).json({
        accessToken: token,
        ...rest,
      });
    }

    // ✅ create new user
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const newUser = new User({
      username:
        req.body.name.replace(/\s+/g, "").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email: req.body.email,
      password: hashedPassword,
      profilePicture: req.body.photo,
      isUser: true,
    });

    const savedUser = await newUser.save();

    const token = Jwt.sign(
      { id: savedUser._id },
      process.env.ACCESS_TOKEN
    );

    const { password, ...rest } = savedUser._doc;

    res.status(200).json({
      accessToken: token,
      ...rest,
    });
  } catch (error) {
    console.log("GOOGLE ERROR:", error);
    next(error);
  }
};