import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateDetalleCarritoDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    id_carrito!: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    id_producto!: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    cantidad!: number;
}