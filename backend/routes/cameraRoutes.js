import { Router } from "express";
import { upload } from "../middleware/multer.js";
import {
  getCameraDetails,
  getViewDetails,
  uploadCamera,
  updateCamera,
  deleteCamera,
} from "../controllers/cameraController.js";

const router = Router();

router.post("/getCameraDetails", getCameraDetails);
router.post("/getViewDetails", getViewDetails);
router.post("/upload", upload.single("imageFile"), uploadCamera);
router.post("/update", upload.single("imageFile"), updateCamera);
router.post("/delete", deleteCamera);

export default router;
