import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../services/api";
import "../styles/reports.css";

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

function ReportsPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setMensaje("");

      const respuesta = await api.get("/producto");
      setProductos(respuesta.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setMensaje("Error al cargar productos para el reporte.");
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

  const formatearPrecio = (valor: string | number) => {
    return Number(valor).toFixed(2);
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de productos - Urban Style", 14, 20);

    doc.setFontSize(11);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 30);

    doc.text(`Total de productos: ${totalProductos}`, 14, 42);
    doc.text(`Productos activos: ${productosActivos}`, 14, 50);
    doc.text(`Productos inactivos: ${productosInactivos}`, 14, 58);

    const filas = productos.map((producto) => [
      producto.id_producto,
      producto.nombre,
      producto.categoria?.nombre || "Sin categoría",
      producto.marca,
      producto.talla,
      producto.color,
      producto.stock,
      `Bs ${formatearPrecio(producto.precio)}`,
      producto.estado ? "Activo" : "Inactivo",
    ]);

    autoTable(doc, {
      startY: 70,
      head: [
        [
          "ID",
          "Producto",
          "Categoría",
          "Marca",
          "Talla",
          "Color",
          "Stock",
          "Precio",
          "Estado",
        ],
      ],
      body: filas,
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [249, 115, 22],
      },
    });

    doc.save("reporte_productos_urban_style.pdf");
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1 className="reports-title">Reportes</h1>

        <p className="reports-description">
          En esta sección se generan reportes PDF y gráficos estadísticos de los
          productos registrados en el sistema Urban Style.
        </p>
      </div>

      <div className="reports-cards">
        <div className="reports-card">
          <h3 className="reports-card-title">Total productos</h3>
          <p className="reports-card-number">{totalProductos}</p>
        </div>

        <div className="reports-card">
          <h3 className="reports-card-title">Activos</h3>
          <p className="reports-card-number">{productosActivos}</p>
        </div>

        <div className="reports-card">
          <h3 className="reports-card-title">Inactivos</h3>
          <p className="reports-card-number">{productosInactivos}</p>
        </div>
      </div>

      <div className="reports-panel">
        <h2 className="reports-subtitle">Reporte de productos</h2>

        <p className="reports-text">
          Este reporte contiene el listado de productos con información de
          categoría, marca, talla, color, stock, precio y estado.
        </p>

        <div className="reports-buttons">
          <button
            className="reports-btn-primary"
            onClick={generarPDF}
            disabled={cargando || productos.length === 0}
          >
            {cargando ? "Cargando productos..." : "Generar PDF"}
          </button>

          <button className="reports-btn-secondary" onClick={cargarProductos}>
            Actualizar datos
          </button>
        </div>

        {mensaje && <p className="reports-message">{mensaje}</p>}
      </div>

      <div className="reports-panel">
        <h2 className="reports-subtitle">Gráfico estadístico de productos</h2>

        <p className="reports-text">
          Este gráfico muestra la cantidad de productos activos e inactivos
          registrados en el sistema.
        </p>

        <div className="reports-chart-row">
          <div className="reports-chart-label">Activos</div>

          <progress
            className="reports-progress reports-progress-active"
            value={productosActivos}
            max={totalProductos || 1}
          />

          <div className="reports-chart-value">
            {productosActivos} productos
          </div>
        </div>

        <div className="reports-chart-row">
          <div className="reports-chart-label">Inactivos</div>

          <progress
            className="reports-progress reports-progress-inactive"
            value={productosInactivos}
            max={totalProductos || 1}
          />

          <div className="reports-chart-value">
            {productosInactivos} productos
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;