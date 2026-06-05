import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoriaDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    nombre!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    descripcion!: string;
}
