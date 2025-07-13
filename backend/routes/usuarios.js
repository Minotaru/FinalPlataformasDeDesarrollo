import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
const saltRounds = 10;

// OBTENER TODOS LOS USUARIOS (Solo Admin)
router.get('/', verificarToken, esAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, email, rol FROM usuarios');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

// CREAR UN NUEVO USUARIO (Solo Admin)
router.post('/', verificarToken, esAdmin, async (req, res) => {
    const { email, password, rol } = req.body;
    if (!email || !password || !rol) {
        return res.status(400).json({ message: 'Email, contraseña y rol son requeridos.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await pool.query(
            'INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)',
            [email, hashedPassword, rol]
        );
        res.status(201).json({ message: 'Usuario creado con éxito.', id: result.insertId, email, rol });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El email ya está en uso.' });
        }
        res.status(500).json({ message: 'Error en el servidor al crear el usuario.' });
    }
});

// ACTUALIZAR UN USUARIO (Solo Admin)
router.put('/:id', verificarToken, esAdmin, async (req, res) => {
    const { id } = req.params;
    const { email, rol } = req.body;
    if (!email || !rol) {
        return res.status(400).json({ message: 'Email y rol son requeridos.' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE usuarios SET email = ?, rol = ? WHERE id = ?',
            [email, rol, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.json({ message: 'Usuario actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario.' });
    }
});

// ELIMINAR UN USUARIO (Solo Admin)
router.delete('/:id', verificarToken, esAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.json({ message: 'Usuario eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);

        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'No se puede eliminar un usuario que tiene pedidos asociados.' });
        }

        res.status(500).json({ message: 'Error al eliminar el usuario.' });
    }
});

export default router;