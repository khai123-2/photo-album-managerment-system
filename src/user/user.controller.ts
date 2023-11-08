import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserInfoDto } from './dtos/update-user-info.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUsers(@Res() res: Response) {
    const data = await this.userService.getUsers();
    return res.status(HttpStatus.CREATED).send({ data });
  }

  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
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

  @ApiBearerAuth()
  @Patch('change-password/:id')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Param('id') id: string,
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
