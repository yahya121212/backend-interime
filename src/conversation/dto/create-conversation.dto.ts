import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { Message } from 'src/message/entities/message.entity';
import { Person } from 'src/person/entities/person.entity';
import { Status } from 'src/status/entities/status.entity';

export class CreateConversationDto {
  @IsString()
  type: string;

  @Type(() => Message)
  messages: Message[];

  @Type(() => Person)
  participants: Person[];

  @Type(() => Status)
  status: Status;
}
