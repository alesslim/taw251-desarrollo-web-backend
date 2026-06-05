import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/store.css";

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

type UsuarioLocal = {
  id_usuario: number;
  nom_usuario: string;
  correo: string;
  rol: string;
};

type CarritoActivo = {
  id_carrito: number;
  estado: boolean;
};

function StorePage() {
  const navegar = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    number | "todas"
  >("todas");

  const [cargando, setCargando] = useState(false);
  const [agregando, setAgregando] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/producto");

      const productosActivos = respuesta.data.filter(
        (producto: Producto) => producto.estado === true
      );

      const categoriasActivas = productosActivos
        .map((producto: Producto) => producto.categoria)
        .filter(
          (categoria: Categoria | undefined) =>
            categoria && categoria.estado === true
        ) as Categoria[];

      const categoriasUnicas = categoriasActivas.filter(
        (categoria, index, arreglo) =>
          index ===
          arreglo.findIndex(
            (item) => item.id_categoria === categoria.id_categoria
          )
      );

      setProductos(productosActivos);
      setCategorias(categoriasUnicas);
    } catch (error) {
      console.error(error);
      setError("Error al cargar los productos de la tienda.");
    } finally {
      setCargando(false);
    }
  };

  const obtenerUsuarioLocal = (): UsuarioLocal | null => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      return null;
    }

    try {
      return JSON.parse(usuarioGuardado);
    } catch (error) {
      console.error("Error al leer usuario:", error);
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      return null;
    }
  };

  const obtenerOCrearCarrito = async (idUsuario: number) => {
    const claveCarrito = `id_carrito_usuario_${idUsuario}`;
    const idCarritoGuardado = localStorage.getItem(claveCarrito);

    if (idCarritoGuardado) {
      return Number(idCarritoGuardado);
    }

    const respuestaCarritos = await api.get(`/carrito/usuario/${idUsuario}`);

    const carritoActivo = respuestaCarritos.data.find(
      (carrito: CarritoActivo) => carrito.estado === true
    );

    if (carritoActivo) {
      localStorage.setItem(claveCarrito, String(carritoActivo.id_carrito));
      return carritoActivo.id_carrito;
    }

    const respuestaNuevoCarrito = await api.post("/carrito", {
      id_usuario: idUsuario,
    });

    const idCarritoNuevo =
      respuestaNuevoCarrito.data.carrito?.id_carrito ??
      respuestaNuevoCarrito.data.id_carrito;

    localStorage.setItem(claveCarrito, String(idCarritoNuevo));

    return idCarritoNuevo;
  };

  const agregarAlCarrito = async (producto: Producto) => {
    try {
      setError("");
      setMensaje("");
      setAgregando(producto.id_producto);

      const usuario = obtenerUsuarioLocal();

      if (!usuario) {
        alert("Primero debes iniciar sesión para agregar productos al carrito.");
        navegar("/login");
        return;
      }

      const idCarrito = await obtenerOCrearCarrito(usuario.id_usuario);

      await api.post("/detalle-carrito", {
        id_carrito: idCarrito,
        id_producto: producto.id_producto,
        cantidad: 1,
      });

      setMensaje(`Producto agregado al carrito: ${producto.nombre}`);
    } catch (error) {
      console.error(error);
      setError("Error al agregar el producto al carrito.");
    } finally {
      setAgregando(null);
    }
  };

  const cerrarSesion = async () => {
    const usuarioGuardado = localStorage.getItem("usuario");

    try {
      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);

        await api.post("/auth/logout", {
          id_usuario: usuario.id_usuario,
        });

        localStorage.removeItem(`id_carrito_usuario_${usuario.id_usuario}`);
      }
    } catch (error) {
      console.error("Error al registrar salida:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      navegar("/login");
    }
  };

  const formatearPrecio = (precio: string | number) => {
    return Number(precio).toFixed(2);
  };

  const productosFiltrados = productos.filter((producto) => {
    if (categoriaSeleccionada === "todas") {
      return true;
    }

    return producto.categoria?.id_categoria === categoriaSeleccionada;
  });

  return (
    <div className="store-contenedor">
      <header className="store-header">
        <div>
          <h1 className="store-logo">Urban Style</h1>
          <p className="store-subtitulo">
            Tienda de ropa deportiva y productos fitness
          </p>
        </div>

        <div className="store-botones-derecha">
          <button
            className="store-boton-carrito-header"
            onClick={() => navegar("/cart")}
          >
            🛒 Carrito
          </button>

          <button className="store-boton-salir" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="store-banner">
        <div>
          <h2 className="store-titulo-banner">Nueva colección deportiva</h2>
          <p className="store-texto-banner">
            Encuentra productos cómodos, modernos y pensados para tu
            entrenamiento.
          </p>
        </div>
      </section>

      <main className="store-contenido">
        <h2 className="store-titulo-seccion">Productos disponibles</h2>

        <div className="store-filtros-categorias">
          <button
            className={
              categoriaSeleccionada === "todas"
                ? "store-tab-categoria store-tab-activa"
                : "store-tab-categoria"
            }
            onClick={() => setCategoriaSeleccionada("todas")}
          >
            Todos
          </button>

          {categorias.map((categoria) => (
            <button
              key={categoria.id_categoria}
              className={
                categoriaSeleccionada === categoria.id_categoria
                  ? "store-tab-categoria store-tab-activa"
                  : "store-tab-categoria"
              }
              onClick={() => setCategoriaSeleccionada(categoria.id_categoria)}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>

        {error && <div className="store-alerta-error">{error}</div>}
        {mensaje && <div className="store-alerta-exito">{mensaje}</div>}

        {cargando ? (
          <p className="store-texto-cargando">Cargando productos...</p>
        ) : productosFiltrados.length === 0 ? (
          <p className="store-texto-vacio">
            No existen productos disponibles en esta categoría.
          </p>
        ) : (
          <div className="store-grid-productos">
            {productosFiltrados.map((producto) => (
              <div key={producto.id_producto} className="store-card">
                <div className="store-contenedor-imagen">
                  <img
                    src={producto.img || "/productos/sin-imagen.jpg"}
                    alt={producto.nombre}
                    className="store-imagen-producto"
                    onError={(e) => {
                      e.currentTarget.src = "/productos/sin-imagen.jpg";
                    }}
                  />
                </div>

                <div className="store-info-producto">
                  <span className="store-categoria">
                    {producto.categoria?.nombre || "Sin categoría"}
                  </span>

                  <h3 className="store-nombre-producto">{producto.nombre}</h3>

                  <p className="store-descripcion">{producto.descripcion}</p>

                  <div className="store-detalles">
                    <span>Marca: {producto.marca}</span>
                    <span>Talla: {producto.talla}</span>
                    <span>Color: {producto.color}</span>
                    <span>Stock: {producto.stock}</span>
                  </div>

                  <div className="store-footer-card">
                    <strong className="store-precio">
                      Bs {formatearPrecio(producto.precio)}
                    </strong>

                    <button
                      className="store-boton-agregar"
                      onClick={() => agregarAlCarrito(producto)}
                      disabled={
                        agregando === producto.id_producto ||
                        producto.stock <= 0
                      }
                    >
                      {producto.stock <= 0
                        ? "Sin stock"
                        : agregando === producto.id_producto
                          ? "Agregando..."
                          : "Agregar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default StorePage;