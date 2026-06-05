import { Navigate, Outlet } from "react-router-dom";

type UsuarioLocal = {
    id_usuario: number;
    nom_usuario: string;
    correo: string;
    rol: string;
};

export default function PrivateRoute() {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!token || !usuarioGuardado) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        return <Navigate to="/login" replace />;
    }

    try {
        const usuario: UsuarioLocal = JSON.parse(usuarioGuardado);

        if (!usuario.id_usuario || !usuario.rol) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            return <Navigate to="/login" replace />;
        }

        return <Outlet />;
    } catch (error) {
        console.error("Error al leer usuario:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        return <Navigate to="/login" replace />;
    }
}