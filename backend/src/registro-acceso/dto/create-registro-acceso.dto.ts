import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRegistroAccesoDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    id_usuario!: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    navegador!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    ip!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    @IsIn(['ingreso', 'salida'])
    evento!: string;
}