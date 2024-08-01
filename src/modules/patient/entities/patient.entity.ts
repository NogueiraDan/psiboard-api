import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Professional } from '../../professional/entities/professional.entity';
import { Scheduling } from '../../scheduling/entities/scheduling.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  adress: string;

  @Column()
  zip_code: string;

  @Column()
  info_add: string;

  @ManyToOne(() => Professional, (professional) => professional.patients)
  professional: Professional;

  @OneToMany(() => Scheduling, (scheduling) => scheduling.patient)
  scheduling: Scheduling[];
}
