import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { usuarios } from './usuarios.entity';
import { Repository } from 'typeorm';
import { editUserDTO } from './DTO/editUser.dto';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(usuarios)
    private usuariosRepository: Repository<usuarios>,
  ) {}

  getUsuarios() {
    return this.usuariosRepository.find();
  }

  findUserById(id: number) {
    return this.usuariosRepository.findOne({ where: { id: id } });
  }

  async editPerfil(id: number, user: editUserDTO) {
    let passwordHash: string | undefined = undefined;
    if (user.password) {
      passwordHash = hashSync(user.password, 12);
    }
    const newUser = await this.usuariosRepository.update(id, {
      email: user.email,
      nombres: user.nombres,
      apellidos: user.apellidos,
      ...(passwordHash && { password: passwordHash }),
    });

    return { newUser };
  }
}
