import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "src/common/constants/role.enum";
import { UpdateCompanyDto } from "src/common/dtos/company-dto/update-company.dto";
import { Company } from "src/common/entities/company.entity";
import { User } from "src/common/entities/user.entity";
import { UserService } from "src/user/user.service";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class CompanyService {
  userRepository: any;
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private userService: UserService,
  ) {}

  async create({
    name,
    email,
    password,
    website,
    employeeNumber,
    introduction,
    address,
  }): Promise<number> {
    const createCompany: Company = this.companyRepository.create({
      name,
      website,
      employeeNumber,
      introduction,
      address,
    });
    const createdCompany: Company = await this.companyRepository.save(
      createCompany,
    );
    const createUser = { email, password, username: name };

    return this.userService.signup(createUser, createdCompany);
  }

  async findOne(id: number): Promise<Company> {
    const company: Company = await this.companyRepository.findOneBy({ id });
    if (!company) throw new BadRequestException("company not found !");

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
}
