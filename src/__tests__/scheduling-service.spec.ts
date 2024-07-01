import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SchedulingService } from '../scheduling/scheduling.service';
import { SchedulingRepository } from '../scheduling/repository/scheduling.repository';
import { SchedulingDto } from '../scheduling/dto/create-scheduling.dto';
import { UpdateSchedulingDto } from '../scheduling/dto/update-scheduling.dto';
import { CustomException } from '../exceptions/custom.exception';
import { ProfessionalDto } from 'src/professional/dto/create-professional.dto';
import { PatientDto } from 'src/patient/dto/create-patient.dto';

const mockSchedulingRepository = {
  createQueryBuilder: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('Scheduling Service Unit Tests Suite', () => {
  let schedulingService: SchedulingService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulingService,
        {
          provide: SchedulingRepository,
          useValue: mockSchedulingRepository,
        },
      ],
    }).compile();

    schedulingService = moduleRef.get<SchedulingService>(SchedulingService);
  });

  it('should be defined', () => {
    expect(schedulingService).toBeDefined();
  });

  it('should create a new Scheduling Record', async () => {
    const mockProfessional: ProfessionalDto = {
      name: 'Daniel',
      email: 'daniel@teste.com',
      password: '123456',
    };
    const mockPatient: PatientDto = {
      name: 'João',
      adress: 'Rua',
      age: 20,
      email: 'joao@teste.com',
      phone: '+550987654331',
      professional: mockProfessional,
      info_add: 'teste',
      zip_code: '01001-900',
    };
    const newRecord: SchedulingDto = {
      date: '2024-06-20',
      hour: '10:00',
      type: 'marcacao',
      patient: mockPatient,
      professional: mockProfessional,
    };

    const createdRecordMock = { ...newRecord, id: 1 };

    mockSchedulingRepository.findOne.mockResolvedValueOnce(null);
    mockSchedulingRepository.create.mockReturnValueOnce(createdRecordMock);
    mockSchedulingRepository.save.mockResolvedValueOnce(createdRecordMock);

    const createdRecord = await schedulingService.create(newRecord);
    expect(createdRecord).toBeDefined();
    expect(createdRecord.id).toBeDefined();
  });

  it('should fail to create a scheduling with invalid hour format', async () => {
    const mockProfessional: ProfessionalDto = {
      name: 'Daniel',
      email: 'daniel@teste.com',
      password: '123456',
    };
    const mockPatient: PatientDto = {
      name: 'João',
      adress: 'Rua',
      age: 20,
      email: 'joao@teste.com',
      phone: '+550987654331',
      professional: mockProfessional,
      info_add: 'teste',
      zip_code: '01001-900',
    };
    const newRecord: SchedulingDto = {
      date: '2024-06-20',
      hour: '100:000',
      type: 'marcacao',
      patient: mockPatient,
      professional: mockProfessional,
    };

    await expect(schedulingService.create(newRecord)).rejects.toThrow(
      HttpException,
    );
  });

  it('should fail to create a scheduling when patient already has a scheduling on the same date', async () => {
    const mockProfessional: ProfessionalDto = {
      name: 'Daniel',
      email: 'daniel@teste.com',
      password: '123456',
    };
    const mockPatient: PatientDto = {
      name: 'João',
      adress: 'Rua',
      age: 20,
      email: 'joao@teste.com',
      phone: '+550987654331',
      professional: mockProfessional,
      info_add: 'teste',
      zip_code: '01001-900',
    };
    const newRecord: SchedulingDto = {
      date: '2024-06-20',
      hour: '10:00',
      type: 'marcacao',
      patient: mockPatient,
      professional: mockProfessional,
    };

    mockSchedulingRepository
      .createQueryBuilder()
      .getOne.mockResolvedValueOnce(newRecord);

    await expect(schedulingService.create(newRecord)).rejects.toThrow(
      new CustomException(
        {
          message:
            'Esse paciente já possui um agendamento marcado para essa data',
          patientSchedulingExists: newRecord,
        },
        HttpStatus.BAD_REQUEST,
      ),
    );
  });

  it('should fail to create a scheduling when date and hour are unavailable', async () => {
    const mockProfessional: ProfessionalDto = {
      name: 'Daniel',
      email: 'daniel@teste.com',
      password: '123456',
    };
    const mockPatient: PatientDto = {
      name: 'João',
      adress: 'Rua',
      age: 20,
      email: 'joao@teste.com',
      phone: '+550987654331',
      professional: mockProfessional,
      info_add: 'teste',
      zip_code: '01001-900',
    };
    const newRecord: SchedulingDto = {
      date: '2024-06-20',
      hour: '10:00',
      type: 'marcacao',
      patient: mockPatient,
      professional: mockProfessional,
    };

    mockSchedulingRepository.findOne.mockResolvedValueOnce(newRecord);

    await expect(schedulingService.create(newRecord)).rejects.toThrow(
      CustomException,
    );
  });

  it('should return all schedulings', async () => {
    const schedulingsMock = [
      { id: 1, date: '2024-06-20', hour: '10:00', patient: 'patientId', professional: 'professionalId' },
      { id: 2, date: '2024-06-21', hour: '11:00', patient: 'patientId2', professional: 'professionalId2' },
    ];

    mockSchedulingRepository.find.mockResolvedValueOnce(schedulingsMock);

    const schedulings = await schedulingService.findAll();
    expect(schedulings).toEqual(schedulingsMock);
  });

  it('should return a scheduling by ID', async () => {
    const schedulingMock = { id: 1, date: '2024-06-20', hour: '10:00', patient: 'patientId', professional: 'professionalId' };

    mockSchedulingRepository.findOne.mockResolvedValueOnce(schedulingMock);

    const scheduling = await schedulingService.findOne('1');
    expect(scheduling).toEqual(schedulingMock);
  });

  it('should update a scheduling', async () => {
    const mockProfessional: ProfessionalDto = {
      name: 'Daniel',
      email: 'daniel@teste.com',
      password: '123456',
    };
    const mockPatient: PatientDto = {
      name: 'João',
      adress: 'Rua',
      age: 20,
      email: 'joao@teste.com',
      phone: '+550987654331',
      professional: mockProfessional,
      info_add: 'teste',
      zip_code: '01001-900',
    };
    const updateSchedulingDto: UpdateSchedulingDto = {
      date: '2024-06-21',
      hour: '11:00',
      patient: mockPatient,
      professional: mockProfessional,
      type: 'remarcacao',
    };
    const updatedSchedulingMock = { id: 1, ...updateSchedulingDto };

    mockSchedulingRepository.findOne.mockResolvedValueOnce(null);
    mockSchedulingRepository.update.mockResolvedValueOnce(null);
    mockSchedulingRepository.findOne.mockResolvedValueOnce(updatedSchedulingMock);

    const updatedScheduling = await schedulingService.update('1', updateSchedulingDto);
    expect(updatedScheduling).toEqual(updatedSchedulingMock);
  });

  it('should remove a scheduling', async () => {
    mockSchedulingRepository.delete.mockResolvedValueOnce(null);

    await schedulingService.remove('1');
    expect(mockSchedulingRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should get professional schedulings for today', async () => {
    const schedulingsMock = [
      { id: 1, date: '2024-06-20', hour: '10:00', patient: 'patientId', professional: 'professionalId' },
    ];

    mockSchedulingRepository.createQueryBuilder().getMany.mockResolvedValueOnce(schedulingsMock);

    const schedulings = await schedulingService.getProfessionalSchedulingToday('professionalId', '2024-06-20');
    expect(schedulings).toEqual(schedulingsMock);
  });

  it('should get professional schedulings', async () => {
    const schedulingsMock = [
      { id: 1, date: '2024-06-20', hour: '10:00', patient: 'patientId', professional: 'professionalId' },
    ];

    mockSchedulingRepository.createQueryBuilder().getMany.mockResolvedValueOnce(schedulingsMock);

    const schedulings = await schedulingService.getProfessionalScheduling('professionalId');
    expect(schedulings).toEqual(schedulingsMock);
  });

  // it('should get available schedules for a date', async () => {
  //   const schedulingsMock = [
  //     { date: '20/06/2024', hour: '10:00' },
  //   ];

  //   mockSchedulingRepository.createQueryBuilder().getMany.mockResolvedValueOnce(schedulingsMock);
  //   mockSchedulingRepository.findOne.mockResolvedValueOnce(schedulingsMock[0]).mockResolvedValueOnce(null);

  //   const availableSchedules = await schedulingService.getAvailableSchedules('20062024');
  //   expect(availableSchedules).not.toContain('10:00');
  // });
});
