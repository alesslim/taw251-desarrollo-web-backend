import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/logs.css";

type RegistroAcceso = {
  id_registro: number;
  id_usuario: number;
  ip: string;
  navegador: string;
  evento: "ingreso" | "salida" | string;
  fecha_hora: string;
};

function LogsPage() {
  const [registros, setRegistros] = useState<RegistroAcceso[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/registro-acceso");
      setRegistros(respuesta.data);
    } catch (error) {
      console.error("Error al obtener registros:", error);
      setError("Error al cargar los registros de acceso.");
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) {
      return "Sin fecha";
    }

    return new Date(fecha).toLocaleString();
  };

  const obtenerClaseEvento = (evento: string) => {
    if (evento === "ingreso") {
      return "logs-event-ingreso";
    }

    return "logs-event-salida";
  };

  return (
    <div className="logs-page">
      <div className="logs-header">
        <h1 className="logs-title">Registros de acceso</h1>
        <p className="logs-subtitle">
          Visualice los eventos de ingreso y salida de los usuarios del sistema.
        </p>
      </div>

      {error && <div className="logs-alert-error">{error}</div>}

      <div className="logs-table-container">
        <h2 className="logs-table-title">Historial del sistema</h2>

        {cargando ? (
          <p className="logs-loading">Cargando registros...</p>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ID Usuario</th>
                <th>IP</th>
                <th>Evento</th>
                <th>Navegador</th>
                <th>Fecha y hora</th>
              </tr>
            </thead>

            <tbody>
              {registros.length === 0 ? (
                <tr>
                  <td colSpan={6} className="logs-empty">
                    No existen registros de acceso.
                  </td>
                </tr>
              ) : (
                registros.map((registro) => (
                  <tr key={registro.id_registro}>
                    <td>{registro.id_registro}</td>
                    <td>{registro.id_usuario}</td>
                    <td>{registro.ip}</td>
                    <td>
                      <span className={obtenerClaseEvento(registro.evento)}>
                        {registro.evento}
                      </span>
                    </td>
                    <td className="logs-browser">{registro.navegador}</td>
                    <td>{formatearFecha(registro.fecha_hora)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LogsPage;