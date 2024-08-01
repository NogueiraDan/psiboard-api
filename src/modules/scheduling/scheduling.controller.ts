import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { CustomJwtAuthGuard } from 'src/auth/CustomJwtAuthGuard';

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post()
  create(@Body() schedulingDto: SchedulingDto) {
    return this.schedulingService.create(schedulingDto);
  }

  @Get()
  findAll() {
    return this.schedulingService.findAll();
  }

  @Get('available-schedules')
  getAvailableSchedules(@Query('date') date: any) {
    return this.schedulingService.getAvailableSchedules(date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulingService.findOne(id);
  }

  @Get('today/:id')
  @UseGuards(CustomJwtAuthGuard)
  getProfessionalSchedulingToday(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    return this.schedulingService.getProfessionalSchedulingToday(id, date);
  }

  @Get('professional/:id')
  getProfessionalScheduling(@Param('id') id: string) {
    return this.schedulingService.getProfessionalScheduling(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSchedulingDto: UpdateSchedulingDto,
  ) {
    return this.schedulingService.update(id, updateSchedulingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulingService.remove(id);
  }
}
