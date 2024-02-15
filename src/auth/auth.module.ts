import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professional } from 'src/professional/entities/professional.entity';
import { ProfessionalService } from 'src/professional/professional.service';
import { CustomJwtAuthGuard } from './CustomJwtAuthGuard';
import { ProfessionalRepository } from 'src/professional/repository/professional.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Professional]),
    JwtModule
  ],
  providers: [
    AuthService,
    ProfessionalService,
    ProfessionalRepository,
    CustomJwtAuthGuard,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
