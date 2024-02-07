import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { SchedulingRepository } from './repository/scheduling.repository';

@Module({
  controllers: [SchedulingController],
  providers: [SchedulingService, SchedulingRepository],
})
export class SchedulingModule {}
