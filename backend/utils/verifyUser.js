import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/userModel.js";


export const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(errorHandler(403, "bad request no header provided"));
  }

  const authHeader = req.headers.authorization;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next(errorHandler(403, "Bad request: Invalid authorization format"));
  }

  const tokenString = parts[1];
  let accessToken = tokenString;
  let refreshToken = null;

  if (tokenString.includes(",")) {
    const tokens = tokenString.split(",");
    refreshToken = tokens[0];
    accessToken = tokens[1];
  }

  if (!accessToken) {
    if (!refreshToken) {
      return next(errorHandler(401, "You are not authenticated"));
    }

    // Attempt to use legacy refresh token auto-refresh
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        return next(errorHandler(403, "Invalid refresh token"));
      }

      const newAccessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN,
        { expiresIn: "15m" }
      );
      const newRefreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN,
        { expiresIn: "7d" }
      );

      await User.updateOne(
        { _id: user._id },
        { refreshToken: newRefreshToken }
      );

      res.setHeader("x-new-access-token", newAccessToken);
      res.setHeader("x-new-refresh-token", newRefreshToken);

      req.user = decoded.id;
      return next();
    } catch (error) {
      console.log("verifyToken Auto-refresh Error:", error);
      return next(errorHandler(403, "Invalid refresh token"));
    }
  }

  // Verify access token
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    req.user = decoded.id;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // If client is legacy and sent refresh token, attempt auto-refresh on the fly
      if (refreshToken) {
        try {
          const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
          const user = await User.findById(decoded.id);

          if (user && user.refreshToken === refreshToken) {
            const newAccessToken = jwt.sign(
              { id: user._id },
              process.env.ACCESS_TOKEN,
              { expiresIn: "15m" }
            );
            const newRefreshToken = jwt.sign(
              { id: user._id },
              process.env.REFRESH_TOKEN,
              { expiresIn: "7d" }
            );

            await User.updateOne(
              { _id: user._id },
              { refreshToken: newRefreshToken }
            );

            res.setHeader("x-new-access-token", newAccessToken);
            res.setHeader("x-new-refresh-token", newRefreshToken);

            req.user = decoded.id;
            return next();
          }
        } catch (refreshErr) {
          console.error("verifyToken expired token auto-refresh error:", refreshErr);
        }
      }

      // Return 401 and an explicit expired code so client interceptor can catch it
      return res.status(401).json({
        success: false,
        code: "ACCESS_TOKEN_EXPIRED",
        message: "Access token has expired. Please refresh."
      });
    }
    return next(errorHandler(403, "Token is not valid"));
  }
};
