import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "src/common/constants/role.enum";
import { CreateJobDto } from "src/common/dtos/job-dto/create-job.dto";
import { UpdateJobDto } from "src/common/dtos/job-dto/update-job.dto";
import { Job } from "src/common/entities/job.entity";
import { User } from "src/common/entities/user.entity";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(createJob: CreateJobDto, currentUser: User): Promise<number> {
    const createdJob: Job = this.jobRepository.create(createJob);

    createdJob.company = currentUser.company;
    return (await this.jobRepository.save(createdJob)).id;
  }

  async findOne(id: number): Promise<Job> {
    const job: Job = await this.jobRepository.findOneBy({ id });
    if (!job) throw new BadRequestException("job not found !");

    return job;
  }

  async update(
    id: number,
    updateJob: Partial<UpdateJobDto>,
    currentUser: User,
  ): Promise<number> {
    const job: Job = await this.jobRepository.findOneBy({ id });
    if (!job) throw new BadRequestException("job not found !");

    if (
      currentUser.role !== UserRole.ADMIN &&
      job.company.id !== currentUser.company.id
    ) {
      throw new UnauthorizedException("unauthorized !");
    }

    Object.assign(job, updateJob);

    return (await this.jobRepository.save(job)).id;
  }

  async remove(id: number, currentUser: User): Promise<DeleteResult> {
    const job: Job = await this.jobRepository.findOneBy({ id });
    if (!job) throw new BadRequestException("job not found !");

    if (
      currentUser.role !== UserRole.ADMIN &&
      job.company.id !== currentUser.company.id
    ) {
      throw new UnauthorizedException("unauthorized !");
    }

    return await this.jobRepository.delete(id);
  }
}
