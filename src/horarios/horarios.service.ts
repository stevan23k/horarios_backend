import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { horarios } from './horarios.entity';
import { Repository } from 'typeorm';
import { createHorarios } from './DTO/createHorarios.dto';
import { AsignaturasService } from 'src/asignaturas/asignaturas.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(horarios)
    private horariosRepository: Repository<horarios>,
    private asignaturasSrv: AsignaturasService,
    private usauriosSrv: UsuariosService,
  ) {}

  private parseHora(hora: string | Date): Date {
    if (hora instanceof Date) {
      return hora;
    }

    if (typeof hora === 'string') {
      return new Date(`1970-01-01T${hora.length === 5 ? hora + ':00' : hora}`);
    }

    throw new Error('Formato de hora inválido');
  }

  deleteHorario(id: number) {
    return this.horariosRepository.delete(id);
  }

  async getHorarios(id: number) {
    const user = await this.usauriosSrv.findUserById(id);
    if (!user) {
      throw new HttpException('error al encontrar el usuario', 400);
    }
    return this.horariosRepository.find({
      where: {
        usuario: user,
      },
      relations: {
        usuario: true,
        asignatura: true,
      },
    });
  }

  async createHorario(horario: createHorarios, userId: number) {
    const findUsuario = await this.usauriosSrv.findUserById(userId);
    if (!findUsuario) {
      throw new HttpException('usuario no encontrado', 400);
    }

    const findAsignatura = await this.asignaturasSrv.findAsignaturaById(
      horario.asignaturas,
    );

    if (!findAsignatura) {
      throw new HttpException('asignatura no encontrada', 400);
    }

    if (horario.hora_inicio >= horario.hora_fin) {
      throw new HttpException(
        'la hora de fin no debe ser menor o igual a la hora de inicio',
        402,
      );
    }

    const solap = await this.horariosRepository
      .createQueryBuilder('h')
      .where('h.usuarios_id = :id', { id: userId })
      .andWhere('h.dia = :dia', { dia: horario.dia })
      .andWhere('h.hora_inicio < :hora_fin AND h.hora_fin > :hora_inicio', {
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin,
      })
      .getOne();

    if (solap) {
      throw new HttpException(
        'ya tienes una materia registrada a esa hora',
        402,
      );
    }

    const asignaturasHoras = await this.horariosRepository.find({
      where: {
        usuario: findUsuario,
        asignatura: findAsignatura,
      },
    });

    const hora_max = findAsignatura.max_hora_semana;

    const horasActuales = asignaturasHoras.reduce((total, h) => {
      const inicio = this.parseHora(h.hora_inicio);
      const fin = this.parseHora(h.hora_fin);

      return total + (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
    }, 0);

    const inicioNuevo = this.parseHora(horario.hora_inicio);
    const finNuevo = this.parseHora(horario.hora_fin);

    const horasNuevas =
      (finNuevo.getTime() - inicioNuevo.getTime()) / (1000 * 60 * 60);

    if (horasActuales + horasNuevas > hora_max) {
      throw new HttpException(
        `No se puede exceder el máximo de ${hora_max} horas semanales.`,
        400,
      );
    }

    const newHorario = this.horariosRepository.create({
      dia: horario.dia,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
      asignatura: findAsignatura,
      usuario: findUsuario,
    });

    this.horariosRepository.save(newHorario);
    return { mensaje: 'horario creado', newHorario };
  }
}
