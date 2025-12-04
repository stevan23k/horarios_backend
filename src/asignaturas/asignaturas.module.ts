import { Module } from '@nestjs/common';
import { AsignaturasController } from './asignaturas.controller';
import { AsignaturasService } from './asignaturas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { asignaturas } from './asignaturas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([asignaturas])],
  controllers: [AsignaturasController],
  providers: [AsignaturasService],
  exports: [AsignaturasService],
})
export class AsignaturasModule {}
