import { api } from "./client";

export const getProjects = () => api.get("/getProject");

export const createProject = (projectName) =>
  api.post("/createProject", { projectName });

export const deleteProject = (id) => api.post("/deleteProject", { id });
