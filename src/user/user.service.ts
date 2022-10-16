import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { Company } from "src/common/entities/company.entity";
import { S3UploadService } from "src/shared/s3upload.service";
import { UserRole } from "../common/constants/role.enum";
import { User } from "../common/entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private s3UploadService: S3UploadService,
  ) {}

  async signup(
    { email, password, username },
    createdCompany?: Company,
  ): Promise<number> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new BadRequestException("email already exist !");

    const createUser: User = this.userRepository.create({
      email,
      username,
      company: createdCompany,
    });
    createUser.setPassword(password);

    if (createdCompany) createUser.role = UserRole.COMPANY;

    return (await this.userRepository.save(createUser)).id;
  }

  async login({ email, password }): Promise<number> {
    const user: User = await this.userRepository.findOneBy({ email });
    if (!user) throw new BadRequestException("email not found !");

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) throw new BadRequestException("password invalid !");
    return user.id;
  }

  async loginOAuth({ email, username, avatar }): Promise<number> {
    const user: User = await this.userRepository.findOneBy({ email });
    if (!user) {
      const createUser: User = this.userRepository.create({
        email,
        avatar,
        username,
      });

      return (await this.userRepository.save(createUser)).id;
    }

    return user.id;
  }

  async find(page: number, limit: number): Promise<User[]> {
    if (!page) page = 1;
    if (!limit) limit = 10;

    const users: User[] = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    return users;
  }

  async findOne(id: number): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException("user not found !");

    return user;
  }

  async findAvatarCompany(companyId: number): Promise<string> {
    const user: User = await this.userRepository.findOne({
      relations: {
        company: true,
      },
      where: {
        company: {
          id: companyId,
        },
      },
    });
    if (!user) throw new BadRequestException("user not found !");
    return user.avatar;
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

    if (updateUser.password) user.setPassword(updateUser.password);

    Object.assign(user, updateUser);
    return (await this.userRepository.save(user)).id;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async uploadAvatar(
    currentUser: User,
    file: Express.Multer.File,
  ): Promise<number> {
    const user: User = await this.userRepository.findOneBy({
      id: currentUser.id,
    });
    const upload = {
      avatar: process.env.AWS_UPLOAD_URL + currentUser.id + "/avatar",
    };
    Object.assign(user, upload);
    await this.s3UploadService.upload(file, "avatar", currentUser);
    return (await this.userRepository.save(user)).id;
  }

  async verifyMailForgetPassword(email: string): Promise<number> {
    const user: User = await this.userRepository.findOneBy({ email });
    if (!user) throw new BadRequestException("user not found !");

    const newPassword = "00000000";
    user.setPassword(newPassword);
    return (await this.userRepository.save(user)).id;
  }
}
