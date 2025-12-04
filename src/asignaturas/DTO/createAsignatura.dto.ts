import { IsNumber, IsString } from 'class-validator';

export class createAsignatura {
  @IsString()
  nombre: string;
  @IsString()
  descripcion: string;
  @IsNumber()
  max_hora_semana: number;
}
