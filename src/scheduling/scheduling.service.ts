import { Injectable, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';

import { SchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulingRepository } from './repository/scheduling.repository';
import { CustomException } from 'src/exceptions/custom.exception';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(SchedulingRepository)
    private schedulingRepository: SchedulingRepository,
  ) {}

  async create(schedulingDto: SchedulingDto) {
    const { date, hour, patient, professional } = schedulingDto;

    if (!date || !hour || !patient || !professional) {
      throw new HttpException(
        'Todos os campos são requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verifica se a hora está no formato HH:MM
    const hourPattern = /^(0[0-9]|1[0-9]|2[0-1]):[0-5][0-9]$/;
    if (!hourPattern.test(schedulingDto.hour)) {
      throw new HttpException(
        'Formato de hora inválido. Por favor envie no formato HH:MM',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verifica se o paciente já possui um agendamento na mesma data
    const patientSchedulingExists = await this.schedulingRepository
      .createQueryBuilder('scheduling')
      .leftJoinAndSelect('scheduling.patient', 'patient')
      .where('scheduling.patient = :patient', { patient })
      .andWhere('scheduling.date = :date', { date })
      .getOne();

    // O paciente já tem um agendamento marcado
    if (patientSchedulingExists) {
      const response = {
        message:
          'Esse paciente já possui um agendamento marcado para essa data',
        patientSchedulingExists,
      };
      throw new CustomException(response, HttpStatus.BAD_REQUEST);
    }

    // Verifique se já existe um agendamento para a mesma data e hora
    const schedulingUnavailable = await this.schedulingRepository.findOne({
      where: {
        date: schedulingDto.date,
        hour: schedulingDto.hour,
      },
    });
    if (schedulingUnavailable) {
      const response = {
        message:
          'Data e Hora indisponível, já existe um agendamento para essa data e hora. Tente novamente!',
        schedulingUnavailable,
      };
      throw new CustomException(response, HttpStatus.BAD_REQUEST);
    }

    // Cria o agendamento
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
    console.log('AGENDAMENTO DTO', updateSchedulingDto);

    const { date, type, patient } = updateSchedulingDto;

    // Verifique se já existe um agendamento para a mesma data e hora
    const schedulingUnavailable = await this.schedulingRepository.findOne({
      where: {
        date: updateSchedulingDto.date,
        hour: updateSchedulingDto.hour,
      },
    });
    if (schedulingUnavailable) {
      const response = {
        message:
          'Data e Hora indisponível, já existe um agendamento para essa data e hora. Tente novamente!',
        schedulingUnavailable,
      };
      throw new CustomException(response, HttpStatus.BAD_REQUEST);
    }

    // Verifica se o cliente já possui agendamento na mesma data
    const patientSchedulingExists = await this.schedulingRepository
      .createQueryBuilder('scheduling')
      .leftJoinAndSelect('scheduling.patient', 'patient')
      .where('scheduling.patient = :patient', { patient })
      .andWhere('scheduling.date = :date', { date })
      .getOne();

    if (patientSchedulingExists && type !== 'remarcacao') {
      const response = {
        message: 'O cliente já possui agendamento nesta data',
        patientSchedulingExists,
      };
      throw new CustomException(response, HttpStatus.BAD_REQUEST);
    }

    await this.schedulingRepository.update(id, updateSchedulingDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.schedulingRepository.delete(id);
  }
}
