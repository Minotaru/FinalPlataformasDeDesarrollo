import { useParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import { ContactForm } from "../components/ContactForm";

export default function ProductDetail() {
  const { id } = useParams();
  const { productos } = useProducts();
  const { addToCart, toast } = useCart();

  const producto = productos.find(p => p.id === parseInt(id));

  if (!producto) {
    return (
      <div className="container text-center mt-5">
        <h2>Producto no encontrado</h2>
        <Link to="/store" className="btn btn-primary mt-3">Volver a la tienda</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(producto);
  };

  // Normalizar ruta de imagen
  const imagenSrc = producto.imagen.replace(/^(\/?img\/)+/, "/img/");

  return (
    <>
      {/* Sección bienvenida */}
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">TUFI Store</h2>
          <p className="seccion-texto">Tu tienda online de figuritas sueltas</p>
        </div>
      </section>

      {/* Detalle del producto */}
      <section className="novedades seccion-clara">
        <div className="container mt-5">
          <div className="row align-items-center">
            <div className="col-md-6 text-center">
              <img
                src={`http://localhost:5000${producto.imagen}`}
                alt={producto.nombre}
                className="img-fluid"
                style={{ maxHeight: 400 }}
              />
            </div>
            <div className="col-md-6">
              <h2>{producto.nombre}</h2>
              <p><strong>Precio:</strong> ${producto.precio}</p>
              <p><strong>Stock disponible:</strong> {producto.stock}</p>

              {/* Botones alineados */}
              <div className="d-flex flex-wrap align-items-center gap-2">
                <button className="btn btn-primary" onClick={handleAddToCart}>
                  Agregar al carrito
                </button>
                <Link to="/store" className="btn btn-secondary">
                  Volver
                </Link>
              </div>

              {/* Toast debajo de los botones */}
              {toast === producto.id && (
                <div className="alert alert-success mt-3 p-2 text-center" role="alert">
                  "{producto.nombre}" fue agregada al carrito
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      <ContactForm />
    </>
  );
}
