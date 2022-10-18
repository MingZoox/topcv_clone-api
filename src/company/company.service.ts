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
      usersFollowed: [],
    });

    const createdCompany: Company = await this.companyRepository.save(
      createCompany,
    );

    const createUser = { email, password, username: name };

    return this.userService.signup(createUser, createdCompany);
  }

  async find(page: number, limit: number): Promise<Company[]> {
    if (!page) page = 1;
    if (!limit) limit = 10;

    const companies: Company[] = await this.companyRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    return companies;
  }

  async findOne(companyId: number, currentUser: User | null): Promise<Company> {
    const company: any = await this.companyRepository.findOne({
      relations: {
        usersFollowed: true,
        user: true,
        jobs: true,
      },
      where: {
        id: companyId,
      },
    });

    if (!company) throw new BadRequestException("company not found !");
    company.user = { avatar: company.user.avatar };

    if (currentUser) {
      company.isCurrentUserFollowed = false;
      if (
        company.usersFollowed.filter((user: User) => currentUser.id === user.id)
          .length > 0
      ) {
        company.isCurrentUserFollowed = true;
      }
    }

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
        usersFollowed: true,
      },
      where: {
        id: companyId,
      },
    });
    if (!company) throw new BadRequestException("company not found !");

    company.usersFollowed.push(currentUser);

    return (await this.companyRepository.save(company)).id;
  }

  async unFollowCompany(companyId: number, currentUser: User) {
    const company: Company = await this.companyRepository.findOne({
      relations: {
        usersFollowed: true,
      },
      where: {
        id: companyId,
      },
    });
    if (!company) throw new BadRequestException("company not found !");

    company.usersFollowed = company.usersFollowed.filter(
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
        usersFollowed: true,
      },
      where: {
        id: currentUser.company.id,
      },
    });

    const notificationBody = {
      title: "New Job!",
      description: `You have a new job from your followed company ${company.name}`,
      url: `http://localhost:3000/jobs/${newJobId}`,
    };
    for (const user of company.usersFollowed) {
      await this.notificationService.create(notificationBody, user);
    }

    return newJobId;
  }
}
