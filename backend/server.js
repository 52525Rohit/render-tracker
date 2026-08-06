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

// Vite's dev port changes run to run and this app is also used from a LAN IP,
// so allow any localhost/127.0.0.1/LAN origin instead of pinning one port.
const localOrigin = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || localOrigin.test(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(dirName, "uploads")));

app.use(projectRoutes);
app.use(cameraRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
