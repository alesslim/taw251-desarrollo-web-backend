import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class LogoutDto {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    id_usuario!: number;
}