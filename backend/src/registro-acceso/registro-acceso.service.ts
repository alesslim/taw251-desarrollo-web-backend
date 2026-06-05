import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from 'src/usuario/entities/usuario.entity';
import { CreateRegistroAccesoDto } from './dto/create-registro-acceso.dto';
import { RegistroAcceso } from './entities/registro-acceso.entity';

@Injectable()
export class RegistroAccesoService {
  constructor(
    @InjectRepository(RegistroAcceso)
    private readonly registroAccesoRepository: Repository<RegistroAcceso>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async create(createRegistroAccesoDto: CreateRegistroAccesoDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario: createRegistroAccesoDto.id_usuario,
        estado: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        `El usuario con id ${createRegistroAccesoDto.id_usuario} no existe o está inactivo`,
      );
    }

    const registro = this.registroAccesoRepository.create({
      usuario,
      ip: createRegistroAccesoDto.ip,
      navegador: createRegistroAccesoDto.navegador,
      evento: createRegistroAccesoDto.evento,
    });

    const registroGuardado = await this.registroAccesoRepository.save(registro);

    return {
      mensaje: 'Registro de acceso guardado correctamente',
      registro: this.formatearRegistro(registroGuardado),
    };
  }

  async findAll() {
    const registros = await this.registroAccesoRepository.find({
      order: {
        id_registro: 'DESC',
      },
    });

    return registros.map((registro) => this.formatearRegistro(registro));
  }

  async findOne(id: number) {
    const registro = await this.registroAccesoRepository.findOne({
      where: {
        id_registro: id,
      },
    });

    if (!registro) {
      throw new NotFoundException('Registro de acceso no encontrado');
    }

    return this.formatearRegistro(registro);
  }

  async findByUsuario(id_usuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario,
        estado: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        `El usuario con id ${id_usuario} no existe o está inactivo`,
      );
    }

    const registros = await this.registroAccesoRepository.find({
      where: {
        usuario: {
          id_usuario,
        },
      },
      relations: {
        usuario: true,
      },
      order: {
        fecha_hora: 'DESC',
      },
    });

    return registros.map((registro) => this.formatearRegistro(registro));
  }

  private formatearRegistro(registro: RegistroAcceso) {
    return {
      id_registro: registro.id_registro,
      id_usuario: registro.usuario?.id_usuario ?? registro.id_usuario,
      ip: registro.ip,
      navegador: registro.navegador,
      evento: registro.evento,
      fecha_hora: registro.fecha_hora,
    };
  }
}