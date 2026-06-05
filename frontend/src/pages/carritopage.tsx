import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/cart.css";

type UsuarioLocal = {
    id_usuario: number;
    nom_usuario: string;
    correo: string;
    rol: string;
};

type Producto = {
    id_producto: number;
    nombre: string;
    img: string;
    stock: number;
    descripcion: string;
    marca: string;
    talla: string;
    color: string;
    precio: string | number;
    estado: boolean;
};

type DetalleCarrito = {
    id_carrito: number;
    id_producto: number;
    nombre_producto?: string;
    cantidad: number;
    precio_unitario?: string | number;
    subtotal?: string | number;
    producto?: Producto;
};

type Carrito = {
    id_carrito: number;
    id_usuario: number;
    nom_usuario?: string;
    correo?: string;
    estado: boolean;
    total: string | number;
    fecha_creacion: string;
};

function CartPage() {
    const navegar = useNavigate();

    const [carrito, setCarrito] = useState<Carrito | null>(null);
    const [detalles, setDetalles] = useState<DetalleCarrito[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarCarrito();
    }, []);

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

    const cargarCarrito = async () => {
        try {
            setCargando(true);
            setError("");

            const usuario = obtenerUsuarioLocal();

            if (!usuario) {
                setCarrito(null);
                setDetalles([]);
                setProductos([]);
                setError("Debes iniciar sesión para ver el carrito.");
                return;
            }

            const claveCarrito = `id_carrito_usuario_${usuario.id_usuario}`;
            const idCarritoGuardado = localStorage.getItem(claveCarrito);

            if (!idCarritoGuardado) {
                setCarrito(null);
                setDetalles([]);
                setProductos([]);
                return;
            }

            const idCarrito = Number(idCarritoGuardado);

            const [respuestaCarrito, respuestaDetalles, respuestaProductos] =
                await Promise.all([
                    api.get(`/carrito/${idCarrito}`),
                    api.get(`/detalle-carrito/carrito/${idCarrito}`),
                    api.get("/producto"),
                ]);

            setCarrito(respuestaCarrito.data);
            setDetalles(respuestaDetalles.data);
            setProductos(respuestaProductos.data);
        } catch (error) {
            console.error(error);
            setError("Error al cargar el carrito.");
        } finally {
            setCargando(false);
        }
    };

    const buscarProducto = (detalle: DetalleCarrito) => {
        if (detalle.producto) {
            return detalle.producto;
        }

        return productos.find(
            (producto) => producto.id_producto === detalle.id_producto
        );
    };

    const formatearPrecio = (valor?: string | number | null) => {
        return Number(valor ?? 0).toFixed(2);
    };

    const quitarProducto = async (detalle: DetalleCarrito) => {
        const confirmar = window.confirm(
            "¿Estás seguro de quitar este producto del carrito?"
        );

        if (!confirmar) {
            return;
        }

        try {
            setError("");

            await api.delete(
                `/detalle-carrito/${detalle.id_carrito}/${detalle.id_producto}`
            );

            cargarCarrito();
        } catch (error) {
            console.error(error);
            setError("Error al quitar el producto del carrito.");
        }
    };

    return (
        <div className="cart-contenedor">
            <header className="cart-header">
                <div>
                    <h1 className="cart-logo">Urban Style</h1>
                    <p className="cart-subtitulo">Carrito de compras</p>
                </div>

                <button className="cart-boton-volver" onClick={() => navegar("/store")}>
                    Volver a la tienda
                </button>
            </header>

            <main className="cart-contenido">
                <h2 className="cart-titulo">Mi carrito</h2>

                {error && <div className="cart-alerta-error">{error}</div>}

                {cargando ? (
                    <p className="cart-texto">Cargando carrito...</p>
                ) : detalles.length === 0 ? (
                    <div className="cart-carrito-vacio">
                        <p>No tienes productos agregados al carrito.</p>

                        <button
                            className="cart-boton-comprar"
                            onClick={() => navegar("/store")}
                        >
                            Ir a comprar
                        </button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-lista-productos">
                            {detalles.map((detalle) => {
                                const producto = buscarProducto(detalle);

                                return (
                                    <div
                                        key={`${detalle.id_carrito}-${detalle.id_producto}`}
                                        className="cart-item"
                                    >
                                        <img
                                            src={producto?.img || "/productos/sin-imagen.jpg"}
                                            alt={producto?.nombre || detalle.nombre_producto || "Producto"}
                                            className="cart-imagen-producto"
                                            onError={(e) => {
                                                e.currentTarget.src = "/productos/sin-imagen.jpg";
                                            }}
                                        />

                                        <div className="cart-info-producto">
                                            <h3 className="cart-nombre-producto">
                                                {producto?.nombre ||
                                                    detalle.nombre_producto ||
                                                    `Producto ID ${detalle.id_producto}`}
                                            </h3>

                                            <p className="cart-descripcion">
                                                {producto?.descripcion || "Producto agregado al carrito"}
                                            </p>

                                            <div className="cart-detalles-producto">
                                                <span>Marca: {producto?.marca || "-"}</span>
                                                <span>Talla: {producto?.talla || "-"}</span>
                                                <span>Color: {producto?.color || "-"}</span>
                                            </div>
                                        </div>

                                        <div className="cart-caja-cantidad">
                                            <span className="cart-label">Cantidad</span>
                                            <strong>{detalle.cantidad}</strong>
                                        </div>

                                        <div className="cart-caja-precio">
                                            <span className="cart-label">Subtotal</span>
                                            <strong>Bs {formatearPrecio(detalle.subtotal)}</strong>
                                        </div>

                                        <button
                                            className="cart-boton-quitar"
                                            onClick={() => quitarProducto(detalle)}
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <aside className="cart-resumen">
                            <h3 className="cart-titulo-resumen">Resumen</h3>

                            <div className="cart-fila-resumen">
                                <span>ID carrito:</span>
                                <strong>{carrito?.id_carrito || "-"}</strong>
                            </div>

                            <div className="cart-fila-resumen">
                                <span>Productos:</span>
                                <strong>{detalles.length}</strong>
                            </div>

                            <div className="cart-fila-total">
                                <span>Total:</span>
                                <strong>Bs {formatearPrecio(carrito?.total)}</strong>
                            </div>

                            <button className="cart-boton-finalizar">
                                Finalizar compra
                            </button>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}

export default CartPage;