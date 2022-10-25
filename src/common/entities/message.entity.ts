import { Exclude } from "class-transformer";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user: User) => user.sentMessage)
  from: User;

  @Exclude()
  @ManyToOne(() => User, (user: User) => user.receivedMessage)
  to: User;
}
