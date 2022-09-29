import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import {
  JobGender,
  JobLevel,
  JobSalary,
  JobWorkFormat,
} from "../constants/job.enum";
import { Company } from "./company.entity";

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  expired: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: "enum",
    enum: JobSalary,
  })
  salary: string;

  @Column()
  recruitQuantity: number;

  @Column({
    type: "enum",
    enum: JobWorkFormat,
  })
  workFormat: string;

  @Column({
    type: "enum",
    enum: JobLevel,
  })
  level: string;

  @Column({
    type: "enum",
    enum: JobGender,
  })
  gender: string;

  @Column()
  experience: string;

  @ManyToOne(() => Company, (company: Company) => company.jobs, {
    onDelete: "CASCADE",
  })
  company: Company;
}
