import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  Index,
} from "typeorm";
import {
  JobGender,
  JobLevel,
  JobSalary,
  JobWorkFormat,
} from "../constants/job.enum";
import { Company } from "./company.entity";
import { CV } from "./cv.entity";

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ fulltext: true })
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
  salary: JobSalary;

  @Column()
  recruitQuantity: number;

  @Column({
    type: "enum",
    enum: JobWorkFormat,
  })
  workFormat: JobWorkFormat;

  @Column({
    type: "enum",
    enum: JobLevel,
  })
  level: JobLevel;

  @Column({
    type: "enum",
    enum: JobGender,
  })
  gender: JobGender;

  @Column()
  experience: string;

  @ManyToOne(() => Company, (company: Company) => company.jobs, {
    eager: true,
  })
  company: Company;

  @OneToMany(() => CV, (cv: CV) => cv.job)
  cvs: CV[];
}
