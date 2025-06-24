import { Injectable } from '@nestjs/common';
import { CreateRightDto } from './dto/create-right.dto';
import { UpdateRightDto } from './dto/update-right.dto';

@Injectable()
export class RightService {
  create(createRightDto: CreateRightDto) {
    return 'This action adds a new right';
  }

  findAll() {
    return `This action returns all right`;
  }

  findOne(id: number) {
    return `This action returns a #${id} right`;
  }

  update(id: number, updateRightDto: UpdateRightDto) {
    return `This action updates a #${id} right`;
  }

  remove(id: number) {
    return `This action removes a #${id} right`;
  }
}
