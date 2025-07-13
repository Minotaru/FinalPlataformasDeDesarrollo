import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ContactForm } from "../components/ContactForm";

export default function Home() {
  // OBTENEMOS los productos desde el contexto, que a su vez los obtiene de la API.
  const { productos } = useProducts(); 
  const { addToCart, toast } = useCart();
  const { user } = useAuth();

  // El useEffect que leía de localStorage ya no es necesario.
  // Obtenemos las novedades directamente de los productos que vienen de la API.
  const novedades = productos.slice(-3).reverse();

  const handleAddToCart = (producto) => {
    addToCart(producto);
  };

  return (
    <>
      {/* Carrusel */}
      <div id="carousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/img/front01.png" className="d-block w-100" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src="/img/front02.png" className="d-block w-100" alt="Slide 2" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* Sobre TUFI Store */}
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">TUFI Store</h2>
          <p className="seccion-texto">Tu tienda online de figuritas sueltas</p>
        </div>
      </section>

      {/* Novedades */}
      <section className="novedades seccion-clara">
        <div className="container text-center">
          <h2 className="seccion-titulo">NOVEDADES</h2>
          <div className="row">
            {novedades.length > 0 ? (
              novedades.map((producto) => (
                <div key={producto.id} className="col-12 col-md-4 mb-4">
                  <div className="card" style={{ width: "18rem", margin: "0 auto" }}>
                    <img 
                      src={`http://localhost:5000${producto.imagen}`}
                      className="card-img-top" 
                      alt={producto.nombre} 
                    />
                    <div className="card-body">
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text">${producto.precio}</p>
                      {user && (
                        <>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddToCart(producto)}
                          >
                            Agregar al carrito
                          </button>
                          {toast === producto.id && (
                            <div className="alert alert-success mt-2 p-1" role="alert">
                              "{producto.nombre}" fue agregada al carrito
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay novedades por el momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      <ContactForm />
    </>
  );
}