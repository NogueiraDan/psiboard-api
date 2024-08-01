import { PartialType } from '@nestjs/mapped-types';
import { PatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(PatientDto) {}
