import { Controller, Post, Body, Res } from '@nestjs/common';
import { MessageService } from './message.service';
import { PersonService } from 'src/person/person.service';
import { JobOfferService } from 'src/job-offer/job-offer.service';
import { StatusService } from 'src/status/status.service';
import { Response } from 'express';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly offerService: JobOfferService,
    private readonly userService: PersonService,
    private readonly statusService: StatusService,
  ) {}

  @Post()
  create(@Body() createMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Post('send')
  async sendMessage(@Body() formData: any, @Res() res: Response) {
    const { closeOffer, offer, message, candidateId, employerId } = formData;

    try {
      if (closeOffer) {
        await this.offerService.updateOfferStatus(offer, 'Closed');
      }

      // Get all admin users
      const admins = await this.userService.findAllAdmins();
      const sender = await this.userService.findOne(employerId);

      const messageStatus = await this.statusService.findStatus(
        'Unread',
        'Notification',
      );

      //change application status to Recruitment Approved
      const applicationStatus = await this.statusService.findStatus(
        'Recruitment Approved',
        'Candidate',
      );

      this.offerService.createApplication(
        offer,
        candidateId,
        applicationStatus,
        message,
      );

      // Prepare messages for each admin
      if (admins) {
        await this.messageService.createMessage({
          content: message,
          sender,
          recipient: admins[0],
          status: messageStatus,
        });
      }

      // Return a success response
      return res.status(200).json({
        status: 'success',
        message: 'Message sent successfully.',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Return an error response
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send message. Please try again later.',
      });
    }
  }
}
