import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateProductoDto {
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    id_categoria!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre!: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    img?: string;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    stock!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    descripcion!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    marca!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    talla!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    color!: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    precio!: number;
}