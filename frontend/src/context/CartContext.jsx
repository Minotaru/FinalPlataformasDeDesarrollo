import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const toastTimeout = useRef(null);

  const email = user?.email;
  const storageKey = email ? `carrito_${email}` : null;

  // Cargar carrito cuando cambia el usuario
  useEffect(() => {
    if (storageKey) {
      const stored = JSON.parse(localStorage.getItem(storageKey)) || [];
      setCart(stored);
    } else {
      setCart([]); // si no hay usuario, vacía el estado
    }
    setLoading(false);
  }, [storageKey]);

  // Guardar carrito por usuario
  useEffect(() => {
    if (!loading && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    }
  }, [cart, loading, storageKey]);

  const addToCart = (product) => {
    const updated = [...cart];
    const item = updated.find(p => p.id === product.id);
    if (item) item.cantidad += 1;
    else updated.push({ ...product, cantidad: 1 });
    setCart(updated);

    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast(product.id);
    toastTimeout.current = setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const clearCart = () => {
    setCart([]);
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  const removeFromCartById = (id) => {
    const actualizado = cart.filter(item => item.id !== id);
    setCart(actualizado);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(actualizado));
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, clearCart, toast, loading, removeFromCartById }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
