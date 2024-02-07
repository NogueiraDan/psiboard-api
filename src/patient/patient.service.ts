import { Injectable } from '@nestjs/common';
import { PatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientRepository } from './repository/patient.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class PatientService {
  
  constructor(
    @InjectRepository(PatientRepository)
    private patientRepository: PatientRepository
  ){}

  async create(patientDto: PatientDto) {
    const {name, age, phone, email, adress, zip_code, professional} = patientDto;

    if(!name || !age || !phone || !email || !adress || !zip_code || !professional){
         throw new HttpException(
           'Todos os campos são requeridos',
           HttpStatus.BAD_REQUEST,
         );
    }
    

    return await this.patientRepository.save(patientDto);

  }

  async findAll() { 
    return await this.patientRepository.find();
  }

  async findOne(id: string) {
    const patient = await this.patientRepository.findOne({
      where: { id: id },
    });
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    await this.patientRepository.update(id, updatePatientDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return await this.patientRepository.delete(id);
  }
}
