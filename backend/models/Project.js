import { query } from "../config/db.js";

export const Project = {
  findAll: () => query("SELECT * FROM project ORDER BY date_modify DESC"),

  findByName: (name) => query("SELECT * FROM project WHERE project_name = ?", [name]),

  create: (name) =>
    query(
      "INSERT INTO project (project_name, date_create, date_modify) VALUES (?, NOW(), NOW())",
      [name]
    ),

  touchModified: (id) =>
    query("UPDATE project SET date_modify = NOW() WHERE id = ?", [id]),

  remove: (id) => query("DELETE FROM project WHERE id = ?", [id]),
};
