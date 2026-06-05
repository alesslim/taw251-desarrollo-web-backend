import { Carrito } from 'src/carrito/entities/carrito.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('detalle_carrito')
export class DetalleCarrito {
    @PrimaryColumn()
    id_carrito!: number;

    @PrimaryColumn()
    id_producto!: number;

    @ManyToOne(() => Carrito, (carrito) => carrito.detalles)
    @JoinColumn({ name: 'id_carrito' })
    carrito!: Carrito;

    @ManyToOne(() => Producto, (producto) => producto.detalles_carrito)
    @JoinColumn({ name: 'id_producto' })
    producto!: Producto;

    @Column({ type: 'int' })
    cantidad!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio_unitario!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal!: number;

    @UpdateDateColumn({ type: 'timestamp' })
    fecha_actualizacion!: Date;
}