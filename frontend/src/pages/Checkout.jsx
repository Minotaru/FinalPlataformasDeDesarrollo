import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const envio = 100;
    setTotal(subtotal + envio);
  }, [cart]);

  const confirmarCompra = () => {
    // Guardar "historial de pedidos"
    const historial = JSON.parse(localStorage.getItem("historial")) || [];
    const nuevoPedido = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      items: cart,
    };
    localStorage.setItem("historial", JSON.stringify([...historial, nuevoPedido]));

    clearCart();
    alert("Compra confirmada. ¡Gracias!");
    navigate("/profile");
  };

  if (cart.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h2>No hay productos en el carrito</h2>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Resumen de tu compra</h2>

      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>${item.precio}</td>
              <td>{item.cantidad}</td>
              <td>${item.precio * item.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-end me-2">
        <p><strong>Envío:</strong> $100</p>
        <p><strong>Total a pagar:</strong> ${total}</p>
        <button onClick={confirmarCompra} className="btn btn-success">Confirmar compra</button>
      </div>
    </div>
  );
}
