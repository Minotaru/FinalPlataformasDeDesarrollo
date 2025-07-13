import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cantidad = cart.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light px-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">TUFI Store</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarToggler">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>

            {/* Solo si está logueado */}
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/store">Tienda</Link>
                </li>
                <li className="nav-item position-relative">
                  <Link className="nav-link" to="/cart">
                    Carrito
                    {cantidad > 0 && (
                      <span className="badge rounded-pill bg-danger text-white ms-1">
                        {cantidad}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            )}

            {/* Solo si es admin */}
            {user?.rol === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
            )}

            {/* Perfil si está logueado */}
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Perfil</Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item d-flex align-items-center me-3">
              <button onClick={toggleTheme} className="btn btn-outline-secondary btn-sm">
                {darkMode ? "Oscuro" : "Claro"}
              </button>
            </li>

            {/* Login / Logout */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registro</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
