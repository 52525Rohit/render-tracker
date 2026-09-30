import { query } from "./config/db.js";

async function verifyDatabase() {
  try {
    console.log("Checking database tables...\n");

    // 1. List all tables
    const tables = await query("SHOW TABLES");
    console.log("📋 Tables found in Aiven DB:", tables);

    // 2. Check row counts in 'project' and 'camera' tables
    const projectCount = await query("SELECT COUNT(*) AS total FROM project");
    const cameraCount = await query("SELECT COUNT(*) AS total FROM camera");

    console.log(`📁 'project' table records: ${projectCount[0].total}`);
    console.log(`📷 'camera' table records: ${cameraCount[0].total}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    process.exit(1);
  }
}

verifyDatabase();
