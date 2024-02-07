import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professional } from 'src/professional/entities/professional.entity';
import { ProfessionalService } from 'src/professional/professional.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { ProfessionalRepository } from 'src/professional/repository/professional.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Professional]),
    PassportModule,
    JwtModule,
  ],
  providers: [
    AuthService,
    ProfessionalService,
    ProfessionalRepository,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
