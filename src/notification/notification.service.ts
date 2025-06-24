import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from 'src/person/entities/person.entity';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async getNotifications() {
    const notifications = await this.notificationRepository.find({
      order: { isRead: 'ASC', createdAt: 'DESC' },
    });
    const unreadCount = await this.notificationRepository.count({
      where: { isRead: false },
    });

    return {
      unreadCount,
      notifications,
    };
  }
  async sendNotifications(
    title: string,
    content: string,
    type: string,
    targetLink: string,
    users: Person[],
  ): Promise<void> {
    for (const user of users) {
      if (!(user instanceof Person)) {
        throw new Error('Recipient must be an instance of Person.');
      }

      const notification = this.notificationRepository.create({
        title,
        content,
        type,
        targetLink,
        users: [user],
      });

      await this.notificationRepository.save(notification);
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true; // Set the isRead property to true
    await this.notificationRepository.save(notification); // Save the updated entity

    return true;
  }
}
