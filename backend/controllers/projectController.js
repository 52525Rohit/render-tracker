import { Project } from "../models/Project.js";
import { Camera } from "../models/Camera.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    const cameraCount = await Camera.countAll();
    res.json({ message: projects, cameraCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { projectName } = req.body;
    if (!projectName) {
      return res.json({ message: "Please Fill The Project Name", status: 0 });
    }

    const existing = await Project.findByName(projectName);
    if (existing.length) {
      return res.json({ message: "Project Name Already Exists", status: 0 });
    }

    await Project.create(projectName);
    res.json({ message: "Data Created", status: 1 });
  } catch (err) {
    res.status(500).json({ message: err.message, status: 0 });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Project.remove(id);

    if (result.affectedRows <= 0) {
      return res.json({ message: "Data Not Found", status: 0 });
    }
    res.json({ message: "Project Deleted Successfully", status: 1 });
  } catch (err) {
    res.status(500).json({ message: err.message, status: 0 });
  }
};
