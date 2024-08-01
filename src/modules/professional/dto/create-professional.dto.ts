import { IsString, IsNotEmpty} from 'class-validator';

export class ProfessionalDto{
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}