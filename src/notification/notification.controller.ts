import { Controller, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get()
  async allNotifications() {
    return await this.notificationService.getNotifications();
  }


  @Get(':id/read')
  async markAsRead(@Param('id') notificationId: string) {
    return await this.notificationService.markAsRead(notificationId);
  }
}
