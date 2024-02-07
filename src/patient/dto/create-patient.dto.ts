import {ProfessionalDto} from '../../professional/dto/create-professional.dto';
import {SchedulingDto} from '../../scheduling/dto/create-scheduling.dto';

export class PatientDto {
  readonly name: string;
  readonly age: number;
  readonly phone: string;
  readonly email: string;
  readonly adress: string;
  readonly zip_code: string;
  readonly info_add: string;
  professional: ProfessionalDto;
  scheduling: SchedulingDto;
}
