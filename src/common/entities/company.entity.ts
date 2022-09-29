import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Job } from "./job.entity";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  website: string;

  @Column()
  employeeNumber: number;

  @Column()
  introduction: string;

  @Column()
  address: string;

  @OneToMany(() => Job, (job: Job) => job.company)
  jobs: Job[];
}
