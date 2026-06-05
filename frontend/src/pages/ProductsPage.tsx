import { useEffect, useState, type FormEvent } from "react";
import api from "../services/api";
import "../styles/products.css";

type Categoria = {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
};

type Producto = {
  id_producto: number;
  nombre: string;
  img: string;
  stock: number;
  descripcion: string;
  fecha_registro: string;
  marca: string;
  talla: string;
  color: string;
  precio: string | number;
  estado: boolean;
  categoria: Categoria;
};

function ProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [idCategoria, setIdCategoria] = useState("");
  const [nombre, setNombre] = useState("");
  const [img, setImg] = useState("");
  const [stock, setStock] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marca, setMarca] = useState("");
  const [talla, setTalla] = useState("");
  const [color, setColor] = useState("");
  const [precio, setPrecio] = useState("");

  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/producto");
      setProductos(respuesta.data);
    } catch (error) {
      console.error(error);
      setError("Error al cargar los productos.");
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const respuesta = await api.get("/categoria");
      setCategorias(respuesta.data);
    } catch (error) {
      console.error(error);
      setError("Error al cargar las categorías.");
    }
  };

  const validarFormulario = () => {
    if (idCategoria === "") {
      setError("Debe seleccionar una categoría.");
      return false;
    }

    if (nombre.trim() === "") {
      setError("El nombre del producto es obligatorio.");
      return false;
    }

    if (nombre.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return false;
    }

    if (img.trim() === "") {
      setError("Debe ingresar el nombre o ruta de la imagen.");
      return false;
    }

    if (stock.trim() === "") {
      setError("El stock es obligatorio.");
      return false;
    }

    if (Number(stock) < 0) {
      setError("El stock no puede ser negativo.");
      return false;
    }

    if (descripcion.trim() === "") {
      setError("La descripción es obligatoria.");
      return false;
    }

    if (marca.trim() === "") {
      setError("La marca es obligatoria.");
      return false;
    }

    if (talla.trim() === "") {
      setError("La talla es obligatoria.");
      return false;
    }

    if (color.trim() === "") {
      setError("El color es obligatorio.");
      return false;
    }

    if (precio.trim() === "") {
      setError("El precio es obligatorio.");
      return false;
    }

    if (Number(precio) <= 0) {
      setError("El precio debe ser mayor a 0.");
      return false;
    }

    return true;
  };

  const limpiarFormulario = () => {
    setIdCategoria("");
    setNombre("");
    setImg("");
    setStock("");
    setDescripcion("");
    setMarca("");
    setTalla("");
    setColor("");
    setPrecio("");
    setIdEditando(null);
  };

  const guardarProducto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!validarFormulario()) {
      return;
    }

    const datos = {
      id_categoria: Number(idCategoria),
      nombre: nombre.trim(),
      img: img.trim(),
      stock: Number(stock),
      descripcion: descripcion.trim(),
      marca: marca.trim(),
      talla: talla.trim(),
      color: color.trim(),
      precio: Number(precio),
    };

    try {
      setGuardando(true);

      if (idEditando === null) {
        await api.post("/producto", datos);
        setMensaje("Producto registrado correctamente.");
      } else {
        await api.patch(`/producto/${idEditando}`, datos);
        setMensaje("Producto actualizado correctamente.");
      }

      limpiarFormulario();
      cargarProductos();
    } catch (error) {
      console.error(error);
      setError("Error al guardar el producto.");
    } finally {
      setGuardando(false);
    }
  };

  const seleccionarProducto = (producto: Producto) => {
    setIdEditando(producto.id_producto);
    setIdCategoria(String(producto.categoria?.id_categoria ?? ""));
    setNombre(producto.nombre);
    setImg(producto.img);
    setStock(String(producto.stock));
    setDescripcion(producto.descripcion);
    setMarca(producto.marca);
    setTalla(producto.talla);
    setColor(producto.color);
    setPrecio(String(producto.precio));
    setError("");
    setMensaje("");
  };

  const inactivarProducto = async (id: number) => {
    const confirmar = window.confirm("¿Estás seguro de inactivar este producto?");

    if (!confirmar) {
      return;
    }

    try {
      setError("");
      setMensaje("");

      await api.delete(`/producto/${id}`);
      setMensaje("Producto inactivado correctamente.");

      if (idEditando === id) {
        limpiarFormulario();
      }

      cargarProductos();
    } catch (error) {
      console.error(error);
      setError("Error al inactivar el producto.");
    }
  };

  const activarProducto = async (id: number) => {
    try {
      setError("");
      setMensaje("");

      await api.patch(`/producto/activar/${id}`);
      setMensaje("Producto activado correctamente.");

      cargarProductos();
    } catch (error) {
      console.error(error);
      setError("Error al activar el producto.");
    }
  };

  const formatearPrecio = (valor: string | number) => {
    return Number(valor).toFixed(2);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">Gestión de Productos</h1>
        <p className="products-subtitle">
          Administración de productos deportivos de la tienda Urban Style.
        </p>
      </div>

      <div className="products-content">
        <form className="products-form" onSubmit={guardarProducto}>
          <h2 className="products-form-title">
            {idEditando === null ? "Registrar producto" : "Editar producto"}
          </h2>

          {error && <div className="products-alert-error">{error}</div>}
          {mensaje && <div className="products-alert-success">{mensaje}</div>}

          <label className="products-label">Categoría</label>
          <select
            value={idCategoria}
            onChange={(e) => setIdCategoria(e.target.value)}
            className="products-select"
          >
            <option value="">Seleccione una categoría</option>

            {categorias.map((categoria) => (
              <option
                key={categoria.id_categoria}
                value={categoria.id_categoria}
              >
                {categoria.nombre}
                {categoria.estado ? "" : " (inactiva)"}
              </option>
            ))}
          </select>

          <label className="products-label">Nombre</label>
          <input
            type="text"
            placeholder="Ejemplo: Polera oversize"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="products-input"
          />

          <label className="products-label">Imagen</label>
          <input
            type="text"
            placeholder="Ejemplo: /productos/polera.jpg"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            className="products-input"
          />

          <label className="products-label">Stock</label>
          <input
            type="number"
            placeholder="Ejemplo: 30"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="products-input"
          />

          <label className="products-label">Descripción</label>
          <textarea
            placeholder="Ejemplo: Polera negra de algodón"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="products-textarea"
          />

          <label className="products-label">Marca</label>
          <input
            type="text"
            placeholder="Ejemplo: Urban Style"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="products-input"
          />

          <label className="products-label">Talla</label>
          <input
            type="text"
            placeholder="Ejemplo: M"
            value={talla}
            onChange={(e) => setTalla(e.target.value)}
            className="products-input"
          />

          <label className="products-label">Color</label>
          <input
            type="text"
            placeholder="Ejemplo: Negro"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="products-input"
          />

          <label className="products-label">Precio</label>
          <input
            type="number"
            step="0.01"
            placeholder="Ejemplo: 150"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="products-input"
          />

          <div className="products-form-buttons">
            <button
              type="submit"
              className="products-btn-save"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : idEditando === null
                  ? "Guardar"
                  : "Actualizar"}
            </button>

            {idEditando !== null && (
              <button
                type="button"
                className="products-btn-cancel"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="products-table-container">
          <h2 className="products-table-title">Listado de productos</h2>

          {cargando ? (
            <p className="products-loading">Cargando productos...</p>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Marca</th>
                  <th>Talla</th>
                  <th>Color</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="products-empty">
                      No existen productos registrados.
                    </td>
                  </tr>
                ) : (
                  productos.map((producto) => (
                    <tr key={producto.id_producto}>
                      <td>{producto.id_producto}</td>

                      <td>
                        <strong>{producto.nombre}</strong>
                        <br />
                        <span className="products-text-secondary">
                          {producto.descripcion}
                        </span>
                      </td>

                      <td>
                        {producto.categoria?.nombre || "Sin categoría"}
                        {producto.categoria?.estado === false
                          ? " (inactiva)"
                          : ""}
                      </td>

                      <td>{producto.marca}</td>
                      <td>{producto.talla}</td>
                      <td>{producto.color}</td>
                      <td>{producto.stock}</td>
                      <td>Bs {formatearPrecio(producto.precio)}</td>

                      <td>
                        <span
                          className={
                            producto.estado
                              ? "products-status-active"
                              : "products-status-inactive"
                          }
                        >
                          {producto.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td>
                        <div className="products-actions">
                          <button
                            type="button"
                            className="products-btn-edit"
                            onClick={() => seleccionarProducto(producto)}
                          >
                            Editar
                          </button>

                          {producto.estado ? (
                            <button
                              type="button"
                              className="products-btn-delete"
                              onClick={() =>
                                inactivarProducto(producto.id_producto)
                              }
                            >
                              Inactivar
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="products-btn-activate"
                              onClick={() =>
                                activarProducto(producto.id_producto)
                              }
                            >
                              Activar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;