import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateDetalleCarritoDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    cantidad!: number;
}