import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "src/common/constants/role.enum";
import { Notification } from "src/common/entities/notification.entity";
import { User } from "src/common/entities/user.entity";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findCurrentUserNotifications(
    currentUser: User,
  ): Promise<Notification[]> {
    const notifications: Notification[] =
      await this.notificationRepository.find({
        relations: {
          user: true,
        },
        where: {
          user: {
            id: currentUser.id,
          },
        },
      });

    return notifications;
  }

  async remove(id: number, currentUser: User): Promise<DeleteResult> {
    const notification: Notification =
      await this.notificationRepository.findOneBy({ id });
    if (!notification)
      throw new BadRequestException("notification not found !");

    if (
      currentUser.role !== UserRole.ADMIN &&
      notification.user.id !== currentUser.id
    ) {
      throw new UnauthorizedException("unauthorized !");
    }

    return await this.notificationRepository.delete(id);
  }

  async create({ title, description, url }, userOwner: User): Promise<number> {
    const createNotification: Notification = this.notificationRepository.create(
      {
        title,
        description,
        url,
        user: userOwner,
      },
    );

    return (await this.notificationRepository.save(createNotification)).id;
  }
}
