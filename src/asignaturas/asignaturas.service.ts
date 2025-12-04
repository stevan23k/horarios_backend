import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { asignaturas } from './asignaturas.entity';
import { Repository } from 'typeorm';
import { createAsignatura } from './DTO/createAsignatura.dto';

@Injectable()
export class AsignaturasService {
  constructor(
    @InjectRepository(asignaturas)
    private asignaturasRepository: Repository<asignaturas>,
  ) {}

  getAsignaturas() {
    return this.asignaturasRepository.find();
  }
  createAsignaturas(asignatura: createAsignatura) {
    try {
      const newAsignatura = this.asignaturasRepository.create({
        nombre: asignatura.nombre,
        descripcion: asignatura.descripcion,
        max_hora_semana: asignatura.max_hora_semana,
      });

      this.asignaturasRepository.save(newAsignatura);
      return { mensaje: 'asignatura creada' };
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  findAsignaturaById(id: number) {
    return this.asignaturasRepository.findOne({ where: { id: id } });
  }
}
