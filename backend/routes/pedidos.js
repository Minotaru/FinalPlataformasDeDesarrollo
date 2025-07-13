import express from 'express';
import pool from '../db.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Crear un nuevo pedido
router.post('/', verificarToken, async (req, res) => {
    const { items, total } = req.body;
    const usuario_id = req.usuario.id;

    if (!items || items.length === 0 || !total) {
        return res.status(400).json({ message: 'Faltan datos para crear el pedido.' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        //Insertar en la tabla 'pedidos'
        const [pedidoResult] = await connection.query(
            'INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)',
            [usuario_id, total]
        );
        const pedido_id = pedidoResult.insertId;

        
        //Por cada item del carrito, verificar y actualizar stock
        for (const item of items) {
            
            const [productoRows] = await connection.query(
                'SELECT stock FROM productos WHERE id = ? FOR UPDATE',
                [item.id]
            );

            if (productoRows.length === 0) {
                throw new Error(`El producto con ID ${item.id} no fue encontrado.`);
            }

            const stockActual = productoRows[0].stock;

            if (stockActual < item.cantidad) {
                throw new Error(`No hay stock suficiente para el producto "${item.nombre}". Disponible: ${stockActual}, Solicitado: ${item.cantidad}.`);
            }

            //ACTUALIZAR EL STOCK DEL PRODUCTO
            const nuevoStock = stockActual - item.cantidad;
            await connection.query(
                'UPDATE productos SET stock = ? WHERE id = ?',
                [nuevoStock, item.id]
            );

            //Insertar cada item en 'pedidos_items'
            await connection.query(
                'INSERT INTO pedidos_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [pedido_id, item.id, item.cantidad, item.precio]
            );
        }

        await connection.commit(); // Si todo salió bien, confirmar la transacción
        res.status(201).json({ message: 'Pedido creado exitosamente', pedidoId: pedido_id });

    } catch (error) {
        await connection.rollback(); // Si algo falló, deshacer todos los cambios
        // Devolvemos un código 400 (Bad Request) que el frontend puede manejar
        res.status(400).json({ message: error.message || 'Error al procesar el pedido' });
    } finally {
        connection.release();
    }
});

// Obtener historial de pedidos del usuario logueado
router.get('/mis-pedidos', verificarToken, async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const [pedidos] = await pool.query(
            `SELECT id, fecha, total FROM pedidos WHERE usuario_id = ? ORDER BY fecha DESC`,
            [usuario_id]
        );

        // Para cada pedido, obtener sus items
        for (const pedido of pedidos) {
            const [items] = await pool.query(
                `SELECT p.nombre, pi.cantidad, pi.precio_unitario
                 FROM pedidos_items pi
                 JOIN productos p ON pi.producto_id = p.id
                 WHERE pi.pedido_id = ?`,
                [pedido.id]
            );
            pedido.items = items;
        }

        res.json(pedidos);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ message: 'Error al obtener el historial de pedidos' });
    }
});


export default router;