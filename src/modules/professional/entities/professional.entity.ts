import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {Patient} from "../../patient/entities/patient.entity";
import { Scheduling } from '../../scheduling/entities/scheduling.entity';

@Entity()
export class Professional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Patient, (patient) => patient.professional)
  patients: Patient[];

  @OneToMany(()=> Scheduling, (scheduling) => scheduling.professional)
  scheduling: Scheduling[];
}
