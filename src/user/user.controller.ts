import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { UpdateUserInfoDto } from './dtos/update-user-info.dto';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Patch(':id')
  async updateUserInfo(
    @Param('id') id: string,
    @Body() body: UpdateUserInfoDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.updateUserInfo(id, body);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.CREATED).send();
  }
}
