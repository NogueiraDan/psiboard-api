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

  async getProfessionalSchedulingToday(professionalId: any, date: string) {
    const schedulings = await this.schedulingRepository
      .createQueryBuilder('scheduling')
      .leftJoinAndSelect('scheduling.patient', 'patient')
      .where('scheduling.professionalId = :professionalId', { professionalId })
      .andWhere('scheduling.date = :date', { date: date })
      .getMany();

    return schedulings;
  }

  async getProfessionalScheduling(professionalId: any) {
    const schedulings = await this.schedulingRepository
      .createQueryBuilder('scheduling')
      .leftJoinAndSelect('scheduling.patient', 'patient')
      .where('scheduling.professionalId = :professionalId', { professionalId })
      .getMany();
    return schedulings;
  }

  async getAvailableSchedules(date: string) {

    const formatDate = (dateToFormat:any) => {
      // Verifica se a data tem o formato correto (8 dígitos)
      if (/^\d{8}$/.test(dateToFormat)) {
        // Formata a data para "DD/MM/YYYY"
        return `${dateToFormat.substr(0, 2)}/${dateToFormat.substr(2, 2)}/${dateToFormat.substr(4)}`;
      } else {
        // Caso a data não esteja no formato correto, retorne a data original
        return dateToFormat;
      }
    };

    const dateFormated = formatDate(date);

    console.log('----------------------DATAENVIADA---------------------------');
    console.log(dateFormated);
    console.log('------------------------------------------------------------');

    const schedulings = await this.schedulingRepository
      .createQueryBuilder('schedulings')
      .where('schedulings.date = :date', { date: dateFormated })
      .getMany();

    console.log('---------------AgendamentosMarcados-------------------------');
    console.log(schedulings);
    console.log('------------------------------------------------------------');

    // RETORNO DOS HORARIOS DISPONIVEIS DE HORA EM HORA DENTRO DO INTERVALO
    const availableSchedules: string[] = [];
    for (let hour = 7; hour <= 21; hour++) {
      const formatedHour = hour.toString().padStart(2, '0');
      const schedule = `${formatedHour}:00`;

      // Verifica se o horário já está agendado
      const scheduledHour = await this.schedulingRepository.findOne({
        where: {
          date: dateFormated,
          hour: schedule,
        },
      });

      // Se o horário não estiver agendado, adicione-o à lista de horários disponíveis
      if (!scheduledHour) {
        availableSchedules.push(schedule);
      }
    }
    return availableSchedules;
  }
}
