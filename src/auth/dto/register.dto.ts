import { IsString } from 'class-validator';

export class registerDTO {
  @IsString()
  nombres: string;
  @IsString()
  apellidos: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
}
