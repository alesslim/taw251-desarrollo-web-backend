import { Producto } from 'src/producto/entities/producto.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('categoria')
export class Categoria {
    @PrimaryGeneratedColumn()
    id_categoria!: number;

    @Column({ type: 'varchar', length: 100 })
    nombre!: string;

    @Column({ type: 'varchar', length: 255 })
    descripcion!: string;

    @Column({ type: 'boolean', default: true })
    estado!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    fecha_registro!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    fecha_actualizacion!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    fecha_eliminacion!: Date | null;

    @OneToMany(() => Producto, (producto) => producto.categoria)
    productos!: Producto[];
}