import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { JobLocation } from "../constants/job.enum";
import { Job } from "./job.entity";
import { User } from "./user.entity";

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

  @Column({
    type: "enum",
    enum: JobLocation,
  })
  location: JobLocation;

  @OneToMany(() => Job, (job: Job) => job.company)
  jobs: Job[];

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
