import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from '../app.service';

describe('AppService', () => {
  let appService: AppService;
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'database/database-test.sqlite',
        //   entities: [YourEntity],
          synchronize: true,
        }),
        // TypeOrmModule.forFeature([YourEntity]),
      ],
      providers: [AppService],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
  });

  afterAll(async () => {
    // Limpeza após os testes, se necessário
  });

  // Aqui você pode adicionar seus testes CRUD
  it('should be defined', () => {
    expect(appService).toBeDefined();
  });
});
