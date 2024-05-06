import { PatientDto } from 'src/patient/dto/create-patient.dto';
import { ProfessionalDto } from 'src/professional/dto/create-professional.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class SchedulingDto {
  @IsString()
  @IsNotEmpty()
  readonly date: string;

  @IsString()
  @IsNotEmpty()
  readonly hour: string;

  type: string;

  @IsString()
  @IsNotEmpty()
  patient: PatientDto;

  @IsString()
  @IsNotEmpty()
  professional: ProfessionalDto;
}
