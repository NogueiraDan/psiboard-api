import { PatientDto } from "src/patient/dto/create-patient.dto";
import { ProfessionalDto } from "src/professional/dto/create-professional.dto";

export class SchedulingDto {
    readonly date: string;
    readonly hour: string;
    type: string;
    patient: PatientDto;
    professional: ProfessionalDto;
}
