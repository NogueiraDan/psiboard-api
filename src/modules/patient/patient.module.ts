import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientRepository } from './repository/patient.repository';

@Module({
  controllers: [PatientController],
  providers: [PatientService, PatientRepository],
})
export class PatientModule {}
