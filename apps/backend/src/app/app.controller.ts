import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostProducerService } from './queueProducers/post.producer.service';
import { AppService } from './app.service';
import { ArticleType } from '@devit-test-project/library';
import { User, UserBasicInfo } from './users/users.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly postProducerService: PostProducerService
  ) {}

  @UseGuards(LocalAuthGuard) //triggers local-auth.guard.ts which triggers local.strategy.ts
  @Post('login')
  async login(@Request() req): Promise<UserBasicInfo> {
    return req.user;
  }

  @Get('send-post')
  addPost(@Query('post') post: ArticleType) {
    this.postProducerService.addPost(post);
    return post;
  }

  //   @Get('delete-file')
  //   async deleteFile(@Query('fileName') filename: string) {
  //     console.log('filename: ', filename);
  //     await this.fileProducerService.deleteFile(filename);
  //     return `${filename} - deleted`;
  //   }
}
