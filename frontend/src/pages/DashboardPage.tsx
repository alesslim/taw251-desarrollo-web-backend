import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/dashboard.css";

type Categoria = {
  id_categoria: number;
  nombre: string;
  estado: boolean;
};

type Producto = {
  id_producto: number;
  nombre: string;
  estado: boolean;
  stock: number;
  categoria?: Categoria;
};

type Usuario = {
  id_usuario: number;
  nom_usuario: string;
  correo: string;
  rol: string;
  estado: boolean;
};

type RegistroAcceso = {
  id_registro: number;
  id_usuario: number;
  evento: string;
  fecha_hora: string;
};

function DashboardPage() {
  const navegar = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [registros, setRegistros] = useState<RegistroAcceso[]>([]);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      setCargando(true);
      setError("");

      const [
        respuestaProductos,
        respuestaCategorias,
        respuestaUsuarios,
        respuestaRegistros,
      ] = await Promise.all([
        api.get("/producto"),
        api.get("/categoria"),
        api.get("/usuario"),
        api.get("/registro-acceso"),
      ]);

      setProductos(respuestaProductos.data);
      setCategorias(respuestaCategorias.data);
      setUsuarios(respuestaUsuarios.data);
      setRegistros(respuestaRegistros.data);
    } catch (error) {
      console.error(error);
      setError("Error al cargar los datos del panel principal.");
    } finally {
      setCargando(false);
    }
  };

  const totalProductos = productos.length;

  const productosActivos = productos.filter(
    (producto) => producto.estado === true
  ).length;

  const productosInactivos = productos.filter(
    (producto) => producto.estado === false
  ).length;

  const totalCategorias = categorias.length;

  const categoriasActivas = categorias.filter(
    (categoria) => categoria.estado === true
  ).length;

  const usuariosActivos = usuarios.filter(
    (usuario) => usuario.estado === true
  ).length;

  const usuariosAdmin = usuarios.filter(
    (usuario) => usuario.rol === "admin"
  ).length;

  const ingresos = registros.filter(
    (registro) => registro.evento === "ingreso"
  ).length;

  const salidas = registros.filter(
    (registro) => registro.evento === "salida"
  ).length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Panel principal</h1>
        <p className="dashboard-subtitle">
        </p>
      </div>

      {error && <div className="dashboard-alert-error">{error}</div>}

      {cargando ? (
        <p className="dashboard-loading"></p>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <p className="dashboard-card-label">Total productos</p>
              <h2 className="dashboard-card-value">{totalProductos}</h2>
            </div>

            <div className="dashboard-card">
              <p className="dashboard-card-label">Productos activos</p>
              <h2 className="dashboard-card-value">{productosActivos}</h2>
            </div>

            <div className="dashboard-card">
              <p className="dashboard-card-label">Categorías activas</p>
              <h2 className="dashboard-card-value">{categoriasActivas}</h2>
            </div>

            <div className="dashboard-card">
              <p className="dashboard-card-label">Usuarios activos</p>
              <h2 className="dashboard-card-value">{usuariosActivos}</h2>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-panel">
              <h2 className="dashboard-panel-title">Opciones</h2>

              <div className="dashboard-actions">
                <button
                  className="dashboard-button"
                  onClick={() => navegar("/app/products")}
                >
                  Ir a productos
                </button>

                <button
                  className="dashboard-button"
                  onClick={() => navegar("/app/categories")}
                >
                  Ir a categorías
                </button>

                <button
                  className="dashboard-button-secondary"
                  onClick={() => navegar("/app/reports")}
                >
                  Ver reportes
                </button>

                <button
                  className="dashboard-button-secondary"
                  onClick={() => navegar("/app/logs")}
                >
                  Ver registros
                </button>
              </div>
            </div>

            <div className="dashboard-panel">
              <h2 className="dashboard-panel-title">Estado general</h2>

              <div className="dashboard-status-list">
                <div className="dashboard-status-item">
                  <span>Productos inactivos</span>
                  <span className="dashboard-status-value">
                    {productosInactivos}
                  </span>
                </div>

                <div className="dashboard-status-item">
                  <span>Total categorías</span>
                  <span className="dashboard-status-value">
                    {totalCategorias}
                  </span>
                </div>

                <div className="dashboard-status-item">
                  <span>Administradores</span>
                  <span className="dashboard-status-value">
                    {usuariosAdmin}
                  </span>
                </div>

                <div className="dashboard-status-item">
                  <span>Ingresos registrados</span>
                  <span className="dashboard-status-value">{ingresos}</span>
                </div>

                <div className="dashboard-status-item">
                  <span>Salidas registradas</span>
                  <span className="dashboard-status-value">{salidas}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;