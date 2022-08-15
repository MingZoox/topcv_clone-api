import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import * as bcrypt from "bcrypt";
import { Expose } from "class-transformer";
import { UserRole } from "../constants/role.enum";

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

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
