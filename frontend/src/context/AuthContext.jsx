import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser({
          id: decodedUser.id,
          email: decodedUser.email,
          rol: decodedUser.rol
        });
      } catch (error) {
        console.error("Token inválido:", error);
        setToken(null);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };
  
  // Función para obtener el token para otras llamadas a la API
  const getAuthToken = () => {
    return token;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);