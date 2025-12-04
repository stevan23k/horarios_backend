import { asignaturas } from 'src/asignaturas/asignaturas.entity';
import { usuarios } from 'src/usuarios/usuarios.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('schedules')
export class horarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  dia: string;

  @Column('time')
  hora_inicio: Date;

  @Column('time')
  hora_fin: Date;

  @ManyToOne(() => usuarios, (usuarios) => usuarios.horarios, {
    eager: false,
  })
  @JoinColumn({ name: 'usuarios_id' })
  usuario: usuarios;

  @ManyToOne(() => asignaturas, (asignaturas) => asignaturas.horarios, {
    eager: false,
  })
  @JoinColumn({ name: 'asignaturas_id' })
  asignatura: asignaturas;
}
