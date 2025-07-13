import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import authRoutes from './routes/auth.js';
import productRoutes from './routes/productos.js';
import orderRoutes from './routes/pedidos.js';
import userRoutes from './routes/usuarios.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors()); // Permite la comunicación entre frontend y backend
app.use(express.json()); // Permite al servidor entender JSON
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Sirve archivos estáticos

// Rutas de la API
app.get('/api', (req, res) => {
    res.send('API de TUFI Store funcionando!');
});
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/pedidos', orderRoutes);
app.use('/api/usuarios', userRoutes);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});