import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContactForm } from "../components/ContactForm";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();

        if (response.ok) {
            alert("¡Registro exitoso! Ahora podés iniciar sesión.");
            navigate("/login");
        } else {
            setError(data.message || "Error en el registro.");
        }
    } catch (err) {
        setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <>
      {/* Sección bienvenida */}
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">TUFI Store</h2>
          <p className="seccion-texto">Tu tienda online de figuritas sueltas</p>
        </div>
      </section>

      {/* Formulario de registro */}
      <section className="novedades seccion-clara">
        <div className="container text-center">
          <h2 className="seccion-titulo">Registro de Usuario</h2>
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-6">
              <form onSubmit={handleRegister}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Registrarme</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ContactForm />
    </>
  );
}