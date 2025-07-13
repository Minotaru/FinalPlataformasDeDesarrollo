import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { ContactForm } from "../components/ContactForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";

export default function Cart() {
  const [subtotal, setSubtotal] = useState(0);
  const { cart, clearCart, loading } = useCart();
  const { getAuthToken } = useAuth();
  const navigate = useNavigate();
  const { fetchProductos } = useProducts(); // Esto es para recargar la lista de productos y se nos actualice el stock

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setSubtotal(total);
  }, [cart]);

  const pagar = async () => {
    const token = getAuthToken();
    if (!token) {
        alert("Debes iniciar sesión para pagar.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: cart,
                total: subtotal
            })
        });

        if (response.ok) {
            alert("¡Pago realizado con éxito! Tu pedido ha sido registrado.");
            clearCart();
            fetchProductos(); // Llama a la función después de pagar
            navigate('/profile');
        } else {
            const errorData = await response.json();
            alert(`Error al procesar el pago: ${errorData.message}`);
        }
    } catch (error) {
        alert('Error de conexión al procesar el pago.');
    }
  };
  
  const vaciarCarrito = () => {
    if (confirm("¿Estás seguro que querés vaciar el carrito?")) {
      clearCart();
    }
  };

  const carritoVacio = cart.length === 0;
  if (loading) return null;

  return (
    <>
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">TUFI Store</h2>
          <p className="seccion-texto">Tu tienda online de figuritas sueltas</p>
        </div>
      </section>

      <section className="novedades seccion-clara">
        <div className="container text-center">
          <h2 className="seccion-titulo">Resumen de Compra</h2>
          <div className="row justify-content-center align-items-start">
            <div className="col-12 col-md-6 mb-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.nombre}</td>
                      <td>${item.precio}</td>
                      <td>{item.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="col-12 col-md-4">
              <div className="card text-center mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total a Pagar</h5>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Subtotal</th>
                        <td>${subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <th>Total</th>
                          <td>${(subtotal).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    className="btn btn-success mb-2"
                    onClick={pagar}
                    disabled={carritoVacio}
                  >
                    Pagar
                  </button>
                  <br />
                  <button
                    className="btn btn-danger"
                    onClick={vaciarCarrito}
                    disabled={carritoVacio}
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </>
  );
}