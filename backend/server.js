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
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://rent-a-ride-chi.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin '${origin}' not allowed`));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  exposedHeaders: ["set-cookie"],
  credentials: true,
  optionsSuccessStatus: 200, // Some older browsers choke on 204
};

app.use(cors(corsOptions));

// ✅ Respond to all OPTIONS preflight requests
app.options("*", cors(corsOptions));

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
    console.log("MongoDB connected");

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
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