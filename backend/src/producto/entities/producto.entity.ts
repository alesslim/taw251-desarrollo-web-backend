import { Categoria } from 'src/categoria/entities/categoria.entity';
import { DetalleCarrito } from 'src/detalle-carrito/entities/detalle-carrito.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('producto')
export class Producto {
    @PrimaryGeneratedColumn()
    id_producto!: number;

    @Column({ type: 'varchar', length: 100 })
    nombre!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    img!: string;

    @Column({ type: 'int', default: 0 })
    stock!: number;

    @Column({ type: 'varchar', length: 255 })
    descripcion!: string;

    @Column({ type: 'varchar', length: 100 })
    marca!: string;

    @Column({ type: 'varchar', length: 50 })
    talla!: string;

    @Column({ type: 'varchar', length: 50 })
    color!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio!: number;

    @Column({ type: 'boolean', default: true })
    estado!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    fecha_registro!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    fecha_actualizacion!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    fecha_eliminacion!: Date | null;

    @ManyToOne(() => Categoria, (categoria) => categoria.productos)
    @JoinColumn({ name: 'id_categoria' })
    categoria!: Categoria;

    @OneToMany(() => DetalleCarrito, (detalle) => detalle.producto)
    detalles_carrito!: DetalleCarrito[];
}