import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ContactForm } from "../components/ContactForm";

export default function Profile() {
  const { user, getAuthToken } = useAuth();
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
        const token = getAuthToken();
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5000/api/pedidos/mis-pedidos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setHistorial(data);
            } else {
                console.error("Error al cargar historial:", data.message);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };
    
    if (user) {
        fetchHistorial();
    }
  }, [user, getAuthToken]);

  return (
    <>
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">Mi Perfil</h2>
        </div>
      </section>

      <section className="novedades seccion-clara">
        <div className="container mt-4">
          <p className="text-center fs-4">
            Bienvenido/a, <strong>{user?.email}</strong> | Rol: <strong>{user?.rol}</strong>
          </p>
          <hr />
          <h4>Historial de Pedidos</h4>
          {historial.length === 0 ? (
            <p>No tenés pedidos registrados.</p>
          ) : (
            historial.map((pedido) => (
              <div key={pedido.id} className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Pedido #{pedido.id}</h5>
                  <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
                   <p><strong>Total:</strong> ${pedido.total}</p>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.nombre}</td>
                          <td>{item.cantidad}</td>
                          <td>${item.precio_unitario}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <ContactForm />
    </>
  );
}