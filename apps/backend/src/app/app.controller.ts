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
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

export interface ILoginResponse {
  access_token: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly postProducerService: PostProducerService
  ) {}

  @UseGuards(LocalAuthGuard) //triggers local-auth.guard.ts which triggers local.strategy.ts
  @Post('login')
  // TODO: login: extract type to library
  login(@Request() req): Promise<ILoginResponse> {
    return this.authService.login(req.user);
  }

  @Get('send-post')
  addPost(@Query('post') post: ArticleType) {
    this.postProducerService.addPost(post);
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }
  //   @Get('delete-file')
  //   async deleteFile(@Query('fileName') filename: string) {
  //     console.log('filename: ', filename);
  //     await this.fileProducerService.deleteFile(filename);
  //     return `${filename} - deleted`;
  //   }
}
