const mysql = require("mysql");
require("dotenv").config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Database connected" + " " + connection.threadId);
});

module.exports = { pool };
