import nikedos from "../assets/images/nikedoslineas.jpeg";
import retro4 from "../assets/images/retro4.jpeg";
import poleradi from "../assets/images/poleraadidas.jpeg";

export type Producto = {
  id: number;
  nombre: string;
  marca: string;
  categoria: string;
  talla: string;
  precio: number;
  stock: number;
  estado: string;
  imagen: string;
};

export const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: "Rompeviento",
    marca: "Nike",
    categoria: "Chaquetas",
    talla: "M",
    precio: 380,
    stock: 10,
    estado: "Activo",
    imagen: nikedos,
  },
  {
    id: 2,
    nombre: "Retro 4 Metallic Red",
    marca: "Jordan",
    categoria: "Calzados",
    talla: "42.5",
    precio: 480,
    stock: 8,
    estado: "Activo",
    imagen: retro4,
  },
  {
    id: 3,
    nombre: "Chaqueta Rompeviento",
    marca: "Nike",
    categoria: "Chaquetas",
    talla: "L",
    precio: 280,
    stock: 5,
    estado: "Inactivo",
    imagen: retro4,
  },
  {
    id: 4,
    nombre: "Polera Deportiva",
    marca: "Adidas",
    categoria: "Poleras",
    talla: "M",
    precio: 95,
    stock: 20,
    estado: "Activo",
    imagen: poleradi,
  },
];