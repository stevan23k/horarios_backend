import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AsignaturasModule } from './asignaturas/asignaturas.module';
import { HorariosModule } from './horarios/horarios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { usuarios } from './usuarios/usuarios.entity';
import { asignaturas } from './asignaturas/asignaturas.entity';
import { horarios } from './horarios/horarios.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [usuarios, asignaturas, horarios],
      synchronize: true,
    }),
    UsuariosModule,
    AsignaturasModule,
    HorariosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
