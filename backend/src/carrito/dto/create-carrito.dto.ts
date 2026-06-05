import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCarritoDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    id_usuario!: number;
}