import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { SchedulingRepository } from './repository/scheduling.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SchedulingController],
  providers: [SchedulingService, SchedulingRepository],
  imports: [AuthModule],
})
export class SchedulingModule {}
