import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { Usuario } from 'src/usuario/entities/usuario.entity';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { Carrito } from './entities/carrito.entity';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private readonly carritoRepository: Repository<Carrito>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async create(createCarritoDto: CreateCarritoDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        id_usuario: createCarritoDto.id_usuario,
        estado: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(
        `El usuario con id ${createCarritoDto.id_usuario} no existe o está inactivo`,
      );
    }

    const carritoActivo = await this.carritoRepository.findOne({
      where: {
        usuario: {
          id_usuario: createCarritoDto.id_usuario,
        },
        estado: true,
      },
      relations: {
        usuario: true,
      },
    });

    if (carritoActivo) {
      throw new NotFoundException(
        `El usuario con id ${createCarritoDto.id_usuario} ya tiene un carrito activo`,
      );
    }

    const carrito = this.carritoRepository.create({
      usuario,
      estado: true,
      total: 0,
    });

    const carritoGuardado = await this.carritoRepository.save(carrito);

    return {
      mensaje: 'Carrito creado correctamente',
      carrito: this.formatearCarrito(carritoGuardado),
    };
  }

  async findAll() {
    const carritos = await this.carritoRepository.find({
      withDeleted: true,
      relations: {
        usuario: true,
      },
      order: {
        id_carrito: 'ASC',
      },
    });

    return carritos.map((carrito) => this.formatearCarrito(carrito));
  }

  async findOne(id: number) {
    const carrito = await this.carritoRepository.findOne({
      where: {
        id_carrito: id,
      },
      relations: {
        usuario: true,
      },
    });

    if (!carrito) {
      throw new NotFoundException(`El carrito con id ${id} no existe`);
    }

    return this.formatearCarrito(carrito);
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

    const carritos = await this.carritoRepository.find({
      withDeleted: true,
      where: {
        usuario: {
          id_usuario,
        },
      },
      relations: {
        usuario: true,
      },
      order: {
        fecha_creacion: 'DESC',
      },
    });

    return carritos.map((carrito) => this.formatearCarrito(carrito));
  }

  async remove(id: number) {
    const carrito = await this.carritoRepository.findOne({
      where: {
        id_carrito: id,
        estado: true,
      },
      relations: {
        usuario: true,
      },
    });

    if (!carrito) {
      throw new NotFoundException(`El carrito con id ${id} no existe o ya está inactivo`);
    }

    carrito.estado = false;
    await this.carritoRepository.save(carrito);

    await this.carritoRepository.softDelete(id);

    return {
      mensaje: `Carrito con id ${id} desactivado correctamente`,
    };
  }

  async activar(id: number) {
    const carrito = await this.carritoRepository.findOne({
      where: {
        id_carrito: id,
      },
      withDeleted: true,
      relations: {
        usuario: true,
      },
    });

    if (!carrito) {
      throw new NotFoundException(`El carrito con id ${id} no existe`);
    }

    const carritoActivo = await this.carritoRepository.findOne({
      where: {
        usuario: {
          id_usuario: carrito.usuario.id_usuario,
        },
        estado: true,
        id_carrito: Not(id),
      },
      relations: {
        usuario: true,
      },
    });

    if (carritoActivo) {
      throw new NotFoundException('El usuario ya tiene otro carrito activo');
    }

    await this.carritoRepository.restore(id);

    await this.carritoRepository.update(id, {
      estado: true,
    });

    return {
      mensaje: `Carrito con id ${id} activado correctamente`,
    };
  }

  private formatearCarrito(carrito: Carrito) {
    return {
      id_carrito: carrito.id_carrito,
      id_usuario: carrito.usuario.id_usuario,
      nom_usuario: carrito.usuario.nom_usuario,
      correo: carrito.usuario.correo,
      estado: carrito.estado,
      total: Number(carrito.total),
      fecha_creacion: carrito.fecha_creacion,
      fecha_actualizacion: carrito.fecha_actualizacion,
      fecha_eliminacion: carrito.fecha_eliminacion,
    };
  }
}