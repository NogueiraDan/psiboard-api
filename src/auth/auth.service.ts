import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Professional } from '../modules/professional/entities/professional.entity';
import { ProfessionalService } from '../modules/professional/professional.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

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

    const token = this.jwtService.sign(
      { email: payload.email },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: '1h',
      },
    );

    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      process.env.ENCRYPTION_KEY,
      iv,
    );
    let encryptedToken = cipher.update(token, 'utf8', 'hex');
    encryptedToken += cipher.final('hex');

    return {
      access_token: encryptedToken,
      name,
      email,
      id,
    };
  }

  async decryptToken(encryptedToken: string): Promise<any> {
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      process.env.ENCRYPTION_KEY,
      iv,
    );
    let decryptedToken = decipher.update(encryptedToken, 'hex', 'utf8');
    decryptedToken += decipher.final('utf8');

    try {
      const payload = this.jwtService.verify(decryptedToken, { secret: process.env.SECRET_KEY });
      return payload;
    } catch (error) {
      console.error('Error decrypting token:', error); // Log para depuração
      throw new Error('Invalid token');
    }
  }
}
