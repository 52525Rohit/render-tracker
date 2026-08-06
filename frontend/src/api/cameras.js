import { api } from "./client";

export const getCameraDetails = (projectId) =>
  api.post("/getCameraDetails", { projectId });

export const getViewDetails = (id) => api.post("/getViewDetails", { id });

export const uploadCamera = (formData) => api.post("/upload", formData);

export const updateCamera = (formData) => api.post("/update", formData);

export const deleteCamera = (id) => api.post("/delete", { id });
