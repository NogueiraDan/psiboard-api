import { Injectable, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';

import { SchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulingRepository } from './repository/scheduling.repository';

@Injectable()
export class SchedulingService {
  constructor (
    @InjectRepository(SchedulingRepository)
    private schedulingRepository: SchedulingRepository
  ){}

  async create(schedulingDto: SchedulingDto) {
    const {date, hour, type, patient, professional} = schedulingDto;

    if(!date || !hour || !patient || !professional){
       throw new HttpException(
         'Todos os campos são requeridos',
         HttpStatus.BAD_REQUEST,
       );
    }
    const scheduling = this.schedulingRepository.create(schedulingDto);
    return await this.schedulingRepository.save(scheduling);
  }

  async findAll() {
    return await this.schedulingRepository.find({
      relations: ['professional', 'patient'],
    }); 
  }

  async findOne(id: string) {
     const scheduling = await this.schedulingRepository.findOne({
       where: { id: id },
     });
     return scheduling;
  }

  async update(id: string, updateSchedulingDto: UpdateSchedulingDto) {
    await this.schedulingRepository.update(id, updateSchedulingDto);
    return this.findOne(id);
  }

  async remove(id: string) {
     await this.schedulingRepository.delete(id);
  }
}
