import ApiError from "./src/utils/ApiError.js";
import express from "express";
import authRoutes from "./src/Routes/auth.routes.js";
import { questionRoute } from "./src/Routes/question.routes.js";
import answerRoutes from "./src/Routes/answer.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Dynamic CORS configuration supporting Vercel deployments & localhost
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin === process.env.CORS_ORIGIN ||
      origin.endsWith(".vercel.app") ||
      origin.includes("localhost")
    ) {
      return callback(null, origin);
    }
    return callback(null, origin);
  },
  credentials: true
}));

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "DevHive API is running" });
});

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoute);
app.use("/api/answers", answerRoutes);

// global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error(err.stack);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
