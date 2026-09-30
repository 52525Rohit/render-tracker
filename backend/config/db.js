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

import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

console.log("Connecting to Host:", process.env.DB_HOST);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 23437,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "defaultdb",
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function checkDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Successfully connected to Aiven MySQL DB!");
    connection.release();
  } catch (error) {
    console.error("DB Connection Failed full details:", error);
  }
}

checkDbConnection();

export const query = async (sql, params) => {
  const [results] = await pool.query(sql, params);
  return results;
};

export default pool;
