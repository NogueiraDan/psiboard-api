import { Injectable } from '@nestjs/common';
import { SchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';

@Injectable()
export class SchedulingService {
  create(schedulingDto: SchedulingDto) {
    return 'This action adds a new scheduling';
  }

  findAll() {
    return `This action returns all scheduling`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduling`;
  }

  update(id: number, updateSchedulingDto: UpdateSchedulingDto) {
    return `This action updates a #${id} scheduling`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduling`;
  }
}
