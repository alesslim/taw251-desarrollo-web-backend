import { DetalleCarrito } from 'src/detalle-carrito/entities/detalle-carrito.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
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

@Entity('carrito')
export class Carrito {
    @PrimaryGeneratedColumn()
    id_carrito!: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.carritos, {
        nullable: false,
    })
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuario;

    @Column({ type: 'boolean', default: true })
    estado!: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total!: number;

    @CreateDateColumn({ type: 'timestamp' })
    fecha_creacion!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    fecha_actualizacion!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    fecha_eliminacion!: Date | null;

    @OneToMany(() => DetalleCarrito, (detalle) => detalle.carrito)
    detalles!: DetalleCarrito[];
}