import { PartialType } from '@nestjs/mapped-types';
import { SchedulingDto } from './create-scheduling.dto';

export class UpdateSchedulingDto extends PartialType(SchedulingDto) {}
