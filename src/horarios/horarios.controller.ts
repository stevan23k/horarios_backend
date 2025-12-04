import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { createHorarios } from './DTO/createHorarios.dto';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('horarios')
export class HorariosController {
  constructor(private horariosSrv: HorariosService) {}

  @UseGuards(AuthGuard)
  @Get()
  getHorarios(@Req() req: Request) {
    const user = req['user'];
    const id = user.sub;
    return this.horariosSrv.getHorarios(id);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  deleteHorario(@Param('id') id: number) {
    return this.horariosSrv.deleteHorario(id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  createHorarios(@Body() horario: createHorarios, @Req() req: Request) {
    const user = req['user'];
    const id = user.sub;
    return this.horariosSrv.createHorario(horario, id);
  }
}
