import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "src/common/constants/role.enum";
import { UpdateCompanyDto } from "src/common/dtos/company-dto/update-company.dto";
import { CreateJobDto } from "src/common/dtos/job-dto/create-job.dto";
import { Company } from "src/common/entities/company.entity";
import { User } from "src/common/entities/user.entity";
import { JobService } from "src/job/job.service";
import { NotificationService } from "src/notification/notification.service";
import { UserService } from "src/user/user.service";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class CompanyService {
  userRepository: any;
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private userService: UserService,
    private jobService: JobService,
    private notificationService: NotificationService,
  ) {}

  async create({
    name,
    email,
    password,
    website,
    employeeNumber,
    introduction,
    address,
    location,
  }): Promise<number> {
    const createCompany: Company = this.companyRepository.create({
      name,
      website,
      employeeNumber,
      introduction,
      address,
      location,
      users: [],
    });

    const createdCompany: Company = await this.companyRepository.save(
      createCompany,
    );

    const createUser = { email, password, username: name };

    return this.userService.signup(createUser, createdCompany);
  }

  async findOne(companyId: number, currentUser: User | null): Promise<Company> {
    const company: any = await this.companyRepository.findOne({
      relations: {
        users: true,
      },
      where: {
        id: companyId,
      },
    });
    if (!company) throw new BadRequestException("company not found !");

    if (currentUser) {
      company.isCurrentUserFollowed = false;
      if (
        company.users.filter((user: User) => currentUser.id === user.id)
          .length > 0
      ) {
        company.isCurrentUserFollowed = true;
      }
    }
    delete company.users;
    company.avatar = await this.userService.findAvatarCompany(company.id);

    return company;
  }

  async update(
    id: number,
    updateCompany: Partial<UpdateCompanyDto>,
    currentUser: User,
  ): Promise<number> {
    const company: Company = await this.companyRepository.findOneBy({ id });
    if (!company) throw new BadRequestException("company not found !");

    if (currentUser.role !== UserRole.ADMIN && id !== currentUser.company.id) {
      throw new UnauthorizedException("unauthorized !");
    }

    Object.assign(company, updateCompany);

    return (await this.companyRepository.save(company)).id;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.companyRepository.delete(id);
  }

  async followCompany(companyId: number, currentUser: User) {
    const company: Company = await this.companyRepository.findOne({
      relations: {
        users: true,
      },
      where: {
        id: companyId,
      },
    });
    if (!company) throw new BadRequestException("company not found !");

    company.users.push(currentUser);

    return (await this.companyRepository.save(company)).id;
  }

  async unFollowCompany(companyId: number, currentUser: User) {
    const company: Company = await this.companyRepository.findOne({
      relations: {
        users: true,
      },
      where: {
        id: companyId,
      },
    });
    if (!company) throw new BadRequestException("company not found !");

    company.users = company.users.filter(
      (user: User) => user.id !== currentUser.id,
    );

    return (await this.companyRepository.save(company)).id;
  }

  async createJob(createJob: CreateJobDto, currentUser: User): Promise<number> {
    const newJobId: number = await this.jobService.create(
      createJob,
      currentUser,
    );

    const company: Company = await this.companyRepository.findOne({
      relations: {
        users: true,
      },
      where: {
        id: currentUser.company.id,
      },
    });

    console.log(company);
    const notificationBody = {
      title: "New Job!",
      description: `You have a new job from your followed company ${company.name}`,
      url: `http://localhost:3000/jobs/${newJobId}`,
    };
    for (const user of company.users) {
      await this.notificationService.create(notificationBody, user);
    }

    return newJobId;
  }
}
