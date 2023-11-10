import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Res,
} from '@nestjs/common';
import { UpdateUserInfoDto } from './dtos/update-user-info.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, UUIDParam } from 'src/decorators';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @Auth()
  async getUsers(@Res() res: Response) {
    const data = await this.userService.getUsers();
    return res.status(HttpStatus.CREATED).send({ data });
  }

  @Patch(':id')
  @Auth()
  async updateUserInfo(
    @UUIDParam('id') id: string,
    @Body() body: UpdateUserInfoDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.updateUserInfo(id, body);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.CREATED).send();
  }

  @Patch('change-password/:id')
  @Auth()
  async changePassword(
    @UUIDParam('id') id: string,
    @Body() body: ChangePasswordDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.changePassword(id, body);
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.CREATED).send();
  }
}
