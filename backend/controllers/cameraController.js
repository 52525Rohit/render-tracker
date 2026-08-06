import { Camera } from "../models/Camera.js";
import { Project } from "../models/Project.js";

export const getCameraDetails = async (req, res) => {
  try {
    const { projectId } = req.body;
    const cameras = await Camera.findByProject(projectId);
    res.json({ message: cameras });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getViewDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const camera = await Camera.findById(id);
    res.json({ message: camera });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadCamera = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ message: "Please Fill The Details", status: 0 });
    }

    const { projectid: projectId, cameraName, totalFrame, randerFrame, imageName = "" } = req.body;

    const existing = await Camera.findByName(cameraName);
    if (existing.length) {
      return res.json({ message: "Data Already Exists", status: 0 });
    }

    await Camera.create({
      projectId,
      imageName,
      imageUrl: req.file.filename,
      cameraName,
      totalFrame,
      randerFrame,
    });
    await Project.touchModified(projectId);

    res.json({ message: "File uploaded successfully!", status: 1 });
  } catch (err) {
    res.status(500).json({ message: err.message, status: 0 });
  }
};

export const updateCamera = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ message: "Please Update The Details", status: 0 });
    }

    const { id, cameraName, totalFrame, randerFrame } = req.body;
    const result = await Camera.update(id, {
      cameraName,
      totalFrame,
      randerFrame,
      imageUrl: req.file.filename,
    });

    if (result.affectedRows <= 0) {
      return res.json({ message: "Data Not Update", status: 0 });
    }

    const [camera] = await Camera.findById(id);
    await Project.touchModified(camera.project_id);

    res.json({ message: "Data Updated successfully", id: camera.id, status: 1 });
  } catch (err) {
    res.status(500).json({ message: err.message, status: 0 });
  }
};

export const deleteCamera = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Camera.remove(id);

    if (result.affectedRows <= 0) {
      return res.json({ message: "Data Not Found", status: 0 });
    }
    res.json({ message: "Data Deleted Successfully", status: 1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
