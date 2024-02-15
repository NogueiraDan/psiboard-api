import { Module } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { ProfessionalRepository } from './repository/professional.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProfessionalController],
  providers: [ProfessionalService, ProfessionalRepository],
  imports:[AuthModule]
})
export class ProfessionalModule {}
