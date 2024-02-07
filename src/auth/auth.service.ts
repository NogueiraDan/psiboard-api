import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Professional } from 'src/professional/entities/professional.entity';
import { ProfessionalService } from 'src/professional/professional.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly professionalService: ProfessionalService,
    private jwtService: JwtService,
  ) {}

  async validateProfessional(email: string, password: string): Promise<any> {
    const professional = await this.professionalService.findOneByEmail(email);

    if (!professional) {
      throw new UnauthorizedException('Email ou Senha Inválidos');
    }

    const matchPassword = await bcrypt.compare(password, professional.password);
    if (!matchPassword) {
      throw new UnauthorizedException('Senha incorreta!');
    }

    return await this.generateToken(professional);
  }

  async generateToken(payload: Professional) {
    const professional = await this.professionalService.findOneByEmail(
      payload.email,
    );
    const { name, email, id } = professional;

    return {
      access_token: this.jwtService.sign(
        { email: payload.email },
        {
          secret: 'super-secret-key',
          expiresIn: '1d',
        },
      ),
      name,
      email,
      id,
    };
  }
}
