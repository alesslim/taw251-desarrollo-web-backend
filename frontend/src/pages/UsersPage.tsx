import { useEffect, useState, type FormEvent } from "react";
import api from "../services/api";
import "../styles/users.css";

type Usuario = {
  id_usuario: number;
  nom_usuario: string;
  correo: string;
  rol: string;
  estado: boolean;
  fecha_registro: string;
};

function UsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [nomUsuario, setNomUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("cliente");

  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/usuario");
      setUsuarios(respuesta.data);
    } catch (error) {
      console.error(error);
      setError("Error al cargar los usuarios.");
    } finally {
      setCargando(false);
    }
  };

  const validarFormulario = () => {
    if (nomUsuario.trim() === "") {
      setError("El nombre del usuario es obligatorio.");
      return false;
    }

    if (nomUsuario.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return false;
    }

    if (correo.trim() === "") {
      setError("El correo es obligatorio.");
      return false;
    }

    if (!correo.includes("@")) {
      setError("El correo debe tener un formato válido.");
      return false;
    }

    if (idEditando === null && password.trim() === "") {
      setError("La contraseña es obligatoria para crear un usuario.");
      return false;
    }

    if (password.trim() !== "" && password.trim().length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }

    if (rol !== "cliente" && rol !== "admin") {
      setError("El rol seleccionado no es válido.");
      return false;
    }

    return true;
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setNomUsuario("");
    setCorreo("");
    setPassword("");
    setRol("cliente");
    setError("");
  };

  const guardarUsuario = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!validarFormulario()) {
      return;
    }

    try {
      setGuardando(true);

      if (idEditando === null) {
        await api.post("/usuario", {
          nom_usuario: nomUsuario.trim(),
          correo: correo.trim(),
          password: password.trim(),
          rol,
        });

        setMensaje("Usuario registrado correctamente.");
      } else {
        const datosActualizar: {
          nom_usuario: string;
          correo: string;
          rol: string;
          password?: string;
        } = {
          nom_usuario: nomUsuario.trim(),
          correo: correo.trim(),
          rol,
        };

        if (password.trim() !== "") {
          datosActualizar.password = password.trim();
        }

        await api.patch(`/usuario/${idEditando}`, datosActualizar);

        setMensaje("Usuario actualizado correctamente.");
      }

      limpiarFormulario();
      cargarUsuarios();
    } catch (error) {
      console.error(error);
      setError("Error al guardar el usuario.");
    } finally {
      setGuardando(false);
    }
  };

  const seleccionarUsuario = (usuario: Usuario) => {
    setIdEditando(usuario.id_usuario);
    setNomUsuario(usuario.nom_usuario);
    setCorreo(usuario.correo);
    setPassword("");
    setRol(usuario.rol);
    setError("");
    setMensaje("");
  };

  const eliminarUsuario = async (idUsuario: number) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este usuario?");

    if (!confirmar) {
      return;
    }

    try {
      setError("");
      setMensaje("");

      await api.delete(`/usuario/${idUsuario}`);
      setMensaje("Usuario eliminado correctamente.");

      if (idEditando === idUsuario) {
        limpiarFormulario();
      }

      cargarUsuarios();
    } catch (error) {
      console.error(error);
      setError("Error al eliminar el usuario.");
    }
  };

  const activarUsuario = async (idUsuario: number) => {
    try {
      setError("");
      setMensaje("");

      await api.patch(`/usuario/activar/${idUsuario}`);
      setMensaje("Usuario activado correctamente.");

      cargarUsuarios();
    } catch (error) {
      console.error(error);
      setError("Error al activar el usuario.");
    }
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) {
      return "Sin fecha";
    }

    return new Date(fecha).toLocaleString();
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <h1 className="users-title">Gestión de Usuarios</h1>
        <p className="users-subtitle">
          Administración de clientes y administradores del sistema Urban Style.
        </p>
      </div>

      <div className="users-content">
        <form className="users-form" onSubmit={guardarUsuario}>
          <h2 className="users-form-title">
            {idEditando === null ? "Registrar usuario" : "Editar usuario"}
          </h2>

          {error && <div className="users-alert-error">{error}</div>}
          {mensaje && <div className="users-alert-success">{mensaje}</div>}

          <label className="users-label">Nombre de usuario</label>
          <input
            type="text"
            value={nomUsuario}
            onChange={(e) => setNomUsuario(e.target.value)}
            placeholder="Ejemplo: Juan Pérez"
            className="users-input"
          />

          <label className="users-label">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Ejemplo: usuario@gmail.com"
            className="users-input"
          />

          <label className="users-label">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              idEditando === null
                ? "Ejemplo: 123456"
                : "Dejar vacío si no desea cambiar"
            }
            className="users-input"
          />

          {idEditando !== null && (
            <p className="users-help">
              Si no desea cambiar la contraseña, deje este campo vacío.
            </p>
          )}

          <label className="users-label">Rol</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="users-select"
          >
            <option value="cliente">cliente</option>
            <option value="admin">admin</option>
          </select>

          <div className="users-form-buttons">
            <button
              type="submit"
              className="users-btn-save"
              disabled={guardando}
            >
              {guardando
                ? "Guardando..."
                : idEditando === null
                  ? "Registrar"
                  : "Actualizar"}
            </button>

            {idEditando !== null && (
              <button
                type="button"
                className="users-btn-cancel"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="users-table-container">
          <h2 className="users-table-title">Lista de usuarios</h2>

          {cargando ? (
            <p className="users-loading">Cargando usuarios...</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="users-empty">
                      No existen usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id_usuario}>
                      <td>{usuario.id_usuario}</td>
                      <td>{usuario.nom_usuario}</td>
                      <td>{usuario.correo}</td>

                      <td>
                        <span
                          className={
                            usuario.rol === "admin"
                              ? "users-role-admin"
                              : "users-role-client"
                          }
                        >
                          {usuario.rol}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            usuario.estado
                              ? "users-status-active"
                              : "users-status-inactive"
                          }
                        >
                          {usuario.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td>{formatearFecha(usuario.fecha_registro)}</td>

                      <td>
                        <div className="users-actions">
                          <button
                            type="button"
                            className="users-btn-edit"
                            onClick={() => seleccionarUsuario(usuario)}
                          >
                            Editar
                          </button>

                          {usuario.estado ? (
                            <button
                              type="button"
                              className="users-btn-delete"
                              onClick={() =>
                                eliminarUsuario(usuario.id_usuario)
                              }
                            >
                              Eliminar
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="users-btn-activate"
                              onClick={() =>
                                activarUsuario(usuario.id_usuario)
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

export default UsersPage;