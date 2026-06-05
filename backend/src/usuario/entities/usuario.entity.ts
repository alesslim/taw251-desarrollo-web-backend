import { Carrito } from 'src/carrito/entities/carrito.entity';
import { RegistroAcceso } from 'src/registro-acceso/entities/registro-acceso.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn()
    id_usuario!: number;

    @Column({ type: 'varchar', length: 100 })
    nom_usuario!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    correo!: string;

    @Column({ name: 'password', type: 'varchar', length: 255, select: false })
    password_hash!: string;

    @Column({ type: 'varchar', length: 30, default: 'cliente' })
    rol!: string;

    @Column({ type: 'boolean', default: true })
    estado!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    fecha_registro!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    fecha_actualizacion!: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    fecha_eliminacion!: Date | null;

    @OneToMany(() => RegistroAcceso, (registro) => registro.usuario)
    registros_acceso!: RegistroAcceso[];

    @OneToMany(() => Carrito, (carrito) => carrito.usuario)
    carritos!: Carrito[];
}