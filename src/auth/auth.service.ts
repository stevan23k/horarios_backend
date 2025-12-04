import { HttpException, Injectable } from '@nestjs/common';
import { registerDTO } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { usuarios } from 'src/usuarios/usuarios.entity';
import { Repository } from 'typeorm';
import { hashSync, compareSync } from 'bcrypt';
import { loginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(usuarios)
    private usuariosRepository: Repository<usuarios>,
    private jwtSrv: JwtService,
  ) {}

  async register(user: registerDTO) {
    try {
      const usuario = await this.usuariosRepository.findOne({
        where: {
          email: user.email,
        },
      });

      if (usuario) {
        throw new HttpException('email en uso', 403);
      }
      const passwordHash = hashSync(user.password, 12);
      const newUser = this.usuariosRepository.create({
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        password: passwordHash,
      });
      this.usuariosRepository.save(newUser);

      return { mensaje: 'usuario registrado', newUser };
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
  async login(user: loginDTO) {
    const foundUser = await this.usuariosRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (!foundUser) {
      throw new HttpException('usuarios no encontrado', 401);
    }

    const comparePassword = compareSync(user.password, foundUser.password);

    if (!comparePassword) {
      throw new HttpException('usuraios o contraseña incorrecta', 400);
    }
    const payload = { sub: foundUser.id, nombres: foundUser.nombres };

    return { login: 'ok', token: await this.jwtSrv.signAsync(payload) };
  }
}
