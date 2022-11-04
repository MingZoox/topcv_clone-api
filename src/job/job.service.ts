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
import { CVService } from "src/cv/cv.service";
import { S3UploadService } from "src/shared/s3upload.service";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private s3UploadService: S3UploadService,
    private cvService: CVService,
  ) {}

  async create(createJob: CreateJobDto, currentUser: User): Promise<number> {
    const createdJob: Job = this.jobRepository.create(createJob);

    createdJob.company = currentUser.company;
    return (await this.jobRepository.save(createdJob)).id;
  }

  async findOne(id: number): Promise<Job> {
    const job: any = await this.jobRepository.findOne({
      relations: {
        company: {
          user: true,
        },
      },
      where: {
        id: id,
      },
    });

    if (!job) throw new BadRequestException("job not found !");
    job.company.user = {
      id: job.company.user.id,
      avatar: job.company.user.avatar,
    };

    return job;
  }

  async findByCompany(page: number, limit: number, currentUser: User) {
    return await this.jobRepository
      .createQueryBuilder("job")
      .where("companyId = :companyId", { companyId: currentUser.company.id })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findByFilter({
    search,
    page,
    limit,
    workFormat,
    level,
    salary,
    location,
  }): Promise<Job[]> {
    let jobs: Job[] = await this.jobRepository.find({
      relations: {
        company: {
          user: true,
        },
      },
      select: {
        company: {
          user: {
            avatar: true,
          },
        },
      },
      where: {
        workFormat: workFormat,
        level: level,
        salary: salary,
      },
      order: {
        createdAt: "DESC",
      },
    });

    if (location) {
      jobs = jobs.filter((job: Job) => job.company.location === location);
    }

    //search and pagination
    if (search) {
      jobs = jobs.filter((job: Job) => {
        const jobName = job.name.toLowerCase();
        return jobName.includes(search.toLowerCase());
      });
    }
    jobs = jobs.slice((page - 1) * limit, (page - 1) * limit + limit);

    return jobs;
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

  async uploadCV(
    id: number,
    currentUser: User,
    file: Express.Multer.File,
  ): Promise<number> {
    const job: Job = await this.jobRepository.findOneBy({ id });
    if (!job) throw new BadRequestException("job not found!");

    const uploadURL = `company/job${id}/`;
    const awsURL =
      process.env.AWS_UPLOAD_URL + currentUser.id + "/" + uploadURL;
    const cvId: number = await this.cvService.create(
      awsURL,
      job.company.id,
      job,
    );

    await this.s3UploadService.upload(file, uploadURL + cvId, currentUser);

    return cvId;
  }
}
