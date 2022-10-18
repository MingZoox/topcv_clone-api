import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { UserRole } from "../constants/role.enum";
import { Company } from "./company.entity";
import { Notification } from "./notification.entity";
import { Message } from "./message.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    default:
      "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-cat-photos-1593441022.jpg",
  })
  avatar: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: string;

  @OneToOne(() => Company, (company: Company) => company.user, {
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  company: Company;

  @OneToMany(
    () => Notification,
    (notification: Notification) => notification.user,
    {
      onDelete: "CASCADE",
    },
  )
  notifications: Notification[];

  @OneToMany(() => Message, (message: Message) => message.from, {
    onDelete: "CASCADE",
  })
  sentMessage: Message[];

  @OneToMany(() => Message, (message: Message) => message.from, {
    onDelete: "CASCADE",
  })
  receivedMessage: Message[];

  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
