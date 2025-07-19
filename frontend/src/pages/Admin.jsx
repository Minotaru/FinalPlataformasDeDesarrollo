import { useState } from "react";
import { ContactForm } from "../components/ContactForm";
import { useProducts } from "../context/ProductsContext";
import { useUsers } from "../context/UserContext"; // Importar el nuevo hook

export default function Admin() {
  // Lógica de Productos
  const { productos, addProduct, deleteProduct, updateProduct } = useProducts();
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  // Lógica de Usuarios
  const { usuarios, createUsuario, updateUsuario, deleteUsuario } = useUsers();
  const [nuevoUsuario, setNuevoUsuario] = useState({ email: '', password: '', rol: 'cliente' });

  const handleAgregarProducto = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', e.target.nuevoNombre.value);
    formData.append('precio', e.target.nuevoPrecio.value);
    formData.append('stock', e.target.nuevoStock.value);
    formData.append('imagen', imagen);
    addProduct(formData);
    e.target.reset();
    setImagen(null);
    setImagenPreview(null);
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => { setImagenPreview(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const eliminarProducto = (id) => { deleteProduct(id); };

  const handleEditProduct = (producto) => {
    const nuevoNombre = prompt("Nuevo nombre:", producto.nombre);
    const nuevoPrecio = prompt("Nuevo precio:", producto.precio);
    const nuevoStock = prompt("Nuevo stock:", producto.stock);

    if (nuevoNombre && nuevoNombre.trim() !== '' && nuevoPrecio && nuevoPrecio.trim() !== '' && nuevoStock && nuevoStock.trim() !== '') {
      const datosActualizados = {
        nombre: nuevoNombre,
        precio: parseFloat(nuevoPrecio),
        stock: parseInt(nuevoStock)
      };
      updateProduct(producto.id, datosActualizados);
    } else {
      alert("La operación fue cancelada o alguno de los campos estaba vacío.");
    }
  };

  // Funciones para manejar el formulario de usuarios
  const handleUserFormChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleCrearUsuario = (e) => {
    e.preventDefault();
    createUsuario(nuevoUsuario);
    setNuevoUsuario({ email: '', password: '', rol: 'cliente' });
  };

  const handleEditarUsuario = (usuario) => {
    const nuevoEmail = prompt("Nuevo email:", usuario.email);
    const nuevoRol = prompt("Nuevo rol (admin/cliente):", usuario.rol);

    if (nuevoEmail && nuevoEmail.trim() !== '' && (nuevoRol === 'admin' || nuevoRol === 'cliente')) {
        updateUsuario(usuario.id, { email: nuevoEmail, rol: nuevoRol });
    } else {
        alert("Datos inválidos o la operación fue cancelada.");
    }
  };

  const handleEliminarUsuario = (id) => {
    deleteUsuario(id);
  };

  return (
    <>
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">Panel de Administración</h2>
        </div>
      </section>

      {/* SECCIÓN DE PRODUCTOS */}
      <section className="novedades seccion-clara">
        <div className="container text-center">
          <h2 className="seccion-titulo">ABM de Productos</h2>
          <hr />
          <h4 className="mb-3">Alta de Productos</h4>
          <form onSubmit={handleAgregarProducto} className="mb-4">
            {/* ... Formulario de productos ... */}
            <input className="form-control mb-2" type="text" name="nuevoNombre" placeholder="Nombre" required />
            <input className="form-control mb-2" type="number" name="nuevoPrecio" placeholder="Precio" step="0.01" required />
            <input className="form-control mb-2" type="number" name="nuevoStock" placeholder="Stock" required />
            <input className="form-control mb-2" type="file" name="nuevaImagen" onChange={handleImagenChange} accept="image/*" required />
            {imagenPreview && (<div className="mb-3"><p>Vista previa:</p><img src={imagenPreview} alt="Vista previa" className="img-abm" /></div>)}
            <button className="btn btn-success">Agregar Producto</button>
          </form>
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th>Imagen</th><th>Producto</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td><img className="img-abm" src={`http://localhost:5000${p.imagen}`} alt={p.nombre} /></td>
                    <td>{p.nombre}</td><td>${p.precio}</td><td>{p.stock}</td>
                    <td>
                      <i className="bi bi-pencil text-primary me-2" style={{cursor: 'pointer'}} onClick={() => handleEditProduct(p)}></i>
                      <i className="bi bi-trash text-danger" style={{cursor: 'pointer'}} onClick={() => eliminarProducto(p.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE USUARIOS*/}
      <section className="novedades seccion-clara pt-0">
        <div className="container text-center">
          <h2 className="seccion-titulo mt-5">Gestión de Usuarios</h2><hr />
          <h4 className="mb-3">Alta de Usuarios</h4>
          <form onSubmit={handleCrearUsuario} className="mb-4">
            <input className="form-control mb-2" type="email" name="email" placeholder="Email" value={nuevoUsuario.email} onChange={handleUserFormChange} required />
            <input className="form-control mb-2" type="password" name="password" placeholder="Contraseña" value={nuevoUsuario.password} onChange={handleUserFormChange} required />
            <select className="form-select mb-2" name="rol" value={nuevoUsuario.rol} onChange={handleUserFormChange} required>
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
            <button className="btn btn-success">Agregar Usuario</button>
          </form>
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th>Email</th><th>Rol</th><th>Acciones</th></tr></thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>{u.email}</td><td>{u.rol}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditarUsuario(u)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminarUsuario(u.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ContactForm />
    </>
  );
}