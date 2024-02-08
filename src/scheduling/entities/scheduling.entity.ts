import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {Professional} from '../../professional/entities/professional.entity';
import {Patient} from '../../patient/entities/patient.entity';

@Entity()
export class Scheduling {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: string;

  @Column()
  hour: string;

  @Column({ default: 'marcacao' })
  type: string;

  @ManyToOne(() => Patient, (patient) => patient.scheduling)
  patient: Patient;

  @ManyToOne(() => Professional, (professional) => professional.scheduling)
  professional: Professional;
}
