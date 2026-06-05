import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DetalleCarritoService } from './detalle-carrito.service';
import { CreateDetalleCarritoDto } from './dto/create-detalle-carrito.dto';
import { UpdateDetalleCarritoDto } from './dto/update-detalle-carrito.dto';

@Controller('detalle-carrito')
export class DetalleCarritoController {
  constructor(private readonly detalleCarritoService: DetalleCarritoService) { }

  @Post()
  create(@Body() createDetalleCarritoDto: CreateDetalleCarritoDto) {
    return this.detalleCarritoService.create(createDetalleCarritoDto);
  }

  @Get()
  findAll() {
    return this.detalleCarritoService.findAll();
  }

  @Get('carrito/:id_carrito')
  findByCarrito(@Param('id_carrito', ParseIntPipe) id_carrito: number) {
    return this.detalleCarritoService.findByCarrito(id_carrito);
  }

  @Patch(':id_carrito/:id_producto')
  update(
    @Param('id_carrito', ParseIntPipe) id_carrito: number,
    @Param('id_producto', ParseIntPipe) id_producto: number,
    @Body() updateDetalleCarritoDto: UpdateDetalleCarritoDto,
  ) {
    return this.detalleCarritoService.update(
      id_carrito,
      id_producto,
      updateDetalleCarritoDto,
    );
  }

  @Delete(':id_carrito/:id_producto')
  remove(
    @Param('id_carrito', ParseIntPipe) id_carrito: number,
    @Param('id_producto', ParseIntPipe) id_producto: number,
  ) {
    return this.detalleCarritoService.remove(id_carrito, id_producto);
  }
}