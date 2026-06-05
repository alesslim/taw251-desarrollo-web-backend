import { Navigate, Outlet } from "react-router-dom";

type Props = {
    rolesPermitidos: string[];
};

type UsuarioLocal = {
    id_usuario: number;
    nom_usuario: string;
    correo: string;
    rol: string;
};

export default function RoleRoute({ rolesPermitidos }: Props) {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!token || !usuarioGuardado) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        return <Navigate to="/login" replace />;
    }

    try {
        const usuario: UsuarioLocal = JSON.parse(usuarioGuardado);

        if (!rolesPermitidos.includes(usuario.rol)) {
            return <Navigate to="/unauthorized" replace />;
        }

        return <Outlet />;
    } catch (error) {
        console.error("Error al validar rol:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        return <Navigate to="/login" replace />;
    }
}