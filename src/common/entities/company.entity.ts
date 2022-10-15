import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
  OneToOne,
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

  @OneToMany(() => Job, (job: Job) => job.company, { onDelete: "CASCADE" })
  jobs: Job[];

  @ManyToMany(() => User)
  @JoinTable()
  usersFollowed: User[];

  @OneToOne(() => User, (user) => user.company)
  user: User;
}
