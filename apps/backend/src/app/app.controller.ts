import { Controller, Get, Query } from '@nestjs/common';
import { PostProducerService } from 'backend/src/app/queueProducers/post.producer.service';
import { Article } from 'backend/src/assets/article.type';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly postProducerService: PostProducerService,
  ) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get('send-post')
  addPost(@Query('post') post: Article) {
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
