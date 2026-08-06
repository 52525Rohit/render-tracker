import { Router } from "express";
import { getProjects, createProject, deleteProject } from "../controllers/projectController.js";

const router = Router();

router.get("/getProject", getProjects);
router.post("/createProject", createProject);
router.post("/deleteProject", deleteProject);

export default router;
