import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) { }

  async create(createProductoDto: CreateProductoDto) {
    const categoria = await this.categoriaRepository.findOne({
      where: {
        id_categoria: createProductoDto.id_categoria,
        estado: true,
      },
    });

    if (!categoria) {
      throw new NotFoundException(
        `La categoría con ID ${createProductoDto.id_categoria} no existe o está inactiva`,
      );
    }

    const { id_categoria, ...datosProducto } = createProductoDto;

    const producto = this.productoRepository.create({
      ...datosProducto,
      categoria,
    });

    await this.productoRepository.save(producto);

    return {
      mensaje: 'Producto agregado exitosamente',
    };
  }

  async findAll() {
    return await this.productoRepository.find({
      withDeleted: true,
      relations: {
        categoria: true,
      },
      order: {
        id_producto: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({
      where: { id_producto: id },
      relations: {
        categoria: true,
      },
    });

    if (!producto) {
      throw new NotFoundException("Producto no encontrado");
    }

    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productoRepository.findOne({
      where: {
        id_producto: id,
      },
      relations: {
        categoria: true,
      },
      withDeleted: true,
    });

    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }

    if (
      updateProductoDto.id_categoria !== undefined &&
      updateProductoDto.id_categoria !== producto.categoria?.id_categoria
    ) {
      const categoria = await this.categoriaRepository.findOne({
        where: {
          id_categoria: updateProductoDto.id_categoria,
          estado: true,
        },
      });

      if (!categoria) {
        throw new NotFoundException(
          `La categoría con ID ${updateProductoDto.id_categoria} no existe o está inactiva`,
        );
      }

      producto.categoria = categoria;
    }

    producto.nombre = updateProductoDto.nombre ?? producto.nombre;
    producto.img = updateProductoDto.img ?? producto.img;
    producto.stock = updateProductoDto.stock ?? producto.stock;
    producto.descripcion = updateProductoDto.descripcion ?? producto.descripcion;
    producto.marca = updateProductoDto.marca ?? producto.marca;
    producto.talla = updateProductoDto.talla ?? producto.talla;
    producto.color = updateProductoDto.color ?? producto.color;
    producto.precio = updateProductoDto.precio ?? producto.precio;

    await this.productoRepository.save(producto);

    return {
      mensaje: 'Producto actualizado correctamente',
    };
  }

  async remove(id: number) {
    const producto = await this.productoRepository.findOne({
      where: {
        id_producto: id,
      },
    });

    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }

    producto.estado = false;
    await this.productoRepository.save(producto);

    await this.productoRepository.softDelete(id);

    return {
      mensaje: `Producto con ID ${id} desactivado correctamente`,
    };
  }

  async activar(id: number) {
    const producto = await this.productoRepository.findOne({
      where: {
        id_producto: id,
      },
      withDeleted: true,
    });

    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }

    await this.productoRepository.restore(id);

    await this.productoRepository.update(id, {
      estado: true,
    });

    return {
      mensaje: `Producto con ID ${id} activado correctamente`,
    };
  }

}
