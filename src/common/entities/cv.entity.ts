import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Job } from "./job.entity";

@Entity()
export class CV {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  companyId: number;

  @ManyToOne(() => Job, (job: Job) => job.cvs, {
    onDelete: "CASCADE",
  })
  job: Job;
}
