import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { Company } from "src/common/entities/company.entity";
import { UploadFileType } from "src/common/constants/upload-type";
import { UserRole } from "../common/constants/role.enum";
import { User } from "../common/entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup(
    { email, password, username },
    createdCompany?: Company,
  ): Promise<number> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new BadRequestException("email already exist !");

    const createUser: User = this.userRepository.create({
      email,
      password,
      username,
      company: createdCompany,
    });

    if (createdCompany) createUser.role = UserRole.COMPANY;

    return (await this.userRepository.save(createUser)).id;
  }

  async login({ email, password }): Promise<number> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new BadRequestException("email not found !");

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) throw new BadRequestException("password invalid !");
    return user.id;
  }

  async findOne(id: number): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException("user not found !");

    return user;
  }

  find(): Promise<User[]> {
    return this.userRepository.find();
  }

  async update(
    id: number,
    updateUser: Partial<User>,
    currentUser: User,
  ): Promise<number> {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException("user not found !");

    if (currentUser.role !== UserRole.ADMIN && id !== currentUser.id) {
      throw new UnauthorizedException("unauthorized !");
    }

    if (updateUser.password) {
      const salt = await bcrypt.genSalt();
      updateUser.password = await bcrypt.hash(updateUser.password, salt);
    }
    Object.assign(user, updateUser);
    return (await this.userRepository.save(user)).id;
  }

  async upload(id: number, fileType: UploadFileType) {
    const user: User = await this.userRepository.findOneBy({ id });
    const upload = {
      [fileType]: `https://topcv-clone.s3.ap-southeast-1.amazonaws.com/${id}/${fileType}`,
    };
    Object.assign(user, upload);
    return (await this.userRepository.save(user)).id;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
