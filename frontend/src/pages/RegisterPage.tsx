import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import "../styles/auth.css";

type NivelSeguridad = "Débil" | "Intermedia" | "Fuerte" | "";

function calcularSeguridadPassword(password: string): NivelSeguridad {
    if (!password) return "";

    const tieneMinuscula = /[a-z]/.test(password);
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /\d/.test(password);
    const tieneEspecial = /[^A-Za-z0-9]/.test(password);
    const tieneLongitud = password.length >= 8;

    const puntos = [
        tieneMinuscula,
        tieneMayuscula,
        tieneNumero,
        tieneEspecial,
        tieneLongitud,
    ].filter(Boolean).length;

    if (puntos >= 5) return "Fuerte";
    if (puntos >= 3) return "Intermedia";
    return "Débil";
}

function colorSeguridad(nivel: NivelSeguridad) {
    if (nivel === "Fuerte") return "#7CFC98";
    if (nivel === "Intermedia") return "#ffd166";
    if (nivel === "Débil") return "#ff6b6b";
    return "#ffffff";
}

export default function RegisterPage() {
    const navigate = useNavigate();

    const [nom_usuario, setNomUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");

    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const nivelPassword = useMemo(() => {
        return calcularSeguridadPassword(password);
    }, [password]);

    const validarFormulario = () => {
        setError("");
        setMensaje("");

        if (!nom_usuario.trim()) {
            setError("El nombre de usuario es obligatorio.");
            return false;
        }

        if (!correo.trim()) {
            setError("El correo electrónico es obligatorio.");
            return false;
        }

        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoCorreo.test(correo)) {
            setError("Ingrese un correo electrónico válido.");
            return false;
        }

        if (!password.trim()) {
            setError("La contraseña es obligatoria.");
            return false;
        }

        if (!confirmarPassword.trim()) {
            setError("Debe confirmar la contraseña.");
            return false;
        }

        if (password !== confirmarPassword) {
            setError("Las contraseñas no coinciden.");
            return false;
        }

        if (nivelPassword === "Débil") {
            setError(
                "La contraseña es débil. Use mayúsculas, minúsculas, números, símbolos y mínimo 8 caracteres."
            );
            return false;
        }

        return true;
    };

    const registrarUsuario = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validarFormulario()) return;

        try {
            setCargando(true);

            await api.post("/usuario", {
                nom_usuario,
                correo,
                password,
                rol: "cliente",
            });

            setMensaje("Usuario registrado correctamente. Ahora puede iniciar sesión.");
            setError("");

            setNomUsuario("");
            setCorreo("");
            setPassword("");
            setConfirmarPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const mensajeBackend =
                    error.response?.data?.message || "No se pudo registrar el usuario.";

                setError(
                    Array.isArray(mensajeBackend) ? mensajeBackend.join(", ") : mensajeBackend
                );
            } else {
                setError("Ocurrió un error inesperado.");
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <h1 className="auth-logo">Urban Style</h1>
                <h2 className="auth-brand-title">Ropa Deportiva</h2>
                <p className="auth-description">
                    Crea tu cuenta para comprar productos deportivos y utilizar el carrito de compras.
                </p>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <h2 className="auth-title">Crear cuenta</h2>
                    <p className="auth-subtitle">Registre sus datos para acceder como cliente.</p>

                    <form onSubmit={registrarUsuario}>
                        <div className="auth-group">
                            <label className="auth-label">Nombre de usuario</label>
                            <input
                                type="text"
                                placeholder="Ej: Juan Perez"
                                value={nom_usuario}
                                onChange={(e) => setNomUsuario(e.target.value)}
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-group">
                            <label className="auth-label">Correo electrónico</label>
                            <input
                                type="email"
                                placeholder="Ej: juan@gmail.com"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-group">
                            <label className="auth-label">Contraseña</label>
                            <input
                                type="password"
                                placeholder="Ingrese una contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                            />

                            {password && (
                                <p
                                    className="auth-password-strength"
                                    style={{ color: colorSeguridad(nivelPassword) }}
                                >
                                    Seguridad: {nivelPassword}
                                </p>
                            )}

                            {nivelPassword === "Débil" && password && (
                                <p className="auth-warning">
                                    La contraseña es débil. Se recomienda usar mayúsculas, minúsculas,
                                    números, símbolos y mínimo 8 caracteres.
                                </p>
                            )}
                        </div>

                        <div className="auth-group">
                            <label className="auth-label">Confirmar contraseña</label>
                            <input
                                type="password"
                                placeholder="Repita la contraseña"
                                value={confirmarPassword}
                                onChange={(e) => setConfirmarPassword(e.target.value)}
                                className="auth-input"
                            />
                        </div>

                        {error && <p className="auth-error">{error}</p>}
                        {mensaje && <p className="auth-success">{mensaje}</p>}

                        <button type="submit" className="auth-button" disabled={cargando}>
                            {cargando ? "Registrando..." : "Crear cuenta"}
                        </button>
                    </form>

                    <p className="auth-text-login">¿Ya tienes cuenta?</p>

                    <Link to="/login" className="auth-outline-link">
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
