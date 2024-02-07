import { Scheduling } from '../entities/scheduling.entity';
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class SchedulingRepository extends Repository<Scheduling> {
  constructor(dataSource: DataSource) {
    super(Scheduling, dataSource.createEntityManager());
  }
}
