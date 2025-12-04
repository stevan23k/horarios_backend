import { horarios } from 'src/horarios/horarios.entity';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';

@Entity('asignaturas')
export class asignaturas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  max_hora_semana: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @OneToMany(() => horarios, (horarios) => horarios.asignatura)
  horarios: horarios;
}
