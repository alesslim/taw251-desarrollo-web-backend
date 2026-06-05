import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleCarritoService } from './detalle-carrito.service';
import { DetalleCarritoController } from './detalle-carrito.controller';
import { DetalleCarrito } from './entities/detalle-carrito.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleCarrito, Carrito, Producto])],
  controllers: [DetalleCarritoController],
  providers: [DetalleCarritoService],
})
export class DetalleCarritoModule { }