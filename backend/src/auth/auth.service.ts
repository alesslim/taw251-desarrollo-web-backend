import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { RegistroAcceso } from '../registro-acceso/entities/registro-acceso.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,

        @InjectRepository(RegistroAcceso)
        private readonly registroRepository: Repository<RegistroAcceso>,

        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto, ip: string, navegador: string) {
        const { correo, password } = loginDto;

        const usuario = await this.usuarioRepository
            .createQueryBuilder('usuario')
            .addSelect('usuario.password_hash')
            .where('usuario.correo = :correo', { correo })
            .getOne();

        if (!usuario) {
            throw new UnauthorizedException('Correo o contraseña incorrectos');
        }

        if (!usuario.estado) {
            throw new UnauthorizedException('El usuario se encuentra inactivo');
        }

        const passwordValido = await bcrypt.compare(
            password,
            usuario.password_hash,
        );

        if (!passwordValido) {
            throw new UnauthorizedException('Correo o contraseña incorrectos');
        }

        const payload = {
            sub: usuario.id_usuario,
            correo: usuario.correo,
            rol: usuario.rol,
        };

        const token = this.jwtService.sign(payload);

        const registro = this.registroRepository.create({
            usuario,
            ip,
            navegador,
            evento: 'ingreso',
        });

        await this.registroRepository.save(registro);

        return {
            access_token: token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nom_usuario: usuario.nom_usuario,
                correo: usuario.correo,
                rol: usuario.rol,
            },
        };
    }

    async logout(logoutDto: LogoutDto, ip: string, navegador: string) {
        const usuario = await this.usuarioRepository.findOne({
            where: {
                id_usuario: logoutDto.id_usuario,
                estado: true,
            },
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado o inactivo');
        }

        const registroSalida = this.registroRepository.create({
            usuario,
            ip,
            navegador,
            evento: 'salida',
        });

        await this.registroRepository.save(registroSalida);

        return {
            mensaje: 'Salida registrada correctamente',
        };
    }
}