import { useNavigate } from "react-router-dom";
import "../styles/unauthorized.css";

export default function UnauthorizedPage() {
  const navegar = useNavigate();

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">
        <h1 className="unauthorized-title">No autorizado</h1>

        <p className="unauthorized-text">
          No tienes permisos para acceder a esta sección del sistema. Esta área
          está habilitada solamente para usuarios administradores.
        </p>

        <button
          className="unauthorized-button"
          onClick={() => navegar("/store")}
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}