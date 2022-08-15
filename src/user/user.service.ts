import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserRole } from "../common/constants/role.enum";
import { User } from "../common/entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signup({ email, password, username }): Promise<number> {
    const user = this.usersRepository.findOneBy({ email });
    if (user) throw new BadRequestException("email already exist !");

    const createUser = this.usersRepository.create({
      email,
      password,
      username,
    });

    return (await this.usersRepository.save(createUser)).id;
  }

  async login({ email, password }): Promise<number> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new BadRequestException("email not found !");

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) throw new BadRequestException("password invalid !");
    return user.id;
  }

  findOne(id: number): Promise<User> {
    const user = this.usersRepository.findOneBy({ id });
    if (!user) throw new BadRequestException("user not found !");

    return user;
  }

  find(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async update(
    id: number,
    updateUser: Partial<User>,
    currentUser: User,
  ): Promise<number> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new BadRequestException("user not found !");

    if (currentUser.role !== UserRole.ADMIN && user.id !== currentUser.id) {
      throw new UnauthorizedException("unauthorized !");
    }

    if (updateUser.password) {
      const salt = await bcrypt.genSalt();
      updateUser.password = await bcrypt.hash(updateUser.password, salt);
    }
    Object.assign(user, updateUser);
    return (await this.usersRepository.save(user)).id;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }
}
