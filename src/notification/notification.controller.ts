import { Controller, Delete, Get, Param, ParseIntPipe } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Auth } from "src/common/decorators/role-auth.decorator";
import { User } from "src/common/entities/user.entity";
import { NotificationService } from "./notification.service";

@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get("me")
  @Auth()
  getCurrentUserNotifications(@CurrentUser() currentUser: User) {
    return this.notificationService.findCurrentUserNotifications(currentUser);
  }

  @Delete(":id")
  @Auth()
  remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.notificationService.remove(id, currentUser);
  }
}
