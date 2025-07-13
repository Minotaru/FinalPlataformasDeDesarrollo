import { ContactForm } from "../components/ContactForm";

export default function NotFound() {
  return (
    <>
      {/* Sección de bienvenida */}
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">TUFI Store</h2>
          <p className="seccion-texto">Tu tienda online de figuritas sueltas</p>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="novedades seccion-clara">
        <div className="container text-center mt-5">
          <h2>404 - Página no encontrada</h2>
          <p>La URL que estás buscando no existe.</p>
        </div>
      </section>

      {/* Formulario de contacto */}
      <ContactForm />
    </>
  );
}
