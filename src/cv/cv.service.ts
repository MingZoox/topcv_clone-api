import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "src/common/constants/role.enum";
import { CV } from "src/common/entities/cv.entity";
import { Job } from "src/common/entities/job.entity";
import { User } from "src/common/entities/user.entity";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class CVService {
  constructor(
    @InjectRepository(CV)
    private cvRepository: Repository<CV>,
  ) {}

  async create(url: string, companyId: number, job: Job): Promise<number> {
    const createdCV: CV = this.cvRepository.create({ url, companyId });
    createdCV.job = job;

    return (await this.cvRepository.save(createdCV)).id;
  }

  async remove(id: number, currentUser: User): Promise<DeleteResult> {
    const cv: CV = await this.cvRepository.findOneBy({ id });
    if (!cv) throw new BadGatewayException("cv not found!");

    if (
      currentUser.role !== UserRole.ADMIN &&
      cv.companyId !== currentUser.company.id
    ) {
      throw new UnauthorizedException("unauthorized !");
    }

    return await this.cvRepository.delete(id);
  }
}
