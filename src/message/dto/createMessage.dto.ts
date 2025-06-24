import { IsDate, IsOptional, IsString } from 'class-validator';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Person } from 'src/person/entities/person.entity';
import { Status } from 'src/status/entities/status.entity';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsOptional()
  status: Status;

  @IsOptional()
  sender: Person;

  @IsOptional()
  recipient: Person;

  @IsOptional()
  conversation: Conversation;
}
