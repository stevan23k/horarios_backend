import { IsNumber, IsString } from 'class-validator';

export class createHorarios {
  @IsString()
  dia: string;

  @IsString()
  hora_inicio: string;

  @IsString()
  hora_fin: string;

  @IsNumber()
  asignaturas: number;
}
