import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetalleCarritoDto } from './dto/create-detalle-carrito.dto';
import { UpdateDetalleCarritoDto } from './dto/update-detalle-carrito.dto';
import { DetalleCarrito } from './entities/detalle-carrito.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Injectable()
export class DetalleCarritoService {
  constructor(
    @InjectRepository(DetalleCarrito)
    private readonly detalleRepository: Repository<DetalleCarrito>,

    @InjectRepository(Carrito)
    private readonly carritoRepository: Repository<Carrito>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) { }

  private formatearDetalle(detalle: DetalleCarrito) {
    return {
      id_carrito: detalle.id_carrito,
      id_producto: detalle.id_producto,
      nombre_producto: detalle.producto.nombre,
      cantidad: detalle.cantidad,
      precio_unitario: Number(detalle.precio_unitario),
      subtotal: Number(detalle.subtotal),
    };
  }

  async create(createDetalleCarritoDto: CreateDetalleCarritoDto) {
    const carrito = await this.carritoRepository.findOne({
      where: {
        id_carrito: createDetalleCarritoDto.id_carrito,
        estado: true,
      },
    });

    if (!carrito) {
      throw new NotFoundException(
        `El carrito con id ${createDetalleCarritoDto.id_carrito} no existe o está inactivo`,
      );
    }

    const producto = await this.productoRepository.findOne({
      where: {
        id_producto: createDetalleCarritoDto.id_producto,
        estado: true,
      },
    });

    if (!producto) {
      throw new NotFoundException(
        `El producto con id ${createDetalleCarritoDto.id_producto} no existe o está inactivo`,
      );
    }

    let detalle = await this.detalleRepository.findOne({
      where: {
        id_carrito: createDetalleCarritoDto.id_carrito,
        id_producto: createDetalleCarritoDto.id_producto,
      },
      relations: {
        producto: true,
      },
    });

    const nuevaCantidad = detalle
      ? detalle.cantidad + createDetalleCarritoDto.cantidad
      : createDetalleCarritoDto.cantidad;

    if (nuevaCantidad > producto.stock) {
      throw new BadRequestException(
        `Stock insuficiente. Stock disponible: ${producto.stock}`,
      );
    }

    const precioUnitario = Number(producto.precio);
    const subtotal = nuevaCantidad * precioUnitario;

    if (detalle) {
      detalle.cantidad = nuevaCantidad;
      detalle.precio_unitario = precioUnitario;
      detalle.subtotal = subtotal;
      detalle.carrito = carrito;
      detalle.producto = producto;
    } else {
      detalle = this.detalleRepository.create({
        id_carrito: carrito.id_carrito,
        id_producto: producto.id_producto,
        carrito,
        producto,
        cantidad: nuevaCantidad,
        precio_unitario: precioUnitario,
        subtotal,
      });
    }

    const detalleGuardado = await this.detalleRepository.save(detalle);

    await this.actualizarTotalCarrito(carrito.id_carrito);

    return {
      mensaje: 'Producto agregado al carrito correctamente',
      detalle: this.formatearDetalle(detalleGuardado),
    };
  }

  async findAll() {
    const detalles = await this.detalleRepository.find({
      relations: {
        carrito: true,
        producto: true,
      },
      order: {
        id_carrito: 'ASC',
        id_producto: 'ASC',
      },
    });

    return detalles.map((detalle) => this.formatearDetalle(detalle));
  }

  async findByCarrito(id_carrito: number) {
    const carrito = await this.carritoRepository.findOne({
      where: {
        id_carrito,
        estado: true,
      },
    });

    if (!carrito) {
      throw new NotFoundException(
        `El carrito con id ${id_carrito} no existe o esta inactivo`,
      );
    }

    const detalles = await this.detalleRepository.find({
      where: {
        id_carrito,
      },
      relations: {
        producto: true,
      },
      order: {
        id_producto: 'ASC',
      },
    });

    return detalles.map((detalle) => this.formatearDetalle(detalle));
  }

  async update(
    id_carrito: number,
    id_producto: number,
    updateDetalleCarritoDto: UpdateDetalleCarritoDto,
  ) {
    const detalle = await this.detalleRepository.findOne({
      where: {
        id_carrito,
        id_producto,
      },
      relations: {
        carrito: true,
        producto: true,
      },
    });

    if (!detalle) {
      throw new NotFoundException('El producto no existe en el carrito');
    }

    if (updateDetalleCarritoDto.cantidad > detalle.producto.stock) {
      throw new BadRequestException(
        `Stock insuficiente. Stock disponible: ${detalle.producto.stock}`,
      );
    }

    const precioUnitario = Number(detalle.producto.precio);

    detalle.cantidad = updateDetalleCarritoDto.cantidad;
    detalle.precio_unitario = precioUnitario;
    detalle.subtotal = detalle.cantidad * precioUnitario;

    const detalleActualizado = await this.detalleRepository.save(detalle);

    await this.actualizarTotalCarrito(id_carrito);

    return {
      mensaje: 'Cantidad actualizada correctamente',
      detalle: this.formatearDetalle(detalleActualizado),
    };
  }

  async remove(id_carrito: number, id_producto: number) {
    const detalle = await this.detalleRepository.findOne({
      where: {
        id_carrito,
        id_producto,
      },
    });

    if (!detalle) {
      throw new NotFoundException('El producto no existe en el carrito');
    }

    await this.detalleRepository.remove(detalle);

    await this.actualizarTotalCarrito(id_carrito);

    return {
      mensaje: 'Producto eliminado del carrito correctamente',
    };
  }

  private async actualizarTotalCarrito(id_carrito: number) {
    const detalles = await this.detalleRepository.find({
      where: {
        id_carrito,
      },
    });

    const total = detalles.reduce((suma, detalle) => {
      return suma + Number(detalle.subtotal);
    }, 0);

    await this.carritoRepository.update(id_carrito, {
      total,
    });
  }


}