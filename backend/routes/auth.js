import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();
const saltRounds = 10;

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Por defecto, todos los registros son 'cliente'
    const [result] = await pool.query(
      'INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)',
      [email, hashedPassword, 'cliente']
    );
    res.status(201).json({ message: 'Usuario registrado con éxito.', userId: result.insertId });
  } catch (error) {
    console.error('Error en /register:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El email ya está en uso.' });
    }
    res.status(500).json({ message: 'Error en el servidor al registrar el usuario.', error: error.message });
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // Crear y firmar el token
    const token = jwt.sign(
      { id: user.id, rol: user.rol, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login exitoso.',
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ message: 'Error en el servidor.', error: error.message });
  }
});

export default router;