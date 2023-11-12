import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { UpdateUserInfoDto } from './dtos/update-user-info.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth, CurrentUser, UUIDParam } from 'src/decorators';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/current-user')
  @Auth()
  async getCurrentUser(@CurrentUser() user: User, @Res() res: Response) {
    const data = await this.userService.getCurrentUser(user);
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

  @Post('follow/:followingId')
  @Auth()
  async follow(
    @UUIDParam('followingId') followingId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const result = await this.userService.followUser(user.id, followingId);
    if (!result) {
      throw new BadRequestException();
    }
    return res.status(HttpStatus.CREATED).send();
  }
}
