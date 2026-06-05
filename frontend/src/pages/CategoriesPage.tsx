import { useEffect, useState, type FormEvent } from "react";
import api from "../services/api";
import "../styles/categories.css";

type Categoria = {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
};

function CategoriesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/categoria");
      setCategorias(respuesta.data);
    } catch (error) {
      console.error(error);
      setError("Error al cargar las categorías.");
    } finally {
      setCargando(false);
    }
  };

  const validarFormulario = () => {
    if (nombre.trim() === "") {
      setError("El nombre de la categoría es obligatorio.");
      return false;
    }

    if (nombre.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return false;
    }

    if (descripcion.trim() === "") {
      setError("La descripción es obligatoria.");
      return false;
    }

    if (descripcion.trim().length < 5) {
      setError("La descripción debe tener al menos 5 caracteres.");
      return false;
    }

    return true;
  };

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setIdEditando(null);
  };

  const guardarCategoria = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!validarFormulario()) {
      return;
    }

    const datos = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    };

    try {
      setGuardando(true);

      if (idEditando === null) {
        await api.post("/categoria", datos);
        setMensaje("Categoría registrada correctamente.");
      } else {
        await api.patch(`/categoria/${idEditando}`, datos);
        setMensaje("Categoría actualizada correctamente.");
      }

      limpiarFormulario();
      cargarCategorias();
    } catch (error) {
      console.error(error);
      setError("Error al guardar la categoría.");
    } finally {
      setGuardando(false);
    }
  };

  const seleccionarCategoria = (categoria: Categoria) => {
    setIdEditando(categoria.id_categoria);
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion);
    setError("");
    setMensaje("");
  };

  const eliminarCategoria = async (id: number) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar esta categoría?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setError("");
      setMensaje("");

      await api.delete(`/categoria/${id}`);
      setMensaje("Categoría eliminada correctamente.");

      if (idEditando === id) {
        limpiarFormulario();
      }

      cargarCategorias();
    } catch (error) {
      console.error(error);
      setError("Error al eliminar la categoría.");
    }
  };

  const activarCategoria = async (id: number) => {
    try {
      setError("");
      setMensaje("");

      await api.patch(`/categoria/activar/${id}`);
      setMensaje("Categoría activada correctamente.");

      cargarCategorias();
    } catch (error) {
      console.error(error);
      setError("Error al activar la categoría.");
    }
  };

  return (
    <div className="categories-page">
      <div className="categories-header">
        <div>
          <h1 className="categories-title">Gestión de Categorías</h1>
          <p className="categories-subtitle">
            Administración de categorías para la tienda Urban Style.
          </p>
        </div>
      </div>

      <div className="categories-content">
        <form className="categories-form" onSubmit={guardarCategoria}>
          <h2 className="categories-form-title">
            {idEditando === null ? "Registrar categoría" : "Editar categoría"}
          </h2>

          {error && <div className="categories-alert-error">{error}</div>}
          {mensaje && (
            <div className="categories-alert-success">{mensaje}</div>
          )}

          <label className="categories-label">Nombre</label>
          <input
            type="text"
            placeholder="Ejemplo: Poleras"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="categories-input"
          />

          <label className="categories-label">Descripción</label>
          <textarea
            placeholder="Ejemplo: Ropa deportiva para entrenamiento"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="categories-textarea"
          />

          <div className="categories-form-buttons">
            <button
              type="submit"
              className="categories-btn-save"
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
                className="categories-btn-cancel"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="categories-table-container">
          <h2 className="categories-table-title">Listado de categorías</h2>

          {cargando ? (
            <p className="categories-loading">Cargando categorías...</p>
          ) : (
            <table className="categories-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {categorias.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="categories-empty">
                      No existen categorías registradas.
                    </td>
                  </tr>
                ) : (
                  categorias.map((categoria) => (
                    <tr key={categoria.id_categoria}>
                      <td>{categoria.id_categoria}</td>
                      <td>{categoria.nombre}</td>
                      <td>{categoria.descripcion}</td>
                      <td>
                        <span
                          className={
                            categoria.estado
                              ? "categories-status-active"
                              : "categories-status-inactive"
                          }
                        >
                          {categoria.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td>
                        <div className="categories-actions">
                          <button
                            type="button"
                            className="categories-btn-edit"
                            onClick={() => seleccionarCategoria(categoria)}
                          >
                            Editar
                          </button>

                          {categoria.estado ? (
                            <button
                              type="button"
                              className="categories-btn-delete"
                              onClick={() =>
                                eliminarCategoria(categoria.id_categoria)
                              }
                            >
                              Eliminar
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="categories-btn-activate"
                              onClick={() =>
                                activarCategoria(categoria.id_categoria)
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

export default CategoriesPage;