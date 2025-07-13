import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContactForm } from "../components/ContactForm";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            login(data.token);
            navigate(data.user.rol === "admin" ? "/admin" : "/store");
        } else {
            setError(data.message || "Error al iniciar sesión.");
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

      {/* Formulario de login */}
      <section className="novedades seccion-clara">
        <div className="container text-center">
          <h2 className="seccion-titulo">Ingresa con tu cuenta</h2>
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-6">
              <form onSubmit={handleLogin}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Dirección de Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-primary w-100">Ingresar</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <ContactForm />
    </>
  );
}