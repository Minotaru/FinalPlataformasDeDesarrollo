import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]);
  const { user, getAuthToken } = useAuth();

  const fetchUsuarios = useCallback(async () => {
    if (user?.rol !== 'admin') return;

    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  }, [user, getAuthToken]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const createUsuario = async (userData) => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      alert(data.message);
      if (response.ok) {
        fetchUsuarios();
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const updateUsuario = async (id, userData) => {
    try {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
          fetchUsuarios();
        }
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
      }
  };

  const deleteUsuario = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este usuario?")) return;
    try {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
          fetchUsuarios();
        }
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
  };

  return (
    <UserContext.Provider value={{ usuarios, createUsuario, updateUsuario, deleteUsuario }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUsers = () => useContext(UserContext);