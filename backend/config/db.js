// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   port: Number(process.env.MYSQL_PORT),

//   ssl: {
//     rejectUnauthorized: false,
//   },

//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// pool
//   .getConnection()
//   .then((connection) => {
//     console.log("Database Connected Successfully");
//     connection.release();
//   })
//   .catch((err) => {
//     console.error("Database Not Connected:", err.message);
//   });

// export const query = async (sql, params) => {
//   const [rows] = await pool.query(sql, params);
//   return rows;
// };

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 23437,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to Aiven MySQL database successfully!");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

testConnection();

export default pool;
