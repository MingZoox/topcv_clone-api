import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/common/entities/message.entity";
import { User } from "src/common/entities/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UserService,
  ) {}

  async create({ content, to }, currentUser: User): Promise<number> {
    const toUser = await this.userService.findOne(to);
    const createMessage: Message = this.messageRepository.create({
      content,
      from: currentUser,
      to: toUser,
    });

    return (await this.messageRepository.save(createMessage)).id;
  }

  async getInbox(toUserId: number, currentUser: User): Promise<any> {
    const messages: Message[] = await this.messageRepository
      .createQueryBuilder("message")
      .innerJoinAndSelect("message.to", "to")
      .innerJoinAndSelect("message.from", "from")
      .where(
        "(message.from = :fromId OR message.from = :toId) AND (message.to = :fromId OR message.to = :toId)",
        {
          fromId: currentUser.id,
          toId: toUserId,
        },
      )
      .orderBy("createdAt", "ASC")
      .getMany();

    return messages;
  }

  async getUsersSent(currentUser: User): Promise<any> {
    //get distinct users sent
    const tosFroms = await this.messageRepository
      .createQueryBuilder("message")
      .innerJoinAndSelect("message.to", "to")
      .innerJoinAndSelect("message.from", "from")
      .where("message.from = :fromId OR message.to = :toId", {
        fromId: currentUser.id,
        toId: currentUser.id,
      })
      .orderBy("createdAt", "ASC")
      .select("to")
      .addSelect("from")
      .distinct(true)
      .getRawMany();

    for (let i = 0; i < tosFroms.length; i++) {
      for (let j = 0; j < tosFroms.length; j++) {
        if (
          tosFroms[i].to_id === tosFroms[j].from_id &&
          tosFroms[i].from_id === tosFroms[j].to_id
        ) {
          tosFroms.splice(i, 1);
          i--;
          break;
        }
      }
    }

    return tosFroms;
  }
}
