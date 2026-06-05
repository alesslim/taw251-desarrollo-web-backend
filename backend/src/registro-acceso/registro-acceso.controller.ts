import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { RegistroAccesoService } from './registro-acceso.service';
import { CreateRegistroAccesoDto } from './dto/create-registro-acceso.dto';

@Controller('registro-acceso')
export class RegistroAccesoController {
  constructor(private readonly registroAccesoService: RegistroAccesoService
  ) { }

  @Get()
  findAll() {
    return this.registroAccesoService.findAll();
  }

  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario', ParseIntPipe) id_usuario: number) {
    return this.registroAccesoService.findByUsuario(id_usuario);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.registroAccesoService.findOne(id);
  }

  @Post()
  create(@Body() createRegistroAccesoDto: CreateRegistroAccesoDto) {
    return this.registroAccesoService.create(createRegistroAccesoDto);
  }
}