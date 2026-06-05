import { Module } from '@nestjs/common';
import { RegistroAccesoService } from './registro-acceso.service';
import { RegistroAccesoController } from './registro-acceso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroAcceso } from './entities/registro-acceso.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroAcceso, Usuario])],
  controllers: [RegistroAccesoController],
  providers: [RegistroAccesoService],
})
export class RegistroAccesoModule {}
