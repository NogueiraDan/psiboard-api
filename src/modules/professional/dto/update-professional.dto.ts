import { PartialType } from '@nestjs/mapped-types';
import { ProfessionalDto } from './create-professional.dto';

// export class UpdateProfessionalDto extends PartialType(ProfessionalDto) {}

export class UpdateProfessionalDto {
  name: string;
  email: string;
}
