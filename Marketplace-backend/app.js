require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');

const app = express();
const allowedOrigins = String(process.env.CORS_ORIGIN || '*').split(',').map((item) => item.trim());
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
require('./config/database');

app.use('/usuarios', require('./routes/usuarios.routes'));
app.use('/productos', require('./routes/productos.routes'));
app.use('/chats', require('./routes/chats.routes'));
app.use('/favoritos', require('./routes/favoritosRoutes'));
app.use('/categorias', require('./routes/categoriaRoutes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (_req, res) => res.json({ mensaje: 'API Marketplace funcionando', version: '2.0' }));
app.use((_req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));
app.use((error, _req, res, _next) => {
  console.error('Error del servidor:', error);
  if (error instanceof multer.MulterError) return res.status(400).json({ mensaje: error.message });
  return res.status(error.status || 500).json({ mensaje: error.message || 'Error interno del servidor' });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: allowedOrigins.includes('*') ? '*' : allowedOrigins, methods: ['GET', 'POST'] } });
require('./socket/chat.socket')(io, require('./models/Chat'));

const PORT = Number(process.env.PORT || 3000);
server.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));
