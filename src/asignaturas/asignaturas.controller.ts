import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AsignaturasService } from './asignaturas.service';
import { createAsignatura } from './DTO/createAsignatura.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('asignaturas')
export class AsignaturasController {
  constructor(private asignaturasSrv: AsignaturasService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAsignaturas() {
    return this.asignaturasSrv.getAsignaturas();
  }

  @UseGuards(AuthGuard)
  @Post('create')
  createAsignatura(@Body() asignatura: createAsignatura) {
    return this.asignaturasSrv.createAsignaturas(asignatura);
  }
}
