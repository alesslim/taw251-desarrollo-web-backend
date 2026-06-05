import {
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    nom_usuario!: string;

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(100)
    correo!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password!: string;

    @IsOptional()
    @IsString()
    @IsIn(['admin', 'cliente'])
    rol?: string;
}