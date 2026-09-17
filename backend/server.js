import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import cameraRoutes from "./routes/cameraRoutes.js";

const dirName = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

const localOrigin =
  /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/;

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        // "https://render-tracker-blush.vercel.app",
        //"https://render-tracker.rohitkumarrawani6.workers.dev",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(dirName, "uploads")));

app.get("/", (req, res) => {
  res.send("Api Running Successfully");
});
app.use(projectRoutes);
app.use(cameraRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
