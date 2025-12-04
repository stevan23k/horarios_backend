import { Module } from '@nestjs/common';
import { HorariosController } from './horarios.controller';
import { HorariosService } from './horarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { horarios } from './horarios.entity';
import { AsignaturasModule } from 'src/asignaturas/asignaturas.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([horarios]),
    AsignaturasModule,
    UsuariosModule,
  ],
  controllers: [HorariosController],
  providers: [HorariosService],
})
export class HorariosModule {}
