import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalService } from '../professional/professional.service';
import { Professional } from '../professional/entities/professional.entity';
import { Patient } from '../patient/entities/patient.entity';
import { Scheduling } from '../scheduling/entities/scheduling.entity';
import { ProfessionalRepository } from '../professional/repository/professional.repository';

describe('ProfessionalService Unit Test', () => {
  let professionalService: ProfessionalService;
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'database/database-test.sqlite',
          entities: [Professional, Patient, Scheduling],
          synchronize: false,
        }),
        TypeOrmModule.forFeature([Professional, ProfessionalRepository]),
      ],
      providers: [ProfessionalService, ProfessionalRepository],
    }).compile();

    professionalService =
      moduleRef.get<ProfessionalService>(ProfessionalService);
  });

  afterAll(async () => {
    // Limpeza após os testes, se necessário
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

    const existingRecord = await professionalService.findOneByEmail(
      newRecord.email,
    );
    if (existingRecord) {
      expect(existingRecord).toBeDefined();
    } else {
      const createdRecord = await professionalService.create(newRecord);
      expect(createdRecord).toBeDefined();
      expect(createdRecord.id).toBeDefined();
    }
  });
});
