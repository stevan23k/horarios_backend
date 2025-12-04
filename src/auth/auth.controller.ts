import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDTO } from './dto/register.dto';
import { loginDTO } from './dto/login.dto';
import { type Request, type Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authSrv: AuthService) {}

  @Post('register')
  register(@Body() user: registerDTO) {
    return this.authSrv.register(user);
  }

  @Post('login')
  async login(
    @Body() user: loginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authSrv.login(user);
    res.cookie('token', response.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 86400000,
      priority: 'high',
      path: '/',
    });
    res.json({
      login: 'ok',
    });
  }

  @UseGuards(AuthGuard)
  @Get('check')
  check(@Req() req: Request): any {
    if (req) {
      return true;
    }
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token');
    res.json({
      logout: 'ok',
    });
  }

  @UseGuards(AuthGuard)
  @Get('perfil')
  profile(@Req() req: Request) {
    return req['user'];
  }
}
