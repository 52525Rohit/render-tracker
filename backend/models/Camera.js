import { query } from "../config/db.js";

export const Camera = {
  countAll: async () => {
    const rows = await query("SELECT COUNT(*) AS camera_count FROM camera");
    return rows[0].camera_count;
  },

  findByProject: (projectId) =>
    query("SELECT * FROM camera WHERE project_id = ?", [projectId]),

  findById: (id) => query("SELECT * FROM camera WHERE id = ?", [id]),

  findByName: (name) => query("SELECT * FROM camera WHERE camera_name = ?", [name]),

  create: (data) =>
    query(
      `INSERT INTO camera (project_id, image_name, image_url, camera_name, total_frame, rander_frame, frame_time)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [data.projectId, data.imageName, data.imageUrl, data.cameraName, data.totalFrame, data.randerFrame]
    ),

  update: (id, data) =>
    query(
      `UPDATE camera SET camera_name = ?, total_frame = ?, rander_frame = ?, frame_time = NOW(), image_url = ?
       WHERE id = ?`,
      [data.cameraName, data.totalFrame, data.randerFrame, data.imageUrl, id]
    ),

  remove: (id) => query("DELETE FROM camera WHERE id = ?", [id]),
};
