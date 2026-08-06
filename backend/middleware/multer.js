import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const dirName = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(dirName, "..", "uploads")),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage });
