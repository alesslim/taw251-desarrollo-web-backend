import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

export default function LoginPage() {
  const navegar = useNavigate();

  const generarCaptcha = () => {
    const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let codigo = "";

    for (let i = 0; i < 6; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return codigo;
  };

  const evaluarContrasena = (texto: string) => {
    const tieneMayuscula = /[A-Z]/.test(texto);
    const tieneMinuscula = /[a-z]/.test(texto);
    const tieneNumero = /\d/.test(texto);
    const tieneEspecial = /[^A-Za-z0-9]/.test(texto);

    if (texto.length < 6) {
      return { nivel: "Débil", color: "#ff6b6b" };
    }

    if (
      texto.length >= 8 &&
      tieneMayuscula &&
      tieneMinuscula &&
      tieneNumero &&
      tieneEspecial
    ) {
      return { nivel: "Fuerte", color: "#7CFC98" };
    }

    if (texto.length >= 6 && ((tieneMinuscula || tieneMayuscula) && tieneNumero)) {
      return { nivel: "Intermedia", color: "#ffd166" };
    }

    return { nivel: "Débil", color: "#ff6b6b" };
  };

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [captchaUsuario, setCaptchaUsuario] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [captchaCorrecto, setCaptchaCorrecto] = useState(generarCaptcha());

  const seguridadContrasena = evaluarContrasena(contrasena);

  const iniciarSesion = async () => {
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correo || !contrasena || !captchaUsuario) {
      setMensajeError("Todos los campos son obligatorios.");
      return;
    }

    if (!correoValido.test(correo)) {
      setMensajeError("Ingrese un correo electrónico válido.");
      return;
    }

    if (contrasena.length < 6) {
      setMensajeError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (captchaUsuario !== captchaCorrecto) {
      setMensajeError("El CAPTCHA es incorrecto.");
      setCaptchaCorrecto(generarCaptcha());
      setCaptchaUsuario("");
      return;
    }

    try {
      const respuesta = await api.post("/auth/login", {
        correo,
        password: contrasena,
      });

      localStorage.setItem("token", respuesta.data.access_token);
      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));

      setMensajeError("");
      setCaptchaCorrecto(generarCaptcha());
      setCaptchaUsuario("");

      const rolUsuario = respuesta.data.usuario.rol;

      if (rolUsuario === "admin") {
        navegar("/app/dashboard");
      } else {
        navegar("/store");
      }
    } catch (error: any) {
      setMensajeError(error.response?.data?.message || "Error al iniciar sesión.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1 className="auth-logo">Urban Style</h1>
        <h2 className="auth-brand-title">Ropa Deportiva</h2>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-title">Iniciar sesión</h2>
          <p className="auth-subtitle">
            Ingrese sus credenciales para acceder al sistema.
          </p>

          <div className="auth-group">
            <label className="auth-label">Correo electrónico</label>
            <input
              type="email"
              placeholder="Ingrese su correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="auth-group">
            <label className="auth-label">Contraseña</label>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="auth-input"
            />

            {contrasena && (
              <p
                className="auth-password-strength"
                style={{ color: seguridadContrasena.color }}
              >
                Seguridad: {seguridadContrasena.nivel}
              </p>
            )}
          </div>

          <div className="auth-group">
            <label className="auth-label">CAPTCHA</label>
            <div className="auth-captcha-box">{captchaCorrecto}</div>

            <button
              type="button"
              onClick={() => {
                setCaptchaCorrecto(generarCaptcha());
                setCaptchaUsuario("");
              }}
              className="auth-secondary-button"
            >
              Generar nuevo CAPTCHA
            </button>

            <input
              type="text"
              placeholder="Ingrese la respuesta"
              value={captchaUsuario}
              onChange={(e) => setCaptchaUsuario(e.target.value)}
              className="auth-input"
            />
          </div>

          {mensajeError && <p className="auth-error">{mensajeError}</p>}

          <button onClick={iniciarSesion} className="auth-button">
            Entrar al sistema
          </button>

          <p className="auth-footer-text">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="auth-link">
              Crear una cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
