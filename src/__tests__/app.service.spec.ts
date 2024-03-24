import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from '../app.service';
import { Professional } from '../professional/entities/professional.entity';
import { Patient } from '../patient/entities/patient.entity';
import { Scheduling } from '../scheduling/entities/scheduling.entity';

describe('AppService', () => {
  let appService: AppService;
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'database/database-test.sqlite',
          entities: [Professional, Patient, Scheduling],
          synchronize: true,
        }),
      ],
      providers: [AppService],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });
});
