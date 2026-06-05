import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroAccesoDto } from './create-registro-acceso.dto';

export class UpdateRegistroAccesoDto extends PartialType(CreateRegistroAccesoDto) {}
