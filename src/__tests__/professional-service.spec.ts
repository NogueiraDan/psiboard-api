import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common/exceptions';
import { ProfessionalService } from '../professional/professional.service';
import { ProfessionalRepository } from '../professional/repository/professional.repository';

// Mock repository
const mockProfessionalRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProfessionalService Unit Test', () => {
  let professionalService: ProfessionalService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessionalService,
        {
          provide: ProfessionalRepository,
          useValue: mockProfessionalRepository,
        },
      ],
    }).compile();

    professionalService =
      moduleRef.get<ProfessionalService>(ProfessionalService);
  });

  it('should be defined', () => {
    expect(professionalService).toBeDefined();
  });

  it('should create a new Professional Record', async () => {
    const newRecord = {
      name: 'Daniel',
      email: 'daniel@teste.com',
      password: 'password',
    };

    const createdRecordMock = { ...newRecord, id: 1 };

    mockProfessionalRepository.findOneBy.mockResolvedValueOnce(null);
    mockProfessionalRepository.create.mockReturnValueOnce(createdRecordMock);
    mockProfessionalRepository.save.mockResolvedValueOnce(createdRecordMock);

    const createdRecord = await professionalService.create(newRecord);
    expect(createdRecord).toBeDefined();
    expect(createdRecord.id).toBeDefined();
  });

  it('should fail by creating a new record with existing email', async () => {
    const newRecord = {
      name: 'Daniel',
      email: 'daniel@teste.com',
      password: 'password',
    };

    mockProfessionalRepository.findOneBy.mockResolvedValueOnce(newRecord);

    await expect(professionalService.create(newRecord)).rejects.toThrow(
      HttpException,
    );
  });

  it('should return all professionals', async () => {
    const professionalsMock = [
      { id: 1, name: 'Daniel', email: 'daniel@teste.com' },
      { id: 2, name: 'John', email: 'john@teste.com' },
    ];

    mockProfessionalRepository.find.mockResolvedValueOnce(professionalsMock);

    const professionals = await professionalService.findAll();
    expect(professionals).toEqual(professionalsMock);
  });

  it('should return a professional by ID', async () => {
    const professionalMock = {
      id: 1,
      name: 'Daniel',
      email: 'daniel@teste.com',
    };

    mockProfessionalRepository.findOne.mockResolvedValueOnce(professionalMock);

    const professional = await professionalService.findOne('1');
    expect(professional).toEqual(professionalMock);
  });

  it('should return a professional by email', async () => {
    const professionalMock = {
      id: 1,
      name: 'Daniel',
      email: 'daniel@teste.com',
    };

    mockProfessionalRepository.findOneBy.mockResolvedValueOnce(
      professionalMock,
    );

    const professional =
      await professionalService.findOneByEmail('daniel@teste.com');
    expect(professional).toEqual(professionalMock);
  });

  it('should return patients of a professional', async () => {
    const professionalMock = {
      id: 1,
      name: 'Daniel',
      email: 'daniel@teste.com',
      patients: ['Patient1', 'Patient2'],
    };

    mockProfessionalRepository.findOne.mockResolvedValueOnce(professionalMock);

    const patients =
      await professionalService.findPatientsFromProfessional('1');
    expect(patients).toEqual(professionalMock.patients);
  });

  it('should update a professional', async () => {
    const updateProfessionalDto = {
      name: 'Daniel Updated',
      email: 'daniel_updated@teste.com',
    };
    const updatedProfessionalMock = { id: 1, ...updateProfessionalDto };

    mockProfessionalRepository.update.mockResolvedValueOnce(null);
    mockProfessionalRepository.findOne.mockResolvedValueOnce(
      updatedProfessionalMock,
    );

    const updatedProfessional = await professionalService.update(
      '1',
      updateProfessionalDto,
    );
    expect(updatedProfessional).toEqual(updatedProfessionalMock);
  });

  it('should remove a professional', async () => {
    mockProfessionalRepository.delete.mockResolvedValueOnce(null);

    await professionalService.remove('1');
    expect(mockProfessionalRepository.delete).toHaveBeenCalledWith('1');
  });
});
