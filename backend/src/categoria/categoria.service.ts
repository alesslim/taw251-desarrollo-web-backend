import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) { }

  async create(createCategoriaDto: CreateCategoriaDto) {
    const nuevaCategoria = this.categoriaRepository.create(createCategoriaDto)

    await this.categoriaRepository.save(nuevaCategoria);

    return {
      mensaje: 'Categoría agregada exitosamente',
    };
  }

  async findAll() {
    return await this.categoriaRepository.find({
      withDeleted: true,
      order: {
        id_categoria: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findOne({
      where: {
        id_categoria: id,
        fecha_eliminacion: IsNull(),
      },
    });

    if (!categoria) {
      throw new NotFoundException(`La categoría con ID ${id} no existe`);
    }

    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);

    Object.assign(categoria, updateCategoriaDto);

    await this.categoriaRepository.save(categoria);

    return {
      mensaje: 'Categoría actualizada correctamente',
    };
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);

    categoria.estado = false;
    await this.categoriaRepository.save(categoria);

    await this.categoriaRepository.softDelete(id);

    return {
      mensaje: `Categoría con ID ${id} desactivada correctamente`,
    };
  }

  async activar(id: number) {
    const categoria = await this.categoriaRepository.findOne({
      where: {
        id_categoria: id,
      },
      withDeleted: true,
    });

    if (!categoria) {
      throw new NotFoundException(`La categoría con ID ${id} no existe`);
    }

    await this.categoriaRepository.restore(id);

    categoria.estado = true;
    await this.categoriaRepository.save(categoria);

    return {
      mensaje: `Categoría con ID ${id} activada correctamente`,
    };
  }
}