import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const { getAuthToken } = useAuth();

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/productos');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const addProduct = async (productFormData) => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/productos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: productFormData
      });

      if (response.ok) {
        const nuevoProducto = await response.json();
        alert(`¡Producto "${nuevoProducto.nombre}" creado con éxito!`);
        fetchProductos();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };


  const deleteProduct = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        fetchProductos();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };
  
  const updateProduct = async (id, productData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        fetchProductos();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  return (
    <ProductsContext.Provider
      value={{ productos, addProduct, deleteProduct, updateProduct, fetchProductos }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);