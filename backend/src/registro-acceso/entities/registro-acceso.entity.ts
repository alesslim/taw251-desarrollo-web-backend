import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('registro_acceso')
export class RegistroAcceso {
    @PrimaryGeneratedColumn()
    id_registro!: number;

    @Column({ name: 'id_usuario', type: 'int' })
    id_usuario!: number;

    @Column({ type: 'varchar', length: 100 })
    ip!: string;

    @Column({ type: 'varchar', length: 255 })
    navegador!: string;

    @Column({ type: 'varchar', length: 20 })
    evento!: string;

    @CreateDateColumn({ type: 'timestamp' })
    fecha_hora!: Date;

    @ManyToOne(() => Usuario, (usuario) => usuario.registros_acceso)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuario;
}