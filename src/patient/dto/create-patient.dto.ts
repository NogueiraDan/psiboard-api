import { IsString, IsNotEmpty, IsNumber, IsEmail} from 'class-validator';
import { ProfessionalDto } from '../../professional/dto/create-professional.dto';

export class PatientDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly age: number;

  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly adress: string;

  @IsString()
  @IsNotEmpty()
  readonly zip_code: string;

  @IsString()
  readonly info_add: string;

  @IsNotEmpty()
  professional: ProfessionalDto;
}
