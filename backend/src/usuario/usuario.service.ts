import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existeCorreo = await this.usuarioRepository.findOne({
      where: {
        correo: createUsuarioDto.correo,
      },
      withDeleted: true,
    });

    if (existeCorreo) {
      throw new ConflictException('El correo ya se encuentra registrado');
    }

    const password_hash = await bcrypt.hash(createUsuarioDto.password, 10);

    const usuario = this.usuarioRepository.create({
      nom_usuario: createUsuarioDto.nom_usuario,
      correo: createUsuarioDto.correo,
      password_hash,
      rol: createUsuarioDto.rol ?? 'cliente',
      estado: true,
    });

    await this.usuarioRepository.save(usuario);

    return {
      mensaje: 'Usuario agregado exitosamente',
    };
  }

  async findAll() {
    return await this.usuarioRepository.find({
      withDeleted: true,
      order: {
        id_usuario: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario: id,
        fecha_eliminacion: IsNull(),
      },
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario: id,
        fecha_eliminacion: IsNull(),
      },
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }

    if (updateUsuarioDto.correo) {
      const existeCorreo = await this.usuarioRepository.findOne({
        where: {
          correo: updateUsuarioDto.correo,
        },
        withDeleted: true,
      });

      if (existeCorreo && existeCorreo.id_usuario !== id) {
        throw new ConflictException('El correo ya se encuentra registrado');
      }

      usuario.correo = updateUsuarioDto.correo;
    }

    if (updateUsuarioDto.nom_usuario) {
      usuario.nom_usuario = updateUsuarioDto.nom_usuario;
    }

    if (updateUsuarioDto.rol) {
      usuario.rol = updateUsuarioDto.rol;
    }

    if (updateUsuarioDto.password) {
      usuario.password_hash = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    await this.usuarioRepository.save(usuario);

    return {
      mensaje: 'Usuario actualizado correctamente',
    };
  }

  async remove(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario: id,
        fecha_eliminacion: IsNull(),
      },
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }

    usuario.estado = false;
    await this.usuarioRepository.save(usuario);

    await this.usuarioRepository.softDelete(id);

    return {
      mensaje: `Usuario con id ${id} desactivado correctamente`,
    };
  }

  async activar(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario: id,
      },
      withDeleted: true,
    });

    if (!usuario) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }

    await this.usuarioRepository.restore(id);

    usuario.estado = true;
    await this.usuarioRepository.save(usuario);

    return {
      mensaje: `Usuario con id ${id} activado correctamente`,
    };
  }
}