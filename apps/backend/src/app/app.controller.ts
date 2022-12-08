import { Controller, Get, Query } from '@nestjs/common';
import { PostProducerService } from './queueProducers/post.producer.service';
import { AppService } from './app.service';
import { ArticleType } from '@devit-test-project/library';

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
