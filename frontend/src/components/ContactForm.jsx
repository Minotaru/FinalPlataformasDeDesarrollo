import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simula envío ficticio
    console.log("Consulta enviada:", formData);

    // Muestra alerta
    setEnviado(true);

    // Limpia los campos después de 2 segundos
    setTimeout(() => {
      setFormData({ nombre: "", email: "", mensaje: "" });
      setEnviado(false);
    }, 2000);
  };

  return (
    <section id="contacto" className="contacto seccion-oscura">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6">
            <p className="seccion-titulo">¡Contactanos!</p>
            <p>Podemos ayudarte a encontrar esa figurita que estás buscando.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 col-md-6">

              {/* Alerta Bootstrap */}
              {enviado && (
                <div className="alert alert-success mt-3" role="alert">
                  Consulta enviada
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  name="nombre"
                  className="form-control"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Dirección de Correo</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="nombre@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mensaje" className="form-label">Consulta</label>
                <textarea
                  name="mensaje"
                  className="form-control"
                  rows="3"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Botón de envío */}
              <button type="submit" className="btn btn-primary">Enviar</button>

            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
