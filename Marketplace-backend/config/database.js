require('dotenv').config();
const mysql = require('mysql2');

const conexion = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'marketplace',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
});

conexion.getConnection((error, connection) => {
  if (error) {
    console.error('Error al conectar MySQL:', error.message);
    return;
  }
  console.log('MySQL conectado correctamente');
  connection.release();
});

module.exports = conexion;
