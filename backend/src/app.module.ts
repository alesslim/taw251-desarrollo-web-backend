import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { CarritoModule } from './carrito/carrito.module';
import { CategoriaModule } from './categoria/categoria.module';
import { DetalleCarritoModule } from './detalle-carrito/detalle-carrito.module';
import { ProductoModule } from './producto/producto.module';
import { RegistroAccesoModule } from './registro-acceso/registro-acceso.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,
    UsuarioModule,
    CategoriaModule,
    ProductoModule,
    CarritoModule,
    DetalleCarritoModule,
    RegistroAccesoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }