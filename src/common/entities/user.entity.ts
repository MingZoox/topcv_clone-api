import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Expose } from "class-transformer";
import { UserRole } from "../constants/role.enum";
import { Company } from "./company.entity";
import { Notification } from "./notification.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Expose({ groups: [UserRole.ADMIN] })
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

  @OneToOne(() => Company, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  company: Company;

  @OneToMany(
    () => Notification,
    (notification: Notification) => notification.user,
  )
  notifications: Notification[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
