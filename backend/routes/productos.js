import express from 'express';
import multer from 'multer';
import path from 'path';
import pool from '../db.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configuración de Multer para la subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


// OBTENER TODOS LOS PRODUCTOS (Público)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

// CREAR UN PRODUCTO (Protegido, solo Admin)
router.post('/', verificarToken, esAdmin, upload.single('imagen'), async (req, res) => {
  const { nombre, precio, stock } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;

  if (!nombre || !precio || !stock || !imagen) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, precio, stock, imagen) VALUES (?, ?, ?, ?)',
      [nombre, precio, stock, imagen]
    );
    res.status(201).json({ id: result.insertId, nombre, precio, stock, imagen });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
});

// ACTUALIZAR UN PRODUCTO (Protegido, solo Admin)
router.put('/:id', verificarToken, esAdmin, async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;

    if (!nombre || !precio || !stock) {
        return res.status(400).json({ message: 'Nombre, precio y stock son requeridos.' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
            [nombre, precio, stock, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.json({ message: 'Producto actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

// ELIMINAR UN PRODUCTO (Protegido, solo Admin)
router.delete('/:id', verificarToken, esAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
});

export default router;