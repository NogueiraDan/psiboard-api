import { Injectable } from '@nestjs/common';
import { ProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfessionalRepository } from './repository/professional.repository';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(ProfessionalRepository)
    private professionalRepository: ProfessionalRepository,
  ) {}

  async create(professionalDto: ProfessionalDto) {
    const { name, email, password } = professionalDto;
    if (!name || !email || !password) {
       throw new HttpException(
         'Todos os campos são requeridos',
         HttpStatus.BAD_REQUEST,
       );
    }
    const existProfessional = await this.professionalRepository.findOne({
      where: { email: email },
    });
    if (existProfessional) {
     throw new HttpException(
       'Este email já está sendo utilizado',
       HttpStatus.BAD_REQUEST,
     );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    professionalDto.password = hashedPassword;
    const professional = this.professionalRepository.create(professionalDto);
    return await this.professionalRepository.save(professional);
  }

  async findAll() {
    return await this.professionalRepository.find();
  }

  async findOne(id: string) {
    const professional = await this.professionalRepository.findOne({
      where: { id: id },
    });
    return professional;
  }

  async findOneByEmail(email:string) {
    return this.professionalRepository.findOneBy({ email: email });
  }

  async update(id: string, updateProfessionalDto: UpdateProfessionalDto) {
    await this.professionalRepository.update(id, updateProfessionalDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.professionalRepository.delete(id);
  }
}
