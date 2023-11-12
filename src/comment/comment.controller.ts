import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Auth, CurrentUser, UUIDParam } from 'src/decorators';
import { User } from 'src/user/entities/user.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':photoId')
  @Auth()
  async createComment(
    @UUIDParam('photoId') photoId: string,
    @CurrentUser() user: User,
    @Body() body: CreateCommentDto,
    @Res() res: Response,
  ) {
    const comment = await this.commentService.createComment(
      photoId,
      user,
      body,
    );
    return res.status(HttpStatus.OK).send({ data: comment });
  }
}
