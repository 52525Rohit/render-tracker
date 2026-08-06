import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

pool
  .getConnection()
  .then((connection) => {
    console.log("Connected Successfully");
    connection.release();
  })
  .catch((err) => console.log("Not Connected", err.sqlMessage || err.message));

export const query = async (sql, params) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};
