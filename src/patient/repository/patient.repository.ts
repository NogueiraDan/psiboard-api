import { Patient } from "../entities/patient.entity";
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class PatientRepository extends Repository<Patient> {
  constructor(dataSource: DataSource) {
    super(Patient, dataSource.createEntityManager());
  }
}
