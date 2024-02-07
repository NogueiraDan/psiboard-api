import { Professional } from "../entities/professional.entity";
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class ProfessionalRepository extends Repository<Professional> {
  constructor(dataSource: DataSource) {
    super(Professional, dataSource.createEntityManager());
  }
}
