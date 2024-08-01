import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessionalModule } from '../src/modules/professional/professional.module';
import { PatientModule } from '../src/modules/patient/patient.module';
import { SchedulingModule } from '../src/modules/scheduling/scheduling.module';
import {config} from './config/ormconfig';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forRoot(config),
    ProfessionalModule,
    PatientModule,
    SchedulingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
