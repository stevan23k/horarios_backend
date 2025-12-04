import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { editUserDTO } from './DTO/editUser.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosSrv: UsuariosService) {}

  @UseGuards(AuthGuard)
  @Get()
  getUsuarios() {
    return this.usuariosSrv.getUsuarios();
  }

  @UseGuards(AuthGuard)
  @Get('perfil/:id')
  getUserById(@Param('id') id: number) {
    console.log(id);
    return this.usuariosSrv.findUserById(id);
  }

  @UseGuards(AuthGuard)
  @Put('edit')
  editUser(
    @Body() user: editUserDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userToken = req['user'];
    const id = userToken.sub;
    console.log(id);
    this.usuariosSrv.editPerfil(id, user);

    res.clearCookie('token');
    res.json({
      editado: 'ok',
    });
  }
}
