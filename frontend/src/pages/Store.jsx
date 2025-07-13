import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ContactForm } from "../components/ContactForm";

export default function Store() {
  const { productos } = useProducts();
  const { addToCart, toast, loading } = useCart();
  const [busqueda, setBusqueda] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [orden, setOrden] = useState("");
  const [toastId, setToastId] = useState(null);

  const productosFiltrados = productos
    .filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (precioMax === "" || p.precio <= parseFloat(precioMax))
    )
    .sort((a, b) => {
      switch (orden) {
        case "asc": return a.precio - b.precio;
        case "desc": return b.precio - a.precio;
        case "az": return a.nombre.localeCompare(b.nombre);
        case "za": return b.nombre.localeCompare(a.nombre);
        default: return 0;
      }
    });

  const handleAddToCart = (producto) => {
    addToCart(producto);
    setToastId(producto.id);
    setTimeout(() => setToastId(null), 2000);
  };



  if (loading) return null;

  return (
    <>
      {/* Sección bienvenida */}
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">TUFI Store</h2>
          <p className="seccion-texto">Tu tienda online de figuritas sueltas</p>
        </div>
      </section>

      <section className="novedades seccion-clara">
        <div className="container text-center">
          <h2 className="seccion-titulo">Seleccioná tu figurita</h2>

          {/* Filtros */}
          <div className="row mb-4 justify-content-center">
            <div className="col-12 col-sm-6 col-md-2 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="col-12 col-sm-6 col-md-2 mb-2">
              <input
                type="number"
                className="form-control"
                placeholder="Precio máximo"
                min="1"
                value={precioMax}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseFloat(val) > 0) {
                    setPrecioMax(val);
                  }
                }}
              />
            </div>
            <div className="col-12 col-sm-6 col-md-2 mb-2">
              <select
                className="form-select"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="">Ordenar por</option>
                <option value="asc">Menor precio</option>
                <option value="desc">Mayor precio</option>
                <option value="az">Nombre A-Z</option>
                <option value="za">Nombre Z-A</option>
              </select>
            </div>
          </div>

          {/* Catálogo */}
          <div className="row">
            {productosFiltrados.map(producto => (
              <div key={producto.id} className="col-12 col-md-4 mb-4">
                <div className="card h-100">
                  <img
                    src={`http://localhost:5000${producto.imagen}`}
                    className="card-img-top"
                    alt={producto.nombre}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text">${producto.precio}</p>
                    </div>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <button className="btn btn-primary" onClick={() => handleAddToCart(producto)}>
                        Agregar al carrito
                      </button>
                      <Link className="btn btn-secondary" to={`/product/${producto.id}`}>Ver</Link>
                    </div>

                    {/* Toast debajo del producto */}
                    {toastId === producto.id && (
                      <div className="alert alert-success mt-3 p-2 text-center" role="alert">
                        ¡"{producto.nombre}" fue agregada al carrito!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {productosFiltrados.length === 0 && <p>No se encontraron productos.</p>}
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      <ContactForm />
    </>
  );
}
