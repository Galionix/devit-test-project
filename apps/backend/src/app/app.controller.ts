import { ArticleType, ILoginResponse } from '@devit-test-project/library';
import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { PostProducerService } from './queueProducers/post.producer.service';
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
}
