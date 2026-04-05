import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Fix __dirname (ES module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ FORCE LOAD .env
dotenv.config({ path: path.join(__dirname, ".env") });

// ✅ DEBUG (check env loaded)
console.log("ENV CHECK:", process.env.MONGODB_URI);

// ✅ Routes
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import vendorRoute from "./routes/venderRoute.js";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";
import locationRoute from "./routes/locationRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// ✅ Routes
app.use("*", cloudinaryConfig);

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/vendor", vendorRoute);
app.use("/api/location", locationRoute);

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.log("ERROR:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ✅ MongoDB connect + Start Server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use.`);
      }
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });