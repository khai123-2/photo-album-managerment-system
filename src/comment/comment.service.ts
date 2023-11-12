import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { User } from 'src/user/entities/user.entity';
import { PhotoService } from 'src/photo/photo.service';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly photoService: PhotoService,
  ) {}

  async createComment(photoId: string, user: User, data: CreateCommentDto) {
    const photo = await this.photoService.getPhoto({ id: photoId });
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    const comment = this.commentRepository.create(data);
    comment.photo = photo;
    comment.user = user;

    return await this.commentRepository.save(comment);
  }
}
