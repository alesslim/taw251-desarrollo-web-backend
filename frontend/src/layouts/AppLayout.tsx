import { Link, Outlet, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/layout.css";

export default function AppLayout() {
  const navegar = useNavigate();

  const cerrarSesion = async () => {
    const usuarioGuardado = localStorage.getItem("usuario");

    try {
      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);

        await api.post("/auth/logout", {
          id_usuario: usuario.id_usuario,
        });
      }
    } catch (error) {
      console.error("Error al registrar salida:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      navegar("/login");
    }
  };

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div>
          <h1 className="app-logo">Urban Style</h1>
          <p className="app-subtitle">
            Sistema de gestión de ropa deportiva
          </p>
        </div>

        <nav className="app-menu">
          <Link to="/app/dashboard" className="app-link">
            Inicio
          </Link>

          <Link to="/app/products" className="app-link">
            Productos
          </Link>

          <Link to="/app/categories" className="app-link">
            Categorías
          </Link>

          <Link to="/app/reports" className="app-link">
            Reportes
          </Link>

          <Link to="/app/users" className="app-link">
            Usuarios
          </Link>

          <Link to="/app/logs" className="app-link">
            Registros
          </Link>

          <Link to="/store" className="app-link">
            Ver tienda
          </Link>
        </nav>

        <button className="app-logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}